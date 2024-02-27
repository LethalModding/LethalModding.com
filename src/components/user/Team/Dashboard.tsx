import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MinusIcon from '@mui/icons-material/Remove'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Theme, alpha } from '@mui/material/styles'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Loader from 'components/_shared/Loader'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { type Team } from 'types/Team'

type Props = {
    onTeamChange: (teamID: string) => void
    team: Team
}

export default function TeamDashboardPage(props: Props): JSX.Element {
  const { onTeamChange, team } = props
  
  const [localTeam, setLocalTeam] = useState<Team>(team)
  useEffect(() => setLocalTeam(team), [team])

  const [loading, setLoading] = useState(false)
  
  const socials = localTeam.socials?.split(',') || ['']
  
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    
    setLocalTeam((prevTeam) => ({
      ...prevTeam,
      [name]: value,
    }))
  }, [])

  const [expanded, setExpanded] = useState<string>('profile')
  
  const supabase = useSupabaseClient()
  const { enqueueSnackbar } = useSnackbar()
  const handleSubmit = useCallback(() => {
    setLoading(true)
    
    supabase
      .from('teams')
      .update(localTeam)
      .eq('id', localTeam.id)
      .then(({ error }) => {
        if (error) {
          enqueueSnackbar('Unable to save changes', { variant: 'error' })
          console.error(error)
        } else {
          enqueueSnackbar('Changes saved', { variant: 'success' })
          onTeamChange(localTeam.id)
        }

        setLoading(false)
      })
  }, [enqueueSnackbar, localTeam, onTeamChange, supabase])

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const showDeleteModal = useCallback(() => setDeleteModalOpen(true), [])
  const hideDeleteModal = useCallback(() => setDeleteModalOpen(false), [])

  const [confirmationName, setConfirmationName] = useState('')
  const confirmDeleteTeam = useCallback(() => {
    setLoading(true)
    
    supabase
      .from('teams')
      .delete()
      .eq('id', localTeam.id)
      .then(({ error }) => {
        if (error) {
          enqueueSnackbar('Unable to delete Team', { variant: 'error' })
          console.error(error)
        } else {
          enqueueSnackbar('Team deleted', { variant: 'success' })
          onTeamChange('')
        }

        setLoading(false)
      })
  }, [enqueueSnackbar, localTeam.id, onTeamChange, supabase])

  return <>
    <Loader open={loading} />

    <Dialog
      fullWidth
      maxWidth="md"
      onClose={hideDeleteModal}
      open={deleteModalOpen}
    >
      <DialogTitle>
        Delete Team
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <DialogContentText>
          <Typography gutterBottom>
            This action is immediate and permanent, and cannot be undone.
          </Typography>
          <Typography gutterBottom>
            This will also delete all your Projects.
          </Typography>
          <Typography gutterBottom>
            To confirm, type the Team Name below.
          </Typography>
          <TextField
            fullWidth
            label="Team Name"
            onChange={(event) => setConfirmationName(event.target.value)}
            value={confirmationName}
            variant="filled"
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={hideDeleteModal}
        >
          Cancel
        </Button>
        <Button
          color="error"
          disabled={confirmationName !== localTeam.name}
          onClick={confirmDeleteTeam}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    <Accordion
      defaultExpanded
      disableGutters
      expanded={expanded === 'profile'}
      onChange={() => setExpanded('profile')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{ flexBasis: '240px', flexShrink: 0 }}
          variant="h5"
        >
          Profile
        </Typography>
        <Typography
          sx={{ color: 'text.secondary', pt: 0.8 }}
        >
          Manage your Team&apos;s Public Profile.
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 1,
          pt:                  0,
        }}
      >
        <TextField
          fullWidth
          label="Name"
          name="name"
          onChange={handleChange}
          variant="filled"
          value={localTeam.name}
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          onChange={handleChange}
          variant="filled"
          value={localTeam.location}
        />
        <TextField
          fullWidth
          label="Bio"
          multiline
          name="bio"
          onChange={handleChange}
          rows={6}
          sx={{
            gridColumn: '1 / span 2',
          }}
          variant="filled"
          value={localTeam.bio}
        />
        {socials.map((social, index) => <TextField
          fullWidth
          inputProps={{
            type: 'url',
          }}
          InputProps={{
            endAdornment: index === socials.length - 1 ? <IconButton
              onClick={() => setLocalTeam((prevTeam) => ({
                ...prevTeam,
                socials: `${prevTeam.socials},`,
              }))}
            >
              <AddIcon />
            </IconButton> : <IconButton
              onClick={() => setLocalTeam((prevTeam) => ({
                ...prevTeam,
                socials: prevTeam.socials.split(',').filter((_, i) => i !== index).join(','),
              }))}
            >
              <MinusIcon />
            </IconButton>,
          }}
          key={index}
          label="Social Link"
          name={`socials[${index}]`}
          onChange={handleChange}
          variant="filled"
          value={social}
        />)}
        <TextField
          fullWidth
          inputProps={{
            type: 'url',
          }}
          label="Website"
          name="website"
          onChange={handleChange}
          variant="filled"
          value={localTeam.website}
        />
      </AccordionDetails>
    </Accordion>

    <Accordion
      disabled
      disableGutters
      expanded={expanded === 'donation'}
      onChange={() => setExpanded('donation')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{ flexBasis: '240px', flexShrink: 0 }}
          variant="h5"
        >
          Donations
        </Typography>
        <Typography
          sx={{ color: 'text.secondary', pt: 0.8 }}
        >
          Manage your Team&apos;s Donation Settings.
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 1,
        }}
      >
        <TextField
          disabled
          fullWidth
          inputProps={{
            type: 'url',
          }}
          label="Donation Link"
          sx={{
            gridColumn: '1 / span 2',
          }}
          variant="filled"
        />
        <FormControlLabel
          checked
          disabled
          control={<Checkbox sx={{ mr: 1.5 }} />}
          label="Show Link on Projects by Default"
          sx={{ px: 2, py: 1 }}
        />
        <FormControlLabel
          checked
          disabled
          control={<Checkbox sx={{ mr: 1.5 }} />}
          label="Show Link on Team Profile"
          sx={{ px: 2, py: 1 }}
        />
      </AccordionDetails>
    </Accordion>

    <Accordion
      disableGutters
      expanded={expanded === 'reputation'}
      onChange={() => setExpanded('reputation')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{ flexBasis: '240px', flexShrink: 0 }}
          variant="h5"
        >
          Reputation
        </Typography>
        <Typography
          sx={{ color: 'text.secondary', pt: 0.8 }}
        >
          View your Team&apos;s Reputation.
        </Typography>
      </AccordionSummary>
      <LinearProgress
        color="primary"
        value={0}
        variant="determinate"
      />
      <AccordionDetails sx={{ px: 3, pt: 2 }}>
        <Typography>
          Your Team has not yet been rated. Get started by creating a Project!
        </Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion
      disableGutters
      expanded={expanded === 'danger'}
      onChange={() => setExpanded('danger')}
      sx={{
        backgroundColor: (theme: Theme) => alpha(theme.palette.error.main, 0.2),
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{ flexBasis: '240px', flexShrink: 0 }}
          variant="h5"
        >
          Danger Zone
        </Typography>
        <Typography
          sx={{ color: 'text.secondary', pt: 0.8 }}
        >
          Delete your Team or Transfer Ownership.
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, pt: 2 }}>
        <Typography gutterBottom>
          This action is immediate and permanent, and cannot be undone.
        </Typography>
        <Typography gutterBottom>
          This will also delete all your Projects.
        </Typography>
        <Button
          color="error"
          onClick={showDeleteModal}
          size="small"
          sx={{ mt: 0.5, px: 2 }}
          variant="contained"
        >
          Delete Team
        </Button>
      </AccordionDetails>
    </Accordion>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
      <Button
        color="primary"
        disabled={loading}
        onClick={handleSubmit}
        variant="contained"
      >
        Save
      </Button>
    </Box>
  </>
}