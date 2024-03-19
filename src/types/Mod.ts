import type { ModStub } from './ModStub'
import type { ModVersion } from './ModVersion'

export type Mod = ModStub & {
  categories: string[]
  date_updated: string
  donation_link: string
  has_nsfw_content: boolean
  is_deprecated: boolean
  is_pinned: boolean
  owner: string
  package_url: string
  rating_score: number
  versions: ModVersion[]
}
