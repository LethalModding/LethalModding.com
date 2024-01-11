import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CornerAccents from 'components/branding/CornerAccents'
import TypedText from 'components/branding/TypedText'
import Link from 'components/mui/Link'
import { type NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ofetch } from 'ofetch'
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import useGlobalStyles from 'styles/globalStyles'
import { type Mod } from 'types/Mod'

type Filters = {
  hasDonation:  boolean | null
  hasNSFW:      boolean | null
  hasWebsite:   boolean | null
  isDeprecated: boolean | null
  isPinned:     boolean | null
  maxDownloads: number
  minDownloads: number
  maxRatings:   number
  minRatings:   number
  maxSize:      number
  minSize:      number
  name:         string
  owner:        string
  [key: string]: string | number | boolean | null | undefined
}

const MEBI = 1024 * 1024

const ToolsHome: NextPage = (): JSX.Element => {
  const globalStyles = useGlobalStyles()

  const [allMods, setAllMods] = useState<Mod[]>([])
  useEffect(() => {
    const timeout = setTimeout(() => {
      ofetch('https://thunderstore.io/c/lethal-company/api/v1/package/')
        .then((data) => setAllMods(data))
    }, 250)

    return () => clearTimeout(timeout)
  }, [])

  const [allCategories, setAllCategories] = useState<string[]>([])
  useEffect(() => {
    const newCategories = new Set<string>()
    allMods.forEach(mod => mod.categories.forEach(category => newCategories.add(category)))
    setAllCategories(Array.from(newCategories).sort())
  }, [allMods])

  //
  // Filters
  //

  const [filters, setFilters] = useState<Filters>({
    hasDonation:  null,
    hasNSFW:      null,
    hasWebsite:   null,
    isDeprecated: false,
    isPinned:     null,
    maxDownloads: -1,
    minDownloads: 0,
    maxRatings:   -1,
    minRatings:   0,
    maxSize:      -1,
    minSize:      0,
    name:         '',
    owner:        '',
  })
  const handleFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }, [])
  const handleFilterCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
  }, [filters])

  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const handleCategoryFilterChange = useCallback((e: SelectChangeEvent<string[]>) => {
    if (typeof e.target.value === 'string') {
      setCategoryFilter(e.target.value.split(','))
    } else {
      setCategoryFilter(e.target.value)
    }
  }, [])

  const filteredMods = useMemo(() => {
    return allMods.filter(mod => {
      if (categoryFilter.length > 0 && !mod.categories.some(category => categoryFilter.includes(category))) {
        return false
      }

      if (filters.hasDonation !== null && mod.donation_link !== (filters.hasDonation ? '' : null)) {
        return false
      }

      if (filters.hasNSFW !== null && mod.has_nsfw_content !== filters.hasNSFW) {
        return false
      }

      if (filters.isDeprecated !== null && mod.is_deprecated !== filters.isDeprecated) {
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

      if (filters.name && !mod.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false
      }

      if (filters.owner && !mod.owner.toLowerCase().includes(filters.owner.toLowerCase())) {
        return false
      }

      if (filters.maxDownloads > -1 && mod.versions[0].downloads > filters.maxDownloads) {
        return false
      }

      if (filters.minDownloads > 0 && mod.versions[0].downloads < filters.minDownloads) {
        return false
      }

      if (filters.maxSize > -1 && mod.versions[0].file_size > filters.maxSize * MEBI) {
        return false
      }

      if (filters.minSize > 0 && mod.versions[0].file_size < filters.minSize * MEBI) {
        return false
      }

      if (filters.hasWebsite !== null && mod.versions[0].website_url !== (filters.hasWebsite ? '' : null)) {
        return false
      }

      return true
    })
  }, [allMods, categoryFilter, filters.hasDonation, filters.hasNSFW, filters.hasWebsite, filters.isDeprecated, filters.isPinned, filters.maxDownloads, filters.maxRatings, filters.maxSize, filters.minDownloads, filters.minRatings, filters.minSize, filters.name, filters.owner])

  //
  // Sorting
  //

  type Sort = {
    direction: 'asc' | 'desc'
    property:  'updated' | 'name' | 'owner' | 'downloads' | 'ratings' | 'size'
  }
  const [sort, setSort] = useState<Sort>({
    direction: 'asc',
    property:  'updated',
  })

  //
  // Pagination
  //

  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(100)

  const thisPage = useMemo(() => {
    return filteredMods.slice((pageNumber-1)*pageSize, pageNumber*pageSize)
  }, [filteredMods, pageNumber, pageSize])

  const [isAccessible, setIsAccessible] = useState<boolean>(false)
  const toggleAccessibility = useCallback(() => {
    const newState = !isAccessible

    if (newState) {
      document.body.classList.add('accessible')
    } else {
      document.body.classList.remove('accessible')
    }

    setIsAccessible(newState)
  }, [isAccessible])

  return <>
    <Head>
      <title>Your Source for Lethal Company Tools</title>
    </Head>

    <CornerAccents />

    <Box
      sx={{
        ...globalStyles.container,
        height:         '100vh',
        justifyContent: 'stretch',
        overflowX:      'hidden',
        overflowY:      'auto',

        '&::-webkit-scrollbar': {
          width:  '0.25em',
          height: '0.25em',
        },

        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--accent)',
        },
      }}
    >
      <Box
        onClick={toggleAccessibility}
        sx={{
          fontSize:   '2em',
          lineHeight: 1,
          position:   'absolute',
          right:      '1em',
          textAlign:  'right',
          top:        '1em',
          zIndex:     100,
        }}
      >
        {!isAccessible ? <AccessibilityNewIcon fontSize='inherit' /> :
          <AccessibleForwardIcon fontSize='inherit' />}
      </Box>

      <Box sx={globalStyles.linksBox}>
        <Box className="column" sx={{ my: 4 }}>
          <Typography variant='h2'>
            <TypedText
              finalText="# Tools"
              startDelay={0}
              typingSpeed={17}
            />
          </Typography>

          <Typography variant="h3">
            Advanced Search
          </Typography>

          <Box
            sx={{
              display:       'flex',
              flexDirection: 'row',
              flexWrap:      'wrap',
              gap:           3,
              
              '.MuiFormLabel-root.MuiInputLabel-shrink': {
                mt:      -.5,
                padding: 0,
              },

              'fieldset legend span': {
                fontSize: '0.8em',
              },

              '& > *': {
                flexGrow: 1,
              },

              '.MuiOutlinedInput-input': {
                py: 1,
              },
            }}
          >
            <FormControl
              sx={{
                '.MuiFormLabel-root': {
                  fontSize: '0.75em',
                  mt:       -1.75,
                  mb:       -2,
                  ml:       2,
                },
              }}
              size="small"
              variant="outlined"
            >
              <FormLabel>Category</FormLabel>
              <Select
                input={<OutlinedInput label="Category" />}
                label="Category"
                multiple
                onChange={handleCategoryFilterChange}
                renderValue={(selected: string[]) => <Box
                  sx={{
                    display:  'flex',
                    flexWrap: 'wrap',
                    gap:      0.5,
                    
                    '.MuiChip-root': {
                      fontSize: '0.7em',
                      padding:  0,
                    },
                  }}
                >
                  {selected.map(value => <Chip
                    color="primary"
                    key={value}
                    label={value}
                    size="small"
                  />)}
                </Box>}
                value={categoryFilter}
              >
                {allCategories.map(x => <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="Name"
              name="name"
              onChange={handleFilterChange}
              size="small"
              type="text"
              value={filters.name}
              variant="outlined"
            />
            <TextField
              label="Author"
              name="owner"
              onChange={handleFilterChange}
              size="small"
              type="text"
              value={filters.owner}
              variant="outlined"
            />
          </Box>

          <Box
            sx={{
              display:       'flex',
              flexDirection: 'row',
              flexWrap:      'wrap',
              gap:           3,

              '.MuiFormLabel-root.MuiInputLabel-shrink': {
                mt:      -.5,
                padding: 0,
              },

              'fieldset legend span': {
                fontSize: '0.8em',
              },

              '& > *': {
                flexGrow: 1,
              }
            }}
          >
            <TextField
              defaultValue={0}
              inputProps={{ min: 0 }}
              label="Min. Downloads"
              name="minDownloads"
              onChange={handleFilterChange}
              size="small"
              type="number"
              value={filters.minDownloads}
              variant="outlined"
            />
            <TextField
              defaultValue={-1}
              inputProps={{ min: -1 }}
              label="Max. Downloads"
              name="maxDownloads"
              onChange={handleFilterChange}
              size="small"
              type="number"
              value={filters.maxDownloads}
              variant="outlined"
            />
            <TextField
              defaultValue={0}
              inputProps={{ min: 0 }}
              label="Min. Ratings"
              name="minRatings"
              onChange={handleFilterChange}
              size="small"
              type="number"
              value={filters.minRatings}
              variant="outlined"
            />
            <TextField
              defaultValue={-1}
              inputProps={{ min: -1 }}
              label="Max. Ratings"
              name="maxRatings"
              onChange={handleFilterChange}
              size="small"
              type="number"
              value={filters.maxRatings}
              variant="outlined"
            />
            <TextField
              defaultValue={0}
              inputProps={{ min: 0 }}
              label="Min. Size (MB)"
              name="minSize"
              onChange={handleFilterChange}
              size="small"
              type="number"
              value={filters.minSize}
              variant="outlined"
            />
            <TextField
              defaultValue={-1}
              inputProps={{ min: -1 }}
              label="Max. Size (MB)"
              name="maxSize"
              onChange={handleFilterChange}
              size="small"
              type="number"
              value={filters.maxSize}
              variant="outlined"
            />
          </Box>

          <Box
            sx={{
              display:       'flex',
              flexDirection: 'row',
              flexWrap:      'wrap',
              gap:           3,

              '.MuiFormLabel-root.MuiInputLabel-shrink': {
                mt:      -.5,
                padding: 0,
              },

              'fieldset legend span': {
                fontSize: '0.8em',
              },

              '& > *': {
                flexGrow: 1,
              }
            }}
          >
            <FormLabel sx={{ m: -1 }}>
              <Checkbox
                checked={filters.hasDonation ?? false}
                indeterminate={filters.hasDonation === null}
                name="hasDonation"
                onChange={handleFilterCheckboxChange}
              /> Donation Link
            </FormLabel>
            <FormLabel sx={{ m: -1 }}>
              <Checkbox
                checked={filters.hasNSFW ?? false}
                indeterminate={filters.hasNSFW === null}
                name="hasNSFW"
                onChange={handleFilterCheckboxChange}
              /> NSFW Content
            </FormLabel>
            <FormLabel sx={{ m: -1 }}>
              <Checkbox
                checked={filters.hasWebsite ?? false}
                indeterminate={filters.hasWebsite === null}
                name="hasWebsite"
                onChange={handleFilterCheckboxChange}
              /> Website
            </FormLabel>
            <FormLabel sx={{ m: -1 }}>
              <Checkbox
                checked={filters.isDeprecated ?? false}
                indeterminate={filters.isDeprecated === null}
                name="isDeprecated"
                onChange={handleFilterCheckboxChange}
              /> Deprecated
            </FormLabel>
            <FormLabel sx={{ m: -1 }}>
              <Checkbox
                checked={filters.isPinned ?? false}
                indeterminate={filters.isPinned === null}
                name="isPinned"
                onChange={handleFilterCheckboxChange}
              /> Pinned
            </FormLabel>
          </Box>

          <Box
            sx={{
              border: '1px solid var(--accent)',

              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              mb:             -2,
              p:              1,
              px:             2,
            }}
          >
            <Typography variant="body1">
              Page {pageNumber} of {Math.ceil(filteredMods.length / pageSize)}
            </Typography>
            <Box
              sx={{
                display:    'flex',
                alignItems: 'center',
                gap:        2,
              }}
            >
              <FormControl size="small" variant="outlined">
                <Select
                  defaultValue={100}
                  name="pageSize"
                  onChange={(e) => setPageSize(e.target.value as number)}
                  inputProps={{
                    sx: {
                      mr: 1,
                      py: 0,
                    }
                  }}
                  size="small"
                >
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={40}>40</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                  <MenuItem value={200}>200</MenuItem>
                  <MenuItem value={400}>400</MenuItem>
                </Select>
              </FormControl>
              Per Page
            </Box>
            <Typography variant="body1">
              {filteredMods.length} results
            </Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid var(--accent)',

              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              flexWrap:       'wrap',
              gap:            1,
              p:              1,
              px:             2,
            }}
          >
            {/* show pages 1 ... n-1, n, n+1, ... (last) */}
            {Array.from({ length: Math.ceil(filteredMods.length / pageSize) }, (_, i) => i + 1).map(x => {
              if (x === 1 || x === Math.ceil(filteredMods.length / pageSize) || Math.abs(x - pageNumber) <= 3) {
                return <Link
                  key={x}
                  onClick={() => setPageNumber(x)}
                  sx={{
                    backgroundColor: pageNumber === x ? 'var(--accent)' : 'inherit',
                    borderRadius:    2,
                    color:           pageNumber === x ? 'white' : 'inherit',
                    cursor:          'pointer',
                    px:              1,
                    textDecoration:  'none',
                  }}
                  variant="body1"
                >
                  {x}
                </Link>
              } else if (x === 2 && pageNumber > 3) {
                return '...'
              } else if (x === Math.ceil(filteredMods.length / pageSize) - 1 && pageNumber < Math.ceil(filteredMods.length / pageSize) - 1) {
                return '...'
              } else {
                return null
              }
            })}
          </Box>

          <Box
            sx={{
              display:       'flex',
              flexDirection: 'row',
              flexWrap:      'wrap',
              gap:           1,

              '& > *': {
                backgroundColor: 'var(--background)',
                borderRadius:    2,
                flex:            '1 0 auto',
                maxWidth:        'calc(25% - 1 * 8px)',
                minWidth:        'calc(25% - 1 * 8px)',
                px:              2,
                py:              1,

                '&:hover': {
                  backgroundColor: 'var(--accent)',
                },

                '.MuiTypography-root': {
                  lineHeight:   1.5,
                  overflowWrap: 'anywhere',
                },

                '.MuiTypography-body1': {
                  lineHeight: 1,
                },

                '.MuiTypography-body2': {
                  color:    'white',
                  fontSize: '0.7em',
                },
              },
            }}
          >
            {thisPage.map(x => <Link
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
                height={256}
                loading='lazy'
                src={x.versions[0].icon}
                width={256}
              />
              <Typography variant="body2">
                {x.owner}
              </Typography>
              <Typography variant="body1">
                {x.name}
              </Typography>
            </Link>)}
          </Box>
        </Box>
      </Box>
    </Box>
  </>
}

export default ToolsHome
