import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback } from 'react'
import type { ModSort } from 'types/ModSort'

type Props = {
  pageNumber: number
  pageSize: number
  totalResults: number
  setPageNumber: (pageNumber: number) => void
  setPageSize: (pageSize: number) => void
  setSort: Dispatch<SetStateAction<ModSort>>
  sort: ModSort
}

const Pagination = (props: Props): JSX.Element => {
  const {
    pageNumber,
    pageSize,
    totalResults,
    setPageNumber,
    setPageSize,
    setSort,
    sort,
  } = props

  const handleSortDirectionChange = useCallback((e: SelectChangeEvent<string>) => {
    setSort(prev => ({ ...prev, direction: e.target.value as ModSort['direction'] }))
  }, [setSort])
  const handleSortPropertyChange = useCallback((e: SelectChangeEvent<string>) => {
    setSort(prev => ({ ...prev, property: e.target.value as ModSort['property'] }))
  }, [setSort])

  return <>
    <Box
      sx={{
        border: '1px solid var(--accent)',

        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        p:              1,
        px:             2,
      }}
    >
      <Typography variant="body1">
        Sort by
      </Typography>

      <FormControl size="small" variant="outlined">
        <Select
          inputProps={{
            sx: {
              mr: 1,
              py: 0,
            }
          }}
          name="sortProperty"
          onChange={handleSortPropertyChange}
          size="small"
          value={sort.property as string}
        >
          <MenuItem value="">Default</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="owner">Author</MenuItem>
          <MenuItem value="dependencies">Dependencies</MenuItem>
          <MenuItem value="downloads">Downloads</MenuItem>
          <MenuItem value="ratings">Rating</MenuItem>
          <MenuItem value="size">Size</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" variant="outlined">
        <Select
          inputProps={{
            sx: {
              mr: 1,
              py: 0,
            }
          }}
          name="sortDirection"
          onChange={handleSortDirectionChange}
          size="small"
          value={sort.direction as string}
        >
          <MenuItem value="asc">Low to High</MenuItem>
          <MenuItem value="desc">High to Low</MenuItem>
        </Select>
      </FormControl>

      Showing
      <FormControl size="small" variant="outlined">
        <Select
          inputProps={{
            sx: {
              mr: 1,
              py: 0,
            }
          }}
          name="pageSize"
          onChange={(e) => setPageSize(e.target.value as number)}
          size="small"
          value={pageSize}
        >
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={40}>40</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
          <MenuItem value={400}>400</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="body1">
        on page {pageNumber} of {Math.ceil(totalResults / pageSize)} ({totalResults} total)
      </Typography>
    </Box>

    <Box
      sx={{
        border: '1px solid var(--accent)',

        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        my:             1,
        p:              1,
        px:             2,
      }}
    >
      {/* show pages 1 ... n-1, n, n+1, ... (last) */}
      {Array.from({ length: Math.ceil(totalResults / pageSize) }, (_, i) => i + 1).map(x => {
        if (x === 1 || x === Math.ceil(totalResults / pageSize) || Math.abs(x - pageNumber) <= 3) {
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
        } else if (x === Math.ceil(totalResults / pageSize) - 1 && pageNumber < Math.ceil(totalResults / pageSize) - 1) {
          return '...'
        } else {
          return null
        }
      })}
    </Box>
  </>
}

export default Pagination
