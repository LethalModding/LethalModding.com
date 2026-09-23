import { createBrowserClient } from '@supabase/ssr'
import type { Session } from '@supabase/supabase-js'
import type { JSX, PropsWithChildren } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { SupabaseContext } from '@/utility/supabase.ts'

export function SupabaseProvider({ children }: PropsWithChildren): JSX.Element {
  const [client] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    ),
  )
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // The first callback is INITIAL_SESSION, so this also loads the stored session.
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => subscription.unsubscribe()
  }, [client])

  const value = useMemo(() => ({ client, session }), [client, session])
  return <SupabaseContext value={value}>{children}</SupabaseContext>
}
