import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Backdrop from '@mui/material/Backdrop'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { type Team } from 'types/Team'

type Props = {
  onTeamChange: (teamID: string) => void
  team: Team
}

type TeamInvite = {
  id: string

  created_at: string
  updated_at: string
  deleted_at?: string

  inviter: string
  team_id: string
  email: string
  type: string
}

export default function TeamInvitePage(props: Props): JSX.Element {
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

  const handleSubmit = useCallback(() => {
    setLoading(true)
    
    supabase
      .from('team_invites')
      .insert({ team_id: team.id, email, type })
      .then(({ error }) => {
        setLoading(false)
        refreshInvites()
        setEmail('')

        if (error) {
          console.error(error)
        }
      })
  }, [email, refreshInvites, supabase, team.id, type])

  return <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{
      display:    'grid',
      placeItems: 'center',
      minHeight:  'calc(100svh - 80px)',
    }}
  >
    <Backdrop open={loading}>
      <CircularProgress />
    </Backdrop>

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
        Invite to Team
      </Typography>

      <Box>
        <TextField
          fullWidth
          label="Email"
          name="email"
          onChange={handleInputChange}
          variant="filled"
          value={email}
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
            <MenuItem value="collaborator">
              Collaborator
            </MenuItem>
            <MenuItem value="tester">
              Tester
            </MenuItem>
          </Select>
          <FormHelperText>
            {type === 'collaborator'
              ? 'Collaborators can manage projects.'
              : 'Testers can only view projects.'}
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
          disabled={!email}
          onClick={handleSubmit}
          variant="contained"
        >
          Invite
        </Button>
      </Box>
    </Paper>

    <Collapse in={!loading}>
      <Accordion disableGutters>
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

export function InviteListItem(props: {
  expanded?: boolean,
  invite: TeamInvite,
  refresh: () => void,
}): JSX.Element {
  const { expanded, invite, refresh } = props

  const session = useSession()
  const supabase = useSupabaseClient()

  const handleRevoke = useCallback(() => {
    supabase
      .from('team_invites')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', invite.id)
      .then(({ error }) => {
        refresh()

        if (error) {
          console.error(error)
        }
      })
  }, [invite.id, refresh, supabase])

  return <Box
    sx={{
      display:             'grid',
      gridTemplateColumns: '1fr auto auto',
      alignItems:          'center',
      gap:                 2,
      
      '&:not(:last-child)': {
        borderBottom: '1px solid',
        borderColor:  'divider',
      },

      color:          invite.deleted_at ? 'text.disabled' : 'text.primary',
      textDecoration: invite.deleted_at ? 'line-through' : 'none',
    }}
  >
    <Box>
      <Typography>
        {invite.email}
      </Typography>

      {expanded ? <Typography color="text.secondary">
        {invite.type}
      </Typography> : null}
    </Box>

    <Box>
      {expanded ? <Typography color="text.secondary">
        {invite.inviter === session?.user.id ? 'You' : invite.inviter}
      </Typography> : null}
      <Typography color="text.secondary" variant="body2">
        {invite.created_at}
      </Typography>
    </Box>

    <IconButton color="primary" onClick={handleRevoke} size="small">
      <DeleteIcon fontSize="inherit" />
    </IconButton>
  </Box>
}
