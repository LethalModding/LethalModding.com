import { Record } from './Record'

export type Profile = Record & {
  avatar_url?: string | null
  display_flag?: number
  full_name: string
  username?: string | null

  socials?: string | null
  website?: string | null
}
