import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import type { JSX } from 'react'

interface Props {
  categories: string[]
  label: string
  onChange: (selected: string[]) => void
  value: string[]
}

export function CategorySelect({ categories, label, onChange, value }: Props): JSX.Element {
  return (
    <FormControl sx={{ minWidth: 150 }} variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        multiple={true}
        onChange={(e: SelectChangeEvent<string[]>) =>
          onChange(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
        }
        renderValue={(selected: string[]) => (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              pt: 0.75,

              '.MuiChip-root': {
                fontSize: '0.7em',
                padding: 0,
              },
            }}
          >
            {selected.map((selectedValue) => (
              <Chip color="primary" key={selectedValue} label={selectedValue} size="small" />
            ))}
          </Box>
        )}
        value={value}
        variant="outlined"
      >
        {categories.map((x) => (
          <MenuItem key={x} value={x}>
            {x}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
