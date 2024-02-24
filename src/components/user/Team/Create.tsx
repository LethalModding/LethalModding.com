import { FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useSnackbar } from 'notistack'
import { ChangeEvent, FormEvent, useCallback, useState } from 'react'

type Props = {
    onTeamCreate: (teamID: string) => void
}

export default function TeamCreatePage(props: Props): JSX.Element {
  const { onTeamCreate } = props

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
      .from('teams')
      .insert({ name, type })
      .select()
      .then(({ data, error }) => {
        if (error) {
          enqueueSnackbar('Unable to create Team', { variant: 'error' })
          console.error(error)
        } else {
          enqueueSnackbar('Team created', { variant: 'success' })
          onTeamCreate(data[0].id)
        }
      })
  }, [enqueueSnackbar, name, onTeamCreate, supabase, type])

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
        maxWidth:      500,
        p:             2,
      }}
    >
      <Typography variant="h5">
        Create Team
      </Typography>

      <Box>
        <TextField
          fullWidth
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
              ? 'Public teams are visible to everyone.'
              : 'Private teams are only visible to members.'}
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
