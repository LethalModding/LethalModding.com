import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CornerAccents from 'components/branding/CornerAccents'
import Link from 'components/mui/Link'
import Breadcrumb from 'components/tools/Breadcrumb'
import Pagination from 'components/tools/Pagination'
import { type NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ofetch } from 'ofetch'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import { type Mod } from 'types/Mod'
import { type ModSort } from 'types/ModSort'

type Filters = {
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

const MEBI = 1024 * 1024

const ToolsHome: NextPage = (): JSX.Element => {
  const [allMods, setAllMods] = useState<Mod[]>([])
  useEffect(() => {
    const timeout = setTimeout(() => {
      ofetch('https://thunderstore.io/c/lethal-company/api/v1/package/').then(
        data => {
          if (data.error) {
            console.error(data.error)
            return
          }

          console.log(
            'Got data from Thunderstore API',
            'entries',
            data?.length ?? 0
          )
          setAllMods(data)
        }
      )
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  const [allCategories, setAllCategories] = useState<string[]>([])
  useEffect(() => {
    const newCategories = new Set<string>()
    allMods.forEach(mod =>
      mod.categories.forEach(category => newCategories.add(category))
    )
    setAllCategories(Array.from(newCategories).sort())
  }, [allMods])

  //
  // Filters
  //

  const [filters, setFilters] = useState<Filters>({
    hasDonation:     null,
    hasNSFW:         false,
    hasWebsite:      null,
    isDeprecated:    false,
    isPinned:        null,
    maxDependencies: -1,
    minDependencies: 0,
    maxDownloads:    -1,
    minDownloads:    0,
    maxRatings:      -1,
    minRatings:      0,
    maxSize:         -1,
    minSize:         0,
    name:            '',
    owner:           '',
  })
  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }, [])
  const handleFilterCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target
      const oldValue = filters[name]
      let value: boolean | null = null

      if (oldValue === null) {
        value = false
      } else if (oldValue) {
        value = null
      } else {
        value = true
      }

      setFilters(prev => ({ ...prev, [name]: value }))
    },
    [filters]
  )

  const [includesCategoryFilter, setIncludesCategoryFilter] = useState<
    string[]
  >([])
  const handleIncludesCategoryFilterChange = useCallback(
    (e: SelectChangeEvent<string[]>) => {
      if (typeof e.target.value === 'string') {
        setIncludesCategoryFilter(e.target.value.split(','))
      } else {
        setIncludesCategoryFilter(e.target.value)
      }
    },
    []
  )
  const [excludesCategoryFilter, setExcludesCategoryFilter] = useState<
    string[]
  >([])
  const handleExcludesCategoryFilterChange = useCallback(
    (e: SelectChangeEvent<string[]>) => {
      if (typeof e.target.value === 'string') {
        setExcludesCategoryFilter(e.target.value.split(','))
      } else {
        setExcludesCategoryFilter(e.target.value)
      }
    },
    []
  )

  const filteredMods = useMemo(() => {
    return allMods.filter(mod => {
      if (
        includesCategoryFilter.length > 0 &&
        !mod.categories.some(category =>
          includesCategoryFilter.includes(category)
        )
      ) {
        return false
      }

      if (
        excludesCategoryFilter.length > 0 &&
        mod.categories.some(category =>
          excludesCategoryFilter.includes(category)
        )
      ) {
        return false
      }

      if (
        filters.hasNSFW !== null &&
        mod.has_nsfw_content !== filters.hasNSFW
      ) {
        return false
      }

      if (
        filters.isDeprecated !== null &&
        mod.is_deprecated !== filters.isDeprecated
      ) {
        return false
      }

      if (filters.isPinned !== null && mod.is_pinned !== filters.isPinned) {
        return false
      }

      if (filters.maxRatings > -1 && mod.rating_score > filters.maxRatings) {
        return false
      }

      if (filters.minRatings > 0 && mod.rating_score < filters.minRatings) {
        return false
      }

      if (
        filters.hasDonation !== null &&
        (filters.hasDonation
          ? mod.donation_link === undefined
          : mod.donation_link !== undefined)
      ) {
        return false
      }

      if (
        filters.name &&
        !mod.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false
      }

      if (
        filters.owner &&
        !mod.owner.toLowerCase().includes(filters.owner.toLowerCase())
      ) {
        return false
      }

      if (
        filters.maxDependencies > -1 &&
        mod.versions[0].dependencies.length > filters.maxDependencies
      ) {
        return false
      }

      if (
        filters.minDependencies > 0 &&
        mod.versions[0].dependencies.length < filters.minDependencies
      ) {
        return false
      }

      // downloads across all versions
      const totalDownloads = mod.versions.reduce(
        (acc, cur) => acc + cur.downloads,
        0
      )
      if (filters.maxDownloads > -1 && totalDownloads > filters.maxDownloads) {
        return false
      }

      if (filters.minDownloads > 0 && totalDownloads < filters.minDownloads) {
        return false
      }

      if (
        filters.maxSize > -1 &&
        mod.versions[0].file_size > filters.maxSize * MEBI
      ) {
        return false
      }

      if (
        filters.minSize > 0 &&
        mod.versions[0].file_size < filters.minSize * MEBI
      ) {
        return false
      }

      if (
        filters.hasWebsite !== null &&
        (filters.hasWebsite
          ? mod.versions[0].website_url === ''
          : mod.versions[0].website_url !== '')
      ) {
        return false
      }

      return true
    })
  }, [
    allMods,
    includesCategoryFilter,
    excludesCategoryFilter,
    filters.hasNSFW,
    filters.isDeprecated,
    filters.isPinned,
    filters.maxRatings,
    filters.minRatings,
    filters.hasDonation,
    filters.name,
    filters.owner,
    filters.maxDependencies,
    filters.minDependencies,
    filters.maxDownloads,
    filters.minDownloads,
    filters.maxSize,
    filters.minSize,
    filters.hasWebsite,
  ])

  //
  // Sorting
  //

  const [sort, setSort] = useState<ModSort>({
    direction: 'asc',
    property:  '',
  })

  const sortedMods = useMemo(() => {
    const newMods = [...filteredMods]

    newMods.sort((a, b) => {
      if (sort.property === 'name') {
        return sort.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (sort.property === 'owner') {
        return sort.direction === 'asc'
          ? a.owner.localeCompare(b.owner)
          : b.owner.localeCompare(a.owner)
      } else if (sort.property === 'downloads') {
        const totalA = a.versions.reduce((acc, cur) => acc + cur.downloads, 0)
        const totalB = b.versions.reduce((acc, cur) => acc + cur.downloads, 0)
        return sort.direction === 'asc' ? totalA - totalB : totalB - totalA
      } else if (sort.property === 'ratings') {
        return sort.direction === 'asc'
          ? a.rating_score - b.rating_score
          : b.rating_score - a.rating_score
      } else if (sort.property === 'size') {
        return sort.direction === 'asc'
          ? a.versions[0].file_size - b.versions[0].file_size
          : b.versions[0].file_size - a.versions[0].file_size
      } else if (sort.property === 'dependencies') {
        return sort.direction === 'asc'
          ? a.versions[0].dependencies.length -
              b.versions[0].dependencies.length
          : b.versions[0].dependencies.length -
              a.versions[0].dependencies.length
      } else {
        return 0
      }
    })

    return newMods
  }, [filteredMods, sort])

  //
  // Pagination
  //

  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(100)

  const thisPage = useMemo(() => {
    return sortedMods.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
  }, [sortedMods, pageNumber, pageSize])

  return (
    <>
      <Head>
        <title>Your Source for Lethal Company Tools</title>
      </Head>

      <CornerAccents />

      <Box
        sx={{
          height:    'calc(100vh - 56px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          p:         6,
          pb:        4,

          '&::-webkit-scrollbar': {
            width:  '0.5em',
            height: '0.5em',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--accent)',
          },
        }}
      >
        <Breadcrumb parts={['Tools', 'Thunderstore Search']} />

        <Box
          sx={{
            display:       'flex',
            flexDirection: 'row',
            flexWrap:      'wrap',
            gap:           3,
            mt:            3,

            '.MuiFormLabel-root.MuiInputLabel-shrink': {
              mt: -0.5,
            },

            'fieldset legend span': {
              fontSize: '0.9em',
            },

            '& > *': {
              flexGrow: 1,
            },
          }}
        >
          <TextField
            label="Name"
            name="name"
            onChange={handleFilterChange}
            type="text"
            value={filters.name}
            variant="outlined"
          />
          <TextField
            label="Author"
            name="owner"
            onChange={handleFilterChange}
            type="text"
            value={filters.owner}
            variant="outlined"
          />

          <FormControl sx={{ minWidth: 150 }} variant="outlined">
            <InputLabel>Include</InputLabel>
            <Select
              label="Include"
              multiple
              onChange={handleIncludesCategoryFilterChange}
              renderValue={(selected: string[]) => (
                <Box
                  sx={{
                    display:  'flex',
                    flexWrap: 'wrap',
                    gap:      0.5,
                    pt:       0.75,

                    '.MuiChip-root': {
                      fontSize: '0.7em',
                      padding:  0,
                    },
                  }}
                >
                  {selected.map(value => (
                    <Chip
                      color="primary"
                      key={value}
                      label={value}
                      size="small"
                    />
                  ))}
                </Box>
              )}
              value={includesCategoryFilter}
              variant="outlined"
            >
              {allCategories.map(x => (
                <MenuItem
                  key={x}
                  value={x}
                >
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} variant="outlined">
            <InputLabel>Exclude</InputLabel>
            <Select
              label="Exclude"
              multiple
              onChange={handleExcludesCategoryFilterChange}
              renderValue={(selected: string[]) => (
                <Box
                  sx={{
                    display:  'flex',
                    flexWrap: 'wrap',
                    gap:      0.5,
                    pt:       0.75,

                    '.MuiChip-root': {
                      fontSize: '0.7em',
                      padding:  0,
                    },
                  }}
                >
                  {selected.map(value => (
                    <Chip
                      color="primary"
                      key={value}
                      label={value}
                      size="small"
                    />
                  ))}
                </Box>
              )}
              value={excludesCategoryFilter}
              variant="outlined"
            >
              {allCategories.map(x => (
                <MenuItem
                  key={x}
                  value={x}
                >
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            inputProps={{ min: 0 }}
            label="Min. Dependencies"
            name="minDependencies"
            onChange={handleFilterChange}
            type="number"
            value={filters.minDependencies}
            variant="outlined"
          />
          <TextField
            inputProps={{ min: -1 }}
            label="Max. Dependencies"
            name="maxDependencies"
            onChange={handleFilterChange}
            type="number"
            value={filters.maxDependencies}
            variant="outlined"
          />
          <TextField
            inputProps={{ min: 0 }}
            label="Min. Downloads"
            name="minDownloads"
            onChange={handleFilterChange}
            type="number"
            value={filters.minDownloads}
            variant="outlined"
          />
          <TextField
            inputProps={{ min: -1 }}
            label="Max. Downloads"
            name="maxDownloads"
            onChange={handleFilterChange}
            type="number"
            value={filters.maxDownloads}
            variant="outlined"
          />
          <TextField
            inputProps={{ min: 0 }}
            label="Min. Ratings"
            name="minRatings"
            onChange={handleFilterChange}
            type="number"
            value={filters.minRatings}
            variant="outlined"
          />
          <TextField
            inputProps={{ min: -1 }}
            label="Max. Ratings"
            name="maxRatings"
            onChange={handleFilterChange}
            type="number"
            value={filters.maxRatings}
            variant="outlined"
          />
          <TextField
            inputProps={{ min: 0 }}
            label="Min. Size (MB)"
            name="minSize"
            onChange={handleFilterChange}
            type="number"
            value={filters.minSize}
            variant="outlined"
          />
          <TextField
            inputProps={{ min: -1 }}
            label="Max. Size (MB)"
            name="maxSize"
            onChange={handleFilterChange}
            type="number"
            value={filters.maxSize}
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-around',
            flexDirection:  'row',
            flexWrap:       'wrap',
            py:             2,
          }}
        >
          <FormLabel>
            <Checkbox
              checked={filters.hasDonation ?? false}
              indeterminate={filters.hasDonation === null}
              name="hasDonation"
              onChange={handleFilterCheckboxChange}
            />{' '}
            Donation Link
          </FormLabel>
          <FormLabel>
            <Checkbox
              checked={filters.hasNSFW ?? false}
              indeterminate={filters.hasNSFW === null}
              name="hasNSFW"
              onChange={handleFilterCheckboxChange}
            />{' '}
            NSFW Content
          </FormLabel>
          <FormLabel>
            <Checkbox
              checked={filters.hasWebsite ?? false}
              indeterminate={filters.hasWebsite === null}
              name="hasWebsite"
              onChange={handleFilterCheckboxChange}
            />{' '}
            Website
          </FormLabel>
          <FormLabel>
            <Checkbox
              checked={filters.isDeprecated ?? false}
              indeterminate={filters.isDeprecated === null}
              name="isDeprecated"
              onChange={handleFilterCheckboxChange}
            />{' '}
            Deprecated
          </FormLabel>
          <FormLabel>
            <Checkbox
              checked={filters.isPinned ?? false}
              indeterminate={filters.isPinned === null}
              name="isPinned"
              onChange={handleFilterCheckboxChange}
            />{' '}
            Pinned
          </FormLabel>
        </Box>

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalResults={sortedMods.length}
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
          setSort={setSort}
          sort={sort}
        />

        <Box
          sx={{
            display:             'grid',
            alignItems:          'flex-start',
            justifyContent:      'space-around',
            gridTemplateColumns: 'repeat(auto-fill, minmax(calc(192px + 32px), 1fr))',
            gap:                 1,
            my:                  2,

            '& > *': {
              backgroundColor: 'var(--background)',
              borderRadius:    0.2,
              p:               2,
              width:           'calc(192px + 32px)',

              '&:hover': {
                backgroundColor: 'var(--accent)',
              },

              '.MuiTypography-root': {
                // overflow with ellipsis
                overflow:     'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:   'nowrap',
              },

              '.MuiTypography-body2': {
                color:    'white',
                fontSize: '0.8em',
                pt:       1,
              },
            },
          }}
        >
          {thisPage.map(x => (
            <Link
              href={x.package_url}
              key={x.uuid4}
              sx={{
                color:          'inherit',
                display:        'block',
                textDecoration: 'none',
              }}
              target="_blank"
            >
              <Image
                alt={x.name}
                height={192}
                loading="lazy"
                src={x.versions[0].icon}
                width={192}
              />
              <Typography variant="body2">{x.owner}</Typography>
              <Typography variant="body1">{x.name}</Typography>
            </Link>
          ))}
        </Box>

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalResults={sortedMods.length}
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
          setSort={setSort}
          sort={sort}
        />
      </Box>
    </>
  )
}

export default ToolsHome
