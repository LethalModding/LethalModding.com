import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import type { ChangeEvent, JSX } from 'react'
import { CategorySelect } from '@/components/tools/CategorySelect.tsx'
import type { Filters } from '@/utility/modFilters.ts'

type NumberFilter =
  | 'minDependencies'
  | 'maxDependencies'
  | 'minDownloads'
  | 'maxDownloads'
  | 'minRatings'
  | 'maxRatings'
  | 'minSize'
  | 'maxSize'

const NUMBER_FILTERS: readonly { label: string; name: NumberFilter; min: number }[] = [
  { label: 'Min. Dependencies', name: 'minDependencies', min: 0 },
  { label: 'Max. Dependencies', name: 'maxDependencies', min: -1 },
  { label: 'Min. Downloads', name: 'minDownloads', min: 0 },
  { label: 'Max. Downloads', name: 'maxDownloads', min: -1 },
  { label: 'Min. Ratings', name: 'minRatings', min: 0 },
  { label: 'Max. Ratings', name: 'maxRatings', min: -1 },
  { label: 'Min. Size (MB)', name: 'minSize', min: 0 },
  { label: 'Max. Size (MB)', name: 'maxSize', min: -1 },
]

type FlagFilter = 'hasDonation' | 'hasNSFW' | 'hasWebsite' | 'isDeprecated' | 'isPinned'

const FLAG_FILTERS: readonly { label: string; name: FlagFilter }[] = [
  { label: 'Donation Link', name: 'hasDonation' },
  { label: 'NSFW Content', name: 'hasNSFW' },
  { label: 'Website', name: 'hasWebsite' },
  { label: 'Deprecated', name: 'isDeprecated' },
  { label: 'Pinned', name: 'isPinned' },
]

interface Props {
  allCategories: string[]
  excludesCategoryFilter: string[]
  filters: Filters
  includesCategoryFilter: string[]
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void
  onFilterCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void
  setExcludesCategoryFilter: (selected: string[]) => void
  setIncludesCategoryFilter: (selected: string[]) => void
}

export function ModFilterFields({
  allCategories,
  excludesCategoryFilter,
  filters,
  includesCategoryFilter,
  onFilterChange,
  onFilterCheckboxChange,
  setExcludesCategoryFilter,
  setIncludesCategoryFilter,
}: Props): JSX.Element {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 3,
          mt: 3,

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
          onChange={onFilterChange}
          type="text"
          value={filters.name}
          variant="outlined"
        />
        <TextField
          label="Author"
          name="owner"
          onChange={onFilterChange}
          type="text"
          value={filters.owner}
          variant="outlined"
        />

        <CategorySelect
          categories={allCategories}
          label="Include"
          onChange={setIncludesCategoryFilter}
          value={includesCategoryFilter}
        />
        <CategorySelect
          categories={allCategories}
          label="Exclude"
          onChange={setExcludesCategoryFilter}
          value={excludesCategoryFilter}
        />

        {NUMBER_FILTERS.map(({ label, name, min }) => (
          <TextField
            key={name}
            label={label}
            name={name}
            onChange={onFilterChange}
            slotProps={{ htmlInput: { min } }}
            type="number"
            value={filters[name]}
            variant="outlined"
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexDirection: 'row',
          flexWrap: 'wrap',
          py: 2,
        }}
      >
        {FLAG_FILTERS.map(({ label, name }) => (
          <FormLabel key={name}>
            <Checkbox
              checked={filters[name] ?? false}
              indeterminate={filters[name] === null}
              name={name}
              onChange={onFilterCheckboxChange}
            />{' '}
            {label}
          </FormLabel>
        ))}
      </Box>
    </>
  )
}
