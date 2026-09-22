import type { Record } from './Record.ts'

export type Project = Record & {
  created_by: string
  team_id: string

  name: string
  summary: string
  type: 'public' | 'private'
}
