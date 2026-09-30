import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

interface SupabaseState {
  client: SupabaseClient
  session: Session | null
}

const SupabaseContext = createContext<SupabaseState | null>(null)

function useSupabase(): SupabaseState {
  const state = useContext(SupabaseContext)
  if (state === null) {
    throw new Error('Supabase hooks need a SupabaseProvider above them')
  }
  return state
}

function useSupabaseClient(): SupabaseClient {
  return useSupabase().client
}

function useSession(): Session | null {
  return useSupabase().session
}

function useUser(): User | null {
  return useSupabase().session?.user ?? null
}

export type { SupabaseState }
export { SupabaseContext, useSession, useSupabaseClient, useUser }
