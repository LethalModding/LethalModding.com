import ProfileIcon from '@mui/icons-material/AccountCircle'
import PuzzleIcon from '@mui/icons-material/Extension'
import UserGroupIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Link from 'components/mui/Link'
import ProjectManagePage from 'components/project/Manage'
import TeamMemberManagePage from 'components/Team/MemberManage'
import TeamProfilePage from 'components/Team/Profile'
import Head from 'next/head'
import { useMemo, useState } from 'react'
import { useAppStore } from 'store'

const TeamPage = (): JSX.Element => {
  const [selectedPage, setSelectedPage] = useState('')

  const pageComponent = useMemo(() => {
    switch (selectedPage) {
    //   case 'team/create':
    //     return <TeamCreatePage />
    case 'dashboard':
      return <TeamProfilePage />
    case 'members':
      return <TeamMemberManagePage />
    case 'projects':
      return <ProjectManagePage />
    //   case 'team/projects/create':
    //     return <ProjectCreatePage />
    default:
      return null
    }
  }, [selectedPage])

  const selectedTeam = useAppStore(state => state.selectedTeam)

  return <>
    <Head>
      <title>Your Source for Lethal Company Mods</title>
    </Head>

    <Box
      sx={{
        display:       'flex',
        flexDirection: 'column',
        height:        'calc(100vh - 56px)',

        overflowX: 'hidden',
        overflowY: 'auto',

        '&::-webkit-scrollbar': {
          width:  '0.25em',
          height: '0.25em',
        },

        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--accent)',
        },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
        }}
      >
        <Typography variant="h4">
          {selectedPage !== '' ? <>
            <Link
              onClick={() => setSelectedPage('')}
              sx={{ textDecoration: 'none' }}
            >
              {selectedTeam?.name || 'Team'}
            </Link>
            {' > '}
            {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
          </> : selectedTeam?.name || 'Team'}
        </Typography>
      </Paper>

      {pageComponent
        ? pageComponent
        : <TeamMenu setSelectedPage={setSelectedPage} />}
    </Box>
  </>
}

const TeamMenu = (
  { setSelectedPage }: { setSelectedPage: (page: string) => void }
): JSX.Element => {
  return <Box
    sx={{
      display:       'flex',
      flex:          1,
      flexDirection: 'column',
      gap:           1.5,
      m:             2,
      
      '.MuiListItemButton-root': {
        'svg': {
          color:    'var(--accent)',
          fontSize: '3em',
          m:        1,
        },
      },
    }}
  >
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
      <ListItemButton onClick={() => setSelectedPage('dashboard')}>
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
      <ListItemButton onClick={() => setSelectedPage('dashboard')}>
        <SettingsIcon />
        <CardHeader
          title="Settings"
          subheader="Manage your team's privacy and settings"
        />
      </ListItemButton>
    </Paper>
  </Box>
}

TeamPage.auth = true

export default TeamPage
