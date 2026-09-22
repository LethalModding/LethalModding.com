import type { Mod } from '@/types/Mod.ts'
import type { ModSort } from '@/types/ModSort.ts'
import type { ModVersion } from '@/types/ModVersion.ts'

export interface Filters {
  hasDonation: boolean | null
  hasNSFW: boolean | null
  hasWebsite: boolean | null
  isDeprecated: boolean | null
  isPinned: boolean | null
  maxDependencies: number
  minDependencies: number
  maxDownloads: number
  minDownloads: number
  maxRatings: number
  minRatings: number
  maxSize: number
  minSize: number
  name: string
  owner: string
  [key: string]: string | number | boolean | null | undefined
}

export const MEBI = 1024 * 1024

export interface CategoryFilters {
  includes: string[]
  excludes: string[]
}

/** `null` means the filter is unset. */
function flagMatches(wanted: boolean | null, actual: boolean): boolean {
  return wanted === null || actual === wanted
}

/** A bound of -1 (max) or 0 (min) means that side is unset. */
function inRange(value: number, min: number, max: number): boolean {
  return !((max > -1 && value > max) || (min > 0 && value < min))
}

function textMatches(needle: string, haystack: string): boolean {
  return !needle || haystack.toLowerCase().includes(needle.toLowerCase())
}

function categoriesMatch(
  modCategories: string[],
  { includes, excludes }: CategoryFilters,
): boolean {
  return (
    (includes.length === 0 || modCategories.some((category) => includes.includes(category))) &&
    !(excludes.length > 0 && modCategories.some((category) => excludes.includes(category)))
  )
}

function totalDownloads(mod: Mod): number {
  return mod.versions.reduce((acc, cur) => acc + cur.downloads, 0)
}

export function filterMods(allMods: Mod[], filters: Filters, categories: CategoryFilters): Mod[] {
  return allMods.filter((mod) => {
    // Thunderstore ships every mod with at least one version; one that has none cannot be
    // filtered on size, dependencies or website, so it is not a match.
    const version = mod.versions[0]
    if (version === undefined) {
      return false
    }
    return (
      categoriesMatch(mod.categories, categories) &&
      flagMatches(filters.hasNSFW, mod.has_nsfw_content) &&
      flagMatches(filters.isDeprecated, mod.is_deprecated) &&
      flagMatches(filters.isPinned, mod.is_pinned) &&
      flagMatches(filters.hasDonation, mod.donation_link !== undefined) &&
      flagMatches(filters.hasWebsite, version.website_url !== '') &&
      textMatches(filters.name, mod.name) &&
      textMatches(filters.owner, mod.owner) &&
      inRange(mod.rating_score, filters.minRatings, filters.maxRatings) &&
      inRange(version.dependencies.length, filters.minDependencies, filters.maxDependencies) &&
      inRange(totalDownloads(mod), filters.minDownloads, filters.maxDownloads) &&
      inRange(version.file_size / MEBI, filters.minSize, filters.maxSize)
    )
  })
}

// Size and dependencies read the latest version; a mod without one sorts as equal rather than
// disturbing the orderings of the others.
function byVersion(read: (version: ModVersion) => number): (a: Mod, b: Mod) => number {
  return (a, b) => {
    const [aVersion] = a.versions
    const [bVersion] = b.versions
    return aVersion === undefined || bVersion === undefined ? 0 : read(aVersion) - read(bVersion)
  }
}

const ASCENDING: Record<ModSort['property'], (a: Mod, b: Mod) => number> = {
  '': () => 0,
  name: (a, b) => a.name.localeCompare(b.name),
  owner: (a, b) => a.owner.localeCompare(b.owner),
  downloads: (a, b) => totalDownloads(a) - totalDownloads(b),
  ratings: (a, b) => a.rating_score - b.rating_score,
  size: byVersion((version) => version.file_size),
  dependencies: byVersion((version) => version.dependencies.length),
}

export function sortMods(mods: Mod[], sort: ModSort): Mod[] {
  const compare = ASCENDING[sort.property]
  return [...mods].sort((a, b) => (sort.direction === 'asc' ? compare(a, b) : compare(b, a)))
}
