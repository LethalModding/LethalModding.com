import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useSnackbar } from 'notistack'
import { FormEvent, useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { type Team } from 'types/Team'

type Props = {
  team: Team
}

function slugEncode(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ProjectCreatePage(props: Props): JSX.Element {
  const { team } = props

  const [name, setName] = useState('')
  const [type, setType] = useState('public')

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
    case 'name':
      setName(event.target.value)
      break
    }
  }, [])

  const handleSelectChange = useCallback((event: SelectChangeEvent<string>) => {
    switch (event.target.name) {
    case 'type':
      setType(event.target.value)
      break
    }
  }, [])

  const { enqueueSnackbar } = useSnackbar()
  const supabase = useSupabaseClient()
  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()
    if (!name) return

    supabase
      .from('projects')
      .insert({
        team_id: team.id,
        name,
        type,
      })
      .select()
      .then(({ error }) => {
        if (error) {
          enqueueSnackbar('Unable to create Project', { variant: 'error' })
          console.error(error)
        } else {
          enqueueSnackbar('Project created', { variant: 'success' })
        }
      })
  }, [enqueueSnackbar, name, supabase, team, type])

  const [slugs, setSlugs] = useState<string[]>([])
  useEffect(() => {
    if (team.id === '') return

    supabase
      .from('team_slugs')
      .select('name')
      .eq('team_id', team.id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setSlugs(data.map((slug) => slug.name))
        }
      })
  }, [team, supabase])

  const projectURL = useMemo(() => {
    // use first slug
    const slugName = slugEncode(name)
    if (slugs.length > 0) {
      return `${slugs[0]}/${slugName}`
    }

    // generate slug from name
    return `${slugEncode(team.name)}/${slugName}`
  }, [name, slugs, team.name])

  return <Box
    sx={{
      display:    'grid',
      height:     '100%',
      placeItems: 'center'
    }}
  >
    <Paper
      sx={{
        display:       'flex',
        flexDirection: 'column',
        gap:           2,
        maxWidth:      520,
        p:             2,
      }}
    >
      <Typography variant="h5">
        Create Project
      </Typography>

      <Box>
        <TextField
          fullWidth
          helperText={projectURL}
          label="Name"
          name="name"
          onChange={handleInputChange}
          variant="filled"
          value={name}
        />

        <FormControl
          fullWidth
          margin="normal"
          variant="filled"
        >
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            name="type"
            onChange={handleSelectChange}
            value={type}
          >
            <MenuItem value="public">
              Public
            </MenuItem>

            <MenuItem value="private">
              Private
            </MenuItem>
          </Select>
          <FormHelperText>
            {type === 'public'
              ? 'Public projects are visible to everyone.'
              : 'Private projects are only visible to team members.'}
          </FormHelperText>
        </FormControl>
      </Box>

      <Box
        sx={{
          display:        'flex',
          gap:            1,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          color="primary"
          disabled={!name}
          onClick={handleSubmit}
          variant="contained"
        >
          Create
        </Button>
      </Box>
    </Paper>
  </Box>
}
