function readEnv(value: string | undefined, fallback = ''): string {
  return value === undefined || value === '' ? fallback : value
}

/** NEXT_PUBLIC_* values safe for client bundles; each needs a literal process.env.X so Next inlines it. */
export const publicEnv = {
  baseUrl: readEnv(process.env.NEXT_PUBLIC_BASE_URL),
  branding: readEnv(process.env.NEXT_PUBLIC_BRANDING),
  supabaseAnonKey: readEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseUrl: readEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
} as const

/** Server-only configuration; import only from server code. */
export const serverEnv = {
  githubToken: readEnv(process.env.GITHUB_TOKEN),
  mailgunDomain: readEnv(process.env.MAILGUN_DOMAIN),
  mailgunSendKey: readEnv(process.env.MAILGUN_SEND_KEY),
  nodeEnv: readEnv(process.env.NODE_ENV, 'development'),
  supabaseServiceKey: readEnv(process.env.SUPABASE_SERVICE_KEY),
} as const
