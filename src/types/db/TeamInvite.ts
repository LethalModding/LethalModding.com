import type { Record } from './Record'

export type TeamInvite = Record & {
  inviter: string
  team_id: string
  email: string
  type: string
}
