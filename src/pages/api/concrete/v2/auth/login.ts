import { promises as fsPromises } from 'node:fs'
import process from 'node:process'
import type { ParsedGroup, ParsedMailbox } from 'email-addresses'
import addrs from 'email-addresses'
import type { NextApiRequest, NextApiResponse } from 'next'
import { readTemplate, sendEmail } from '@/server/email.ts'
import { rateLimit } from '@/server/rate-limit.ts'
import { supabaseSERVER } from '@/server/supabaseServer.ts'
import logo from '../../../../../../public/icons/android-chrome-512x512.png'

const { readFile } = fsPromises

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
): Promise<void> {
  const { method } = req

  switch (method) {
    case 'OPTIONS':
      res.status(200).end()
      break
    case 'POST':
      return await handlePOST(req, res)
    default:
      res.setHeader('Allow', ['POST', 'OPTIONS'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

function isValidEmail(obj: ParsedMailbox | ParsedGroup): obj is ParsedMailbox {
  return obj.type === 'mailbox'
}

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

interface PostBody {
  email: string
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { email }: PostBody = req.body
  const parsedEmail: ParsedMailbox | ParsedGroup | null = addrs.parseOneAddress(email)
  if (!(parsedEmail && isValidEmail(parsedEmail))) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    await limiter.check(res, 10, 'CACHE_TOKEN') //
  } catch {
    return res.status(429).json({ error: 'Slow down! Wait at least 30 seconds and try again.' })
  }

  const { data, error } = await supabaseSERVER.auth.admin.generateLink({
    email: parsedEmail.address,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
    type: 'magiclink',
  })
  if (error) {
    return res.status(500).json({ error: 'Failed sending email' })
  }

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

  if (!profileError && profileData && !firstName) {
    firstName = profileData.first_name ?? ''
  }

  try {
    const logoData = await readFile(`${process.cwd()}${logo.src.replace('_next', '.next')}`)
    await sendEmail(
      parsedEmail.address,
      {
        subject: 'LethalModding.com - Your Login Link',
        text: 'Please enable HTML to view this email.',
        html:
          (await readTemplate('user-login', {
            ConfirmationURL: data.properties.action_link,
            FirstName: `${firstName}`,
            LogoSrc: 'cid:lethalmodding-logo.png',
          })) ?? undefined,
      },
      {
        inline: {
          data: logoData,
          filename: 'lethalmodding-logo.png',
        },
        'o:tracking-clicks': false,
      },
    )
  } catch {
    return res.status(500).json({ error: 'Failed sending email' })
  }

  return res.status(200).json({ message: 'Email sent' })
}
