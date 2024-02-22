import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MinusIcon from '@mui/icons-material/Remove'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useCallback, useState, type ChangeEvent } from 'react'
import { type Team } from 'types/Team'

type Props = {
    onTeamChange: (teamID: string) => void
    team: Team
}

export default function DashboardPage(props: Props): JSX.Element {
  const { onTeamChange, team } = props
  
  const [localTeam, setLocalTeam] = useState<Team>(team)
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
  const handleSubmit = useCallback(() => {
    setLoading(true)
    
    supabase
      .from('teams')
      .update(localTeam)
      .eq('id', localTeam.id)
      .then(({ error }) => {
        if (error) {
          console.error(error)
        } else {
          onTeamChange(localTeam.id)
        }
        
        setLoading(false)
      })
  }, [localTeam, onTeamChange, supabase])

  return <>
    <Backdrop open={loading} sx={{ zIndex: 100 }}>
      <CircularProgress />
    </Backdrop>

    <Accordion
      defaultExpanded
      disableGutters
      expanded={expanded === 'profile'}
      onChange={() => setExpanded('profile')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{ flexBasis: '20%', flexShrink: 0 }}
          variant="h5"
        >
          Profile
        </Typography>
        <Typography
          sx={{ color: 'text.secondary', pt: 0.5 }}
        >
          Manage your Team&apos;s Public Profile.
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
          rows={2}
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
      disableGutters
      expanded={expanded === 'reputation'}
      onChange={() => setExpanded('reputation')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{ flexBasis: '20%', flexShrink: 0 }}
          variant="h5"
        >
          Reputation
        </Typography>
        <Typography
          sx={{ color: 'text.secondary', pt: 0.5 }}
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
      disabled
      disableGutters
      expanded={expanded === 'donation'}
      onChange={() => setExpanded('donation')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{ flexBasis: '20%', flexShrink: 0 }}
          variant="h5"
        >
          Donation
        </Typography>
        <Typography
          sx={{ color: 'text.secondary', pt: 0.5 }}
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
