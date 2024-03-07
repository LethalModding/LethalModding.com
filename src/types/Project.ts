export type Project = {
  id: string
  
  created_at: string
  updated_at: string
  deleted_at?: string

  created_by: string
  team_id: string

  name: string
  type: 'public' | 'private'
}
