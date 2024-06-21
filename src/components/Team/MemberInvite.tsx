import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import type { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useSnackbar } from 'notistack'
import type { ChangeEvent } from 'react'
import { useCallback, useState } from 'react'
import { useAppStore } from 'store'

export default function TeamMemberInvitePage(): JSX.Element {
  const [email, setEmail] = useState('')
  const [type, setType] = useState('collaborator')

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
    case 'email':
      setEmail(event.target.value)
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

  const teamID = useAppStore(state => state.selectedTeamID)
  const supabase = useSupabaseClient()
  const { enqueueSnackbar } = useSnackbar()
  const handleSubmit = useCallback(() => {

    supabase
      .from('team_invites')
      .insert({ team_id: teamID, email, type })
      .then(({ error }) => {
        if (error) {
          enqueueSnackbar(`Error inviting ${email}`, { variant: 'error' })
          console.error(error)
        } else {
          enqueueSnackbar(`Invited ${email}`, { variant: 'success' })
        }

        setEmail('')
      })
  }, [email, enqueueSnackbar, supabase, teamID, type])

  return <>
    <Paper
      sx={{
        display:       'flex',
        flexDirection: 'column',
        gap:           1,
        m:             2,
        p:             2,
      }}
    >
      <Typography
        sx={{
          pb: 1.5
        }}
        variant="h5"
      >
        Invite to Team
      </Typography>

      <TextField
        fullWidth
        label="Email"
        name="email"
        onChange={handleInputChange}
        variant="filled"
        value={email}
      />

      <RadioGroup
        name="type"
        onChange={handleSelectChange}
        sx={{
          gap: 1,
          my:  0.5,
        }}
        value={type}
      >
        <FormControlLabel
          control={<Radio />}
          label={<>
            Tester
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Can view and comment on projects
            </Typography>
          </>}
          value="tester"
        />
        <FormControlLabel
          control={<Radio />}
          label={<>
            Collaborator
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Can view, create, and edit projects
            </Typography>
          </>}
          value="collaborator"
        />
      </RadioGroup>

      <Button
        color="primary"
        disabled={!email}
        onClick={handleSubmit}
        variant="contained"
      >
        Invite
      </Button>
    </Paper>
  </>
}
