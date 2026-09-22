import type { Mod } from "@/types/Mod.ts";
import type { ModSort } from "@/types/ModSort.ts";

export interface Filters {
  hasDonation: boolean | null;
  hasNSFW: boolean | null;
  hasWebsite: boolean | null;
  isDeprecated: boolean | null;
  isPinned: boolean | null;
  maxDependencies: number;
  minDependencies: number;
  maxDownloads: number;
  minDownloads: number;
  maxRatings: number;
  minRatings: number;
  maxSize: number;
  minSize: number;
  name: string;
  owner: string;
  [key: string]: string | number | boolean | null | undefined;
}

export const MEBI = 1024 * 1024;

export interface CategoryFilters {
  includes: string[];
  excludes: string[];
}

export function filterMods(allMods: Mod[], filters: Filters, categories: CategoryFilters): Mod[] {
  const includesCategoryFilter = categories.includes;
  const excludesCategoryFilter = categories.excludes;
  return allMods.filter((mod) => {
    if (
      includesCategoryFilter.length > 0 &&
      !mod.categories.some((category) => includesCategoryFilter.includes(category))
    ) {
      return false;
    }

    if (
      excludesCategoryFilter.length > 0 &&
      mod.categories.some((category) => excludesCategoryFilter.includes(category))
    ) {
      return false;
    }

    if (filters.hasNSFW !== null && mod.has_nsfw_content !== filters.hasNSFW) {
      return false;
    }

    if (filters.isDeprecated !== null && mod.is_deprecated !== filters.isDeprecated) {
      return false;
    }

    if (filters.isPinned !== null && mod.is_pinned !== filters.isPinned) {
      return false;
    }

    if (filters.maxRatings > -1 && mod.rating_score > filters.maxRatings) {
      return false;
    }

    if (filters.minRatings > 0 && mod.rating_score < filters.minRatings) {
      return false;
    }

    if (
      filters.hasDonation !== null &&
      (filters.hasDonation ? mod.donation_link === undefined : mod.donation_link !== undefined)
    ) {
      return false;
    }

    if (filters.name && !mod.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (filters.owner && !mod.owner.toLowerCase().includes(filters.owner.toLowerCase())) {
      return false;
    }

    if (
      filters.maxDependencies > -1 &&
      mod.versions[0].dependencies.length > filters.maxDependencies
    ) {
      return false;
    }

    if (
      filters.minDependencies > 0 &&
      mod.versions[0].dependencies.length < filters.minDependencies
    ) {
      return false;
    }

    // downloads across all versions
    const totalDownloads = mod.versions.reduce((acc, cur) => acc + cur.downloads, 0);
    if (filters.maxDownloads > -1 && totalDownloads > filters.maxDownloads) {
      return false;
    }

    if (filters.minDownloads > 0 && totalDownloads < filters.minDownloads) {
      return false;
    }

    if (filters.maxSize > -1 && mod.versions[0].file_size > filters.maxSize * MEBI) {
      return false;
    }

    if (filters.minSize > 0 && mod.versions[0].file_size < filters.minSize * MEBI) {
      return false;
    }

    if (
      filters.hasWebsite !== null &&
      (filters.hasWebsite ? mod.versions[0].website_url === "" : mod.versions[0].website_url !== "")
    ) {
      return false;
    }

    return true;
  });
}

export function sortMods(mods: Mod[], sort: ModSort): Mod[] {
  const newMods = [...mods];
  newMods.sort((a, b) => {
    if (sort.property === "name") {
      return sort.direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sort.property === "owner") {
      return sort.direction === "asc"
        ? a.owner.localeCompare(b.owner)
        : b.owner.localeCompare(a.owner);
    }
    if (sort.property === "downloads") {
      const totalA = a.versions.reduce((acc, cur) => acc + cur.downloads, 0);
      const totalB = b.versions.reduce((acc, cur) => acc + cur.downloads, 0);
      return sort.direction === "asc" ? totalA - totalB : totalB - totalA;
    }
    if (sort.property === "ratings") {
      return sort.direction === "asc"
        ? a.rating_score - b.rating_score
        : b.rating_score - a.rating_score;
    }
    if (sort.property === "size") {
      return sort.direction === "asc"
        ? a.versions[0].file_size - b.versions[0].file_size
        : b.versions[0].file_size - a.versions[0].file_size;
    }
    if (sort.property === "dependencies") {
      return sort.direction === "asc"
        ? a.versions[0].dependencies.length - b.versions[0].dependencies.length
        : b.versions[0].dependencies.length - a.versions[0].dependencies.length;
    }
    return 0;
  });
  return newMods;
}
