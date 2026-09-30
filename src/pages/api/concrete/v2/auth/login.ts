import { promises as fsPromises } from 'node:fs'
import process from 'node:process'
import type { ParsedGroup, ParsedMailbox } from 'email-addresses'
import addrs from 'email-addresses'
import type { NextApiRequest, NextApiResponse } from 'next'
import { publicEnv } from '@/env.ts'
import { readTemplate, sendEmail } from '@/server/email.ts'
import { rateLimit } from '@/server/rate-limit.ts'
import { supabaseSERVER } from '@/server/supabaseServer.ts'
import logo from '../../../../../../public/icons/android-chrome-512x512.png'

const { readFile } = fsPromises

const MS_PER_SECOND = 1000
const RATE_LIMIT_WINDOW_MS = 60 * MS_PER_SECOND
const RATE_LIMIT_MAX_TOKENS = 500
const RATE_LIMIT_MAX_REQUESTS = 10
const HTTP_BAD_REQUEST = 400
const HTTP_OK = 200
const HTTP_TOO_MANY_REQUESTS = 429
const HTTP_INTERNAL_ERROR = 500
const HTTP_METHOD_NOT_ALLOWED = 405

function isValidEmail(obj: ParsedMailbox | ParsedGroup): obj is ParsedMailbox {
  return obj.type === 'mailbox'
}

const limiter = rateLimit({
  interval: RATE_LIMIT_WINDOW_MS,
  uniqueTokenPerInterval: RATE_LIMIT_MAX_TOKENS,
})

interface PostBody {
  email: string
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { email }: PostBody = req.body
  const parsedEmail: ParsedMailbox | ParsedGroup | null = addrs.parseOneAddress(email)
  if (!(parsedEmail && isValidEmail(parsedEmail))) {
    return res.status(HTTP_BAD_REQUEST).json({ error: 'Invalid email address' })
  }

  try {
    await limiter.check(res, RATE_LIMIT_MAX_REQUESTS, 'CACHE_TOKEN') //
  } catch {
    return res
      .status(HTTP_TOO_MANY_REQUESTS)
      .json({ error: 'Slow down! Wait at least 30 seconds and try again.' })
  }

  const { data, error } = await supabaseSERVER.auth.admin.generateLink({
    email: parsedEmail.address,
    options: {
      redirectTo: publicEnv.baseUrl,
    },
    type: 'magiclink',
  })
  if (error) {
    return res.status(HTTP_INTERNAL_ERROR).json({ error: 'Failed sending email' })
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
    return res.status(HTTP_INTERNAL_ERROR).json({ error: 'Failed sending email' })
  }

  return res.status(HTTP_OK).json({ message: 'Email sent' })
}

async function handler(req: NextApiRequest, res: NextApiResponse<Response>): Promise<void> {
  const { method } = req

  switch (method) {
    case 'OPTIONS':
      res.status(HTTP_OK).end()
      break
    case 'POST':
      return await handlePOST(req, res)
    default:
      res.setHeader('Allow', ['POST', 'OPTIONS'])
      res.status(HTTP_METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`)
  }
}

export default handler
