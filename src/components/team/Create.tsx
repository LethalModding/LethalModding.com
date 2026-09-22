import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useSnackbar } from 'notistack'
import type { ChangeEvent, JSX, MouseEvent } from 'react'
import { useCallback, useState } from 'react'
import { useAppStore } from '@/store.ts'

export function TeamCreatePage(): JSX.Element {
  const [name, setName] = useState('')
  const [type, setType] = useState('public')

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'name') {
      setName(event.target.value)
    }
  }, [])

  const handleSelectChange = useCallback((event: SelectChangeEvent<string>) => {
    if (event.target.name === 'type') {
      setType(event.target.value)
    }
  }, [])

  const { enqueueSnackbar } = useSnackbar()
  const supabase = useSupabaseClient()
  const setSelectedTeamID = useAppStore((state) => state.setSelectedTeamID)
  const handleSubmit = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (!name) {
        return
      }

      supabase
        .from('teams')
        .insert({ name, type })
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            enqueueSnackbar('Unable to create Team', { variant: 'error' })
          } else {
            enqueueSnackbar('Team created', { variant: 'success' })
            setSelectedTeamID(data.id)
          }
        })
    },
    [enqueueSnackbar, name, setSelectedTeamID, supabase, type],
  )

  return (
    <Box
      sx={{
        display: 'grid',
        height: '100%',
        placeItems: 'center',
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 500,
          p: 2,
        }}
      >
        <Typography variant="h5">Create Team</Typography>

        <Box>
          <TextField
            fullWidth={true}
            label="Name"
            name="name"
            onChange={handleInputChange}
            variant="filled"
            value={name}
          />

          <FormControl fullWidth={true} margin="normal" variant="filled">
            <InputLabel>Type</InputLabel>
            <Select label="Type" name="type" onChange={handleSelectChange} value={type}>
              <MenuItem value="public">Public</MenuItem>

              <MenuItem value="private">Private</MenuItem>
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
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Button color="primary" disabled={!name} onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
