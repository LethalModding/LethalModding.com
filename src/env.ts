function readEnv(name: string, fallback = ''): string {
  const value = process.env[name]
  if (value === undefined || value === '') {
    return fallback
  }
  return value
}

/** NEXT_PUBLIC_* values safe for client bundles. */
export const publicEnv = {
  baseUrl: readEnv('NEXT_PUBLIC_BASE_URL'),
  branding: readEnv('NEXT_PUBLIC_BRANDING'),
  supabaseAnonKey: readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseUrl: readEnv('NEXT_PUBLIC_SUPABASE_URL'),
} as const

/** Server-only configuration; import only from server code. */
export const serverEnv = {
  githubToken: readEnv('GITHUB_TOKEN'),
  mailgunDomain: readEnv('MAILGUN_DOMAIN'),
  mailgunSendKey: readEnv('MAILGUN_SEND_KEY'),
  nodeEnv: readEnv('NODE_ENV', 'development'),
  supabaseServiceKey: readEnv('SUPABASE_SERVICE_KEY'),
} as const
