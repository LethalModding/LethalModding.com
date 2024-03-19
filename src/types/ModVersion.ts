import type { ModStub } from './ModStub'

export type ModVersion = ModStub & {
  dependencies: string[]
  description: string
  downloads: number
  download_url: string
  file_size: number
  icon: string
  is_active: boolean
  version_number: string
  website_url: string
}
