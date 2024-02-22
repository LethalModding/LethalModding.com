export type TeamInvite = {
  id: string

  created_at: string
  updated_at: string
  deleted_at?: string

  inviter: string
  team_id: string
  email: string
  type: string
}
