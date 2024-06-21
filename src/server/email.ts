import FormData from 'form-data'
import { promises as fsPromises } from 'fs'
import Handlebars from 'handlebars'
import Mailgun from 'mailgun.js'
import path from 'path'

const mailgun = new Mailgun(FormData)

const mg = mailgun.client({
  username: 'api',
  key:      process.env.MAILGUN_SEND_KEY ?? '',
})

export async function readTemplate(
  templateName: string,
  options?: Record<string, unknown>
): Promise<string | null> {
  try {
    const rootPath = process.env.NODE_ENV === 'production' ?
      `/app/src/server/${process.env.NEXT_PUBLIC_BRANDING}/emails` :
      `./src/server/${process.env.NEXT_PUBLIC_BRANDING}/emails`

    const templatePath = path.join(rootPath, `${templateName}.hbs`)
    const templateContent = await fsPromises.readFile(templatePath, 'utf-8')
    const template = Handlebars.compile(templateContent)
    return template(options ?? {})
  } catch (error) {
    console.error('Error rendering the email template:', error)
    return null
  }
}

export async function sendEmail(
  to: string | string[],
  subject: string,
  text: string,
  html?: string,
  options?: {
    [key: string]: string | string[] | number | boolean | Record<string, unknown> | undefined
  }
): Promise<void> {
  const resp = await mg.messages.create(process.env.MAILGUN_DOMAIN ?? '', {
    from: `no-reply@${process.env.MAILGUN_DOMAIN}`,
    to:   to instanceof Array ? to : [to],
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
