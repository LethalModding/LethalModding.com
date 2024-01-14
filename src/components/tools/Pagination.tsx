import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'

type Props = {
  pageNumber: number
  pageSize: number
  totalResults: number
  setPageNumber: (pageNumber: number) => void
  setPageSize: (pageSize: number) => void
}

const Pagination = (props: Props): JSX.Element => {
  const {
    pageNumber,
    pageSize,
    totalResults,
    setPageNumber,
    setPageSize,
  } = props

  return <>
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
        Page {pageNumber} of {Math.ceil(totalResults / pageSize)}
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
        Per Page
      </Box>
      <Typography variant="body1">
        {totalResults} results
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
