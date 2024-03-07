import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { type SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Loader from 'components/_shared/Loader'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { type Team } from 'types/db/Team'
import { TeamInvite } from 'types/db/TeamInvite'
import InviteListItem from '../inviteListItem'

type Props = {
  onTeamChange: (teamID: string) => void
  team: Team
}

export default function TeamMemberInvitePage(props: Props): JSX.Element {
  const { team } = props
  
  const [email, setEmail] = useState('')
  const [type, setType] = useState('collaborator')
  const [loading, setLoading] = useState(true)

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

  const supabase = useSupabaseClient()

  const [invites, setInvites] = useState<TeamInvite[]>([])
  const sortedInvites = useMemo(() => {
    return invites.sort((a, b) => {
      return a.created_at < b.created_at ? 1 : -1
    })
  }, [invites])

  const refreshInvites = useCallback(() => {
    supabase
      .from('team_invites')
      .select('*')
      .eq('team_id', team.id)
      .then(({ data, error }) => {
        setLoading(false)

        if (error) {
          console.error(error)
        } else {
          setInvites(data)
        }
      })
  }, [supabase, team.id])
  useEffect(() => refreshInvites(), [refreshInvites])

  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = useCallback(() => {
    setLoading(true)
    
    supabase
      .from('team_invites')
      .insert({ team_id: team.id, email, type })
      .then(({ error }) => {
        setLoading(false)

        if (error) {
          enqueueSnackbar(`Error inviting ${email}`, { variant: 'error' })
          console.error(error)
        } else {
          enqueueSnackbar(`Invited ${email}`, { variant: 'success' })
          refreshInvites()
        }

        setEmail('')
      })
  }, [email, enqueueSnackbar, refreshInvites, supabase, team.id, type])

  return <Box
    sx={{
      display:    'grid',
      height:     '100%',
      placeItems: 'center'
    }}
  >
    <Loader open={loading} />

    <Paper
      sx={{
        display:       'flex',
        flexDirection: 'column',
        gap:           1,
        p:             2,
      }}
    >
      <Typography sx={{ pb: 1.5 }} variant="h5">
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
        sx={{ my: 0.5, gap: 1 }}
        value={type}
      >
        <FormControlLabel
          control={<Radio/>}
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

    <Collapse in={!loading}>
      <Accordion disableGutters sx={{ minWidth: 460 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h5">
            Invite History
            <Badge
              badgeContent={<Box sx={{ pl: 0.25, whiteSpace: 'nowrap' }}>
                {invites.filter(x => !x.deleted_at).length} pending
              </Box>}
              color="primary"
              sx={{ ml: 8 }}
            />
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {sortedInvites.map((invite) => <InviteListItem
            invite={invite}
            key={invite.id}
            refresh={refreshInvites}
          />)}
        </AccordionDetails>
      </Accordion>
    </Collapse>
  </Box>
}
