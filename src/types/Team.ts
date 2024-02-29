export type Team = {
  id: string
  owner_id: string

  created_at: string
  updated_at: string
  deleted_at?: string

  // avatar: string
  name: string
  bio: string
  location: string
  socials: string
  website: string

  members: string[]
  // projects: string[]
  // reputation: number
}
