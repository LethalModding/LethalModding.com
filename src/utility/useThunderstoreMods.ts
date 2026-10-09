import { ofetch } from 'ofetch'
import { useEffect, useMemo, useState } from 'react'
import type { Mod } from '@/types/Mod.ts'

const THUNDERSTORE_FETCH_DELAY_MS = 100

/** Every Lethal Company package on Thunderstore, and the sorted set of their categories. */
export function useThunderstoreMods(): {
  allCategories: string[]
  allMods: Mod[]
  loadError: string | null
} {
  const [allMods, setAllMods] = useState<Mod[]>([])
  // A failed fetch would otherwise render as an empty result set, which reads
  // as "Thunderstore has no mods" rather than "the search is unavailable".
  const [loadError, setLoadError] = useState<string | null>(null)
  useEffect(() => {
    const timeout = setTimeout(() => {
      ofetch('https://thunderstore.io/c/lethal-company/api/v1/package/')
        .then((data) => {
          if (data.error) {
            setLoadError(String(data.error))
            return
          }

          setLoadError(null)
          setAllMods(data)
        })
        .catch(() => {
          setLoadError('Could not reach the Thunderstore API.')
        })
    }, THUNDERSTORE_FETCH_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [])

  const allCategories = useMemo(
    () => Array.from(new Set(allMods.flatMap((mod) => mod.categories))).sort(compareCodeUnits),
    [allMods],
  )

  return { allCategories, allMods, loadError }
}

function compareCodeUnits(a: string, b: string): number {
  if (a < b) {
    return -1
  }
  return a > b ? 1 : 0
}
