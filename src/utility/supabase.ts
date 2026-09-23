import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export interface SupabaseState {
  client: SupabaseClient
  session: Session | null
}

export const SupabaseContext = createContext<SupabaseState | null>(null)

function useSupabase(): SupabaseState {
  const state = useContext(SupabaseContext)
  if (state === null) {
    throw new Error('Supabase hooks need a SupabaseProvider above them')
  }
  return state
}

export function useSupabaseClient(): SupabaseClient {
  return useSupabase().client
}

export function useSession(): Session | null {
  return useSupabase().session
}

export function useUser(): User | null {
  return useSupabase().session?.user ?? null
}
