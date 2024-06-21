import type { ParsedGroup, ParsedMailbox } from 'email-addresses'
import addrs from 'email-addresses'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { readTemplate, sendEmail } from 'server/email'
import rateLimit from 'server/rate-limit'
import { supabaseSERVER } from 'server/supabaseServer'

import { promises as fsPromises } from 'fs'
import logo from '../../../../../../public/icons/android-chrome-512x512.png'
const { readFile } = fsPromises

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
): Promise<void> {
  const { method } = req

  switch (method)
  {
  case 'OPTIONS':
    res.status(200).end()
    break
  case 'POST':
    return handlePOST(req, res)
  default:
    res.setHeader('Allow', ['POST','OPTIONS'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidEmail(obj: any): obj is ParsedMailbox {
  return !!obj.local && !!obj.domain
}

const limiter = rateLimit({
  interval:               60 * 1000,
  uniqueTokenPerInterval: 500,
})

type PostBody = {
  email: string
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // // Ensure the user is authenticated and authorized to access the platform
  // const supabaseServerClient = createPagesServerClient({ req, res })
  // const { data: { session } } = await supabaseServerClient.auth.getSession()
  //
  // if (session === null) {
  //   return res.status(401).json({
  //     code:    401,
  //     error:   'not_authenticated',
  //     message: 'The user does not have an active session or is not authenticated',
  //   })
  // }

  const { email }: PostBody = req.body
  const parsedEmail: ParsedMailbox | ParsedGroup | null =
    addrs.parseOneAddress(email)
  if (!parsedEmail || !isValidEmail(parsedEmail)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    await limiter.check(res, 10, 'CACHE_TOKEN') //
  } catch {
    return res
      .status(429)
      .json({ error: 'Slow down! Wait at least 30 seconds and try again.' })
  }

  const { data, error } = await supabaseSERVER.auth.admin.generateLink({
    email:   parsedEmail.address,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
    type: 'magiclink',
  })
  if (error) return res.status(500).json({ error: 'Failed sending email' })

  let firstName =
    data.user.user_metadata?.first_name ??
    data.user.app_metadata?.first_name ??
    data.user.user_metadata?.first_name ??
    ''

  const { data: profileData, error: profileError } = await supabaseSERVER
    .from('profiles')
    .select('first_name')
    .eq('user_id', data.user.id)
    .single()

  if (!profileError && profileData)
    if (!firstName) firstName = profileData.first_name ?? ''

  try {
    const logoData = await readFile(
      `${process.cwd()}${logo.src.replace('_next', '.next')}`
    )
    await sendEmail(
      parsedEmail.address,
      'LethalModding.com - Your Login Link',
      'Please enable HTML to view this email.',
      (await readTemplate('user-login', {
        ConfirmationURL: `${process.env.NEXT_PUBLIC_BASE_URL}/login/?token=${data.properties.hashed_token}`,
        FirstName:       `${firstName}`,
        LoginToken:      data.properties.hashed_token,
        LogoSrc:         'cid:lethalmodding-logo.png',
      })) ?? undefined,
      {
        inline: {
          data:     logoData,
          filename: 'lethalmodding-logo.png',
        },
        'o:tracking-clicks': false,
      }
    )
  } catch (error) {
    return res.status(500).json({ error: 'Failed sending email' })
  }

  return res.status(200).json({ message: 'Email sent' })
}
