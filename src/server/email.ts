import { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import FormData from 'form-data'
import Handlebars from 'handlebars'
import Mailgun from 'mailgun.js'
import { publicEnv, serverEnv } from '@/env.ts'
import { logError } from '@/server/log.ts'

const mailgun = new Mailgun(FormData)

const mg = mailgun.client({
  username: 'api',
  key: serverEnv.mailgunSendKey,
})

export async function readTemplate(
  templateName: string,
  options?: Record<string, unknown>,
): Promise<string | null> {
  try {
    const rootPath =
      serverEnv.nodeEnv === 'production'
        ? `/app/src/server/${publicEnv.branding}/emails`
        : `./src/server/${publicEnv.branding}/emails`

    const templatePath = path.join(rootPath, `${templateName}.hbs`)
    const templateContent = await fsPromises.readFile(templatePath, 'utf-8')
    const template = Handlebars.compile(templateContent)
    return template(options ?? {})
  } catch (error) {
    logError('Error rendering the email template:', error)
    return null
  }
}

export interface EmailBody {
  subject: string
  text: string
  html?: string | undefined
}

export async function sendEmail(
  to: string | string[],
  body: EmailBody,
  options?: {
    [key: string]: string | string[] | number | boolean | Record<string, unknown> | undefined
  },
): Promise<void> {
  const { subject, text, html } = body
  const resp = await mg.messages.create(serverEnv.mailgunDomain, {
    from: `no-reply@${serverEnv.mailgunDomain}`,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
    ...(options ?? {
      'o:tracking-clicks': false,
    }),
  })

  if (resp.message !== 'Queued. Thank you.') {
    throw new Error('Failed to send email.', { cause: resp })
  }

  return await Promise.resolve()
}
