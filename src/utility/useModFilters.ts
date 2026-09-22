import { type ChangeEvent, useCallback, useState } from 'react'
import type { Filters } from '@/utility/modFilters.ts'

const DEFAULT_FILTERS: Filters = {
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

/** A tri-state checkbox cycles unset → excluded → required → unset. */
function nextFlag(current: Filters[string]): boolean | null {
  if (current === null) {
    return false
  }
  return current ? null : true
}

export function useModFilters(): {
  filters: Filters
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleFilterCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void
} {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }, [])
  const handleFilterCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    setFilters((prev) => ({ ...prev, [name]: nextFlag(prev[name]) }))
  }, [])
  return { filters, handleFilterChange, handleFilterCheckboxChange }
}
