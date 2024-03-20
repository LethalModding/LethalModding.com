import ProfileIcon from '@mui/icons-material/AccountCircle'
import PuzzleIcon from '@mui/icons-material/Extension'
import DonationIcon from '@mui/icons-material/Money'
import UserGroupIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import ShieldIcon from '@mui/icons-material/Shield'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'

type Props = {
  setSelectedPage: (page: string) => void;
}

export default function TeamMenu(props: Props): JSX.Element {
  const { setSelectedPage } = props

  return <Box
    sx={{
      display:             'grid',
      gridTemplateColumns: '1fr 1fr',
      gap:                 1.5,
      m:                   2,
      
      'svg': {
        color:    (theme) => theme.palette.primary.main,
        fontSize: '3em',
        m:        1,
      },
    }}
  >
    <Paper>
      <ListItemButton disabled onClick={() => setSelectedPage('donations')}>
        <DonationIcon />
        <CardHeader
          title="Donations"
          subheader="Coming Soon"
        />
      </ListItemButton>
    </Paper>

    <Paper>
      <ListItemButton onClick={() => setSelectedPage('members')}>
        <UserGroupIcon />
        <CardHeader
          title="Members"
          subheader="Invite, manage, and remove team members"
        />
      </ListItemButton>
    </Paper>
    
    <Paper>
      <ListItemButton onClick={() => setSelectedPage('profile')}>
        <ProfileIcon />
        <CardHeader
          title="Profile"
          subheader="Manage your team's public image and presence"
        />
      </ListItemButton>
    </Paper>

    <Paper>
      <ListItemButton onClick={() => setSelectedPage('projects')}>
        <PuzzleIcon />
        <CardHeader
          title="Projects"
          subheader="Create and manage Mods and other projects"
        />
      </ListItemButton>
    </Paper>

    <Paper>
      <ListItemButton disabled onClick={() => setSelectedPage('reputation')}>
        <ShieldIcon />
        <CardHeader
          title="Reputation"
          subheader="Coming Soon" // "View your team's reputation and standing"
        />
      </ListItemButton>
    </Paper>
    
    <Paper>
      <ListItemButton onClick={() => setSelectedPage('profile')}>
        <SettingsIcon />
        <CardHeader
          title="Settings"
          subheader="Manage your team's privacy and settings"
        />
      </ListItemButton>
    </Paper>
  </Box>
}
