import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'
import Head from 'next/head'
import type { JSX } from 'react'
import { useMemo, useState } from 'react'
import { CornerAccents } from '@/components/branding/CornerAccents.tsx'
import { Breadcrumb } from '@/components/tools/Breadcrumb.tsx'
import { ModFilterFields } from '@/components/tools/ModFilterFields.tsx'
import { ModGrid } from '@/components/tools/ModGrid.tsx'
import { Pagination } from '@/components/tools/Pagination.tsx'
import type { ModSort } from '@/types/ModSort.ts'
import { filterMods, sortMods } from '@/utility/modFilters.ts'
import { useModFilters } from '@/utility/useModFilters.ts'
import { useThunderstoreMods } from '@/utility/useThunderstoreMods.ts'

const ToolsHome: NextPage = (): JSX.Element => {
  const { allCategories, allMods, loadError } = useThunderstoreMods()

  //
  // Filters
  //

  const { filters, handleFilterChange, handleFilterCheckboxChange } = useModFilters()

  const [includesCategoryFilter, setIncludesCategoryFilter] = useState<string[]>([])
  const [excludesCategoryFilter, setExcludesCategoryFilter] = useState<string[]>([])

  const filteredMods = useMemo(
    () =>
      filterMods(allMods, filters, {
        includes: includesCategoryFilter,
        excludes: excludesCategoryFilter,
      }),
    [allMods, filters, includesCategoryFilter, excludesCategoryFilter],
  )

  //
  // Sorting
  //

  const [sort, setSort] = useState<ModSort>({
    direction: 'asc',
    property: '',
  })

  const sortedMods = useMemo(() => sortMods(filteredMods, sort), [filteredMods, sort])

  //
  // Pagination
  //

  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(100)

  const thisPage = useMemo(
    () => sortedMods.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    [sortedMods, pageNumber, pageSize],
  )

  const pagination = (
    <Pagination
      pageNumber={pageNumber}
      pageSize={pageSize}
      totalResults={sortedMods.length}
      setPageNumber={setPageNumber}
      setPageSize={setPageSize}
      setSort={setSort}
      sort={sort}
    />
  )

  return (
    <>
      <Head>
        <title>Your Source for Lethal Company Tools</title>
      </Head>

      <CornerAccents />

      <Box
        sx={{
          height: 'calc(100vh - 56px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          p: 6,
          pb: 4,

          '&::-webkit-scrollbar': {
            width: '0.5em',
            height: '0.5em',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--accent)',
          },
        }}
      >
        <Breadcrumb parts={['Tools', 'Thunderstore Search']} />

        {loadError !== null && (
          <Typography color="error" sx={{ mt: 3 }} variant="body2">
            {loadError}
          </Typography>
        )}

        <ModFilterFields
          allCategories={allCategories}
          excludesCategoryFilter={excludesCategoryFilter}
          filters={filters}
          includesCategoryFilter={includesCategoryFilter}
          onFilterChange={handleFilterChange}
          onFilterCheckboxChange={handleFilterCheckboxChange}
          setExcludesCategoryFilter={setExcludesCategoryFilter}
          setIncludesCategoryFilter={setIncludesCategoryFilter}
        />

        {pagination}

        <ModGrid mods={thisPage} />

        {pagination}
      </Box>
    </>
  )
}

export default ToolsHome
