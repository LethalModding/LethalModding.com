import { expect, test } from 'bun:test'
import type { Mod } from '@/types/Mod.ts'
import type { ModVersion } from '@/types/ModVersion.ts'
import { type Filters, filterMods } from '@/utility/modFilters.ts'

const unset: Filters = {
  hasDonation: null,
  hasNSFW: false,
  hasWebsite: null,
  isDeprecated: false,
  isPinned: null,
  maxDependencies: -1,
  minDependencies: 0,
  maxDownloads: -1,
  minDownloads: 0,
  maxRatings: -1,
  minRatings: 0,
  maxSize: -1,
  minSize: 0,
  name: '',
  owner: '',
}

const none: { includes: string[]; excludes: string[] } = { includes: [], excludes: [] }

function version(): ModVersion {
  return {
    date_created: '2020-01-01',
    full_name: 'owner-mod',
    name: 'mod',
    uuid4: '00000000-0000-0000-0000-000000000001',
    dependencies: [],
    description: '',
    downloads: 0,
    download_url: 'https://example.com/dl',
    file_size: 0,
    icon: '',
    is_active: true,
    version_number: '1.0.0',
    website_url: '',
  }
}

function mod(donationLink: string): Mod {
  return {
    date_created: '2020-01-01',
    date_updated: '2020-01-01',
    full_name: 'owner-mod',
    name: 'mod',
    uuid4: '00000000-0000-0000-0000-000000000000',
    categories: [],
    donation_link: donationLink,
    has_nsfw_content: false,
    is_deprecated: false,
    is_pinned: false,
    owner: 'owner',
    package_url: 'https://example.com',
    rating_score: 0,
    versions: [version()],
  }
}

test('hasDonation required drops an empty donation_link', () => {
  const withLink = mod('https://ko-fi.com/owner')
  const without = mod('')
  const required = { ...unset, hasDonation: true }
  expect(filterMods([withLink, without], required, none).map((m) => m.donation_link)).toEqual([
    withLink.donation_link,
  ])
})
