import { Record } from './Record'

export type Team = Record & {
  owner_id: string

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
