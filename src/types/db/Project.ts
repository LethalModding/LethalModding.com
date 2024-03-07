import { Record } from './Record'

export type Project = Record & {
  created_by: string
  team_id: string

  name: string
  type: 'public' | 'private'
}
