import { createClient } from '@supabase/supabase-js'
import { publicEnv, serverEnv } from '@/env.ts'

export const supabaseSERVER = createClient(publicEnv.supabaseUrl, serverEnv.supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
