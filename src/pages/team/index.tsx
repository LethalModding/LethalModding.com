import AddIcon from '@mui/icons-material/Add'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PluginIcon from '@mui/icons-material/Extension'
import UsersIcon from '@mui/icons-material/Group'
import InviteIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ProjectCreatePage from 'components/project/Create'
import ProjectManagePage from 'components/project/Manage'
import TeamCreatePage from 'components/user/Team/Create'
import TeamDashboardPage from 'components/user/Team/Dashboard'
import TeamMemberInvitePage from 'components/user/Team/MemberInvite'
import TeamMemberManagePage from 'components/user/Team/MemberManage'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const TeamPage = (): JSX.Element => {
  const [selectedPage, setSelectedPage] = useState('team/dashboard')
  const router = useRouter()
  useEffect(() => {
    if (selectedPage === 'default' || !router.query.page) return

    const currentPage = selectedPage.split('/')
    let different = false

    for (let i = 0; i < currentPage.length; i++) {
      if (router.query.page[i] !== currentPage[i]) {
        different = true
        break
      }
    }

    if (!different) return
    router.replace(`/team/${selectedPage}`, undefined, { shallow: true })
  }, [router, selectedPage])

  const pageComponent = useMemo(() => {
    switch (selectedPage) {
    case 'team/create':
      return <TeamCreatePage />
    case 'team/dashboard':
      return <TeamDashboardPage />
    case 'team/members':
      return <TeamMemberManagePage />
    case 'team/members/invite':
      return <TeamMemberInvitePage />
    case 'team/projects':
      return <ProjectManagePage />
    case 'team/projects/create':
      return <ProjectCreatePage />
    default:
      return <ComingSoonPage />
    }
  }, [selectedPage])

  return <>
    <Head>
      <title>Your Source for Lethal Company Mods</title>
    </Head>

    <Box
      sx={{
        display:             'grid',
        gridTemplateColumns: '280px 1fr',

        '& > *': {
          height: 'calc(100vh - 56px)',

          overflowX: 'hidden',
          overflowY: 'auto',

          '&::-webkit-scrollbar': {
            width:  '0.25em',
            height: '0.25em',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--accent)',
          },
        },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 0,
          zIndex:       1,

          '.MuiListSubheader-root': {
            userSelect: 'none',
          }
        }}
      >
        <List disablePadding>
          <ListItemButton
            disabled={selectedPage === 'team/create'}
            onClick={() => setSelectedPage('team/dashboard')}
            selected={selectedPage === 'team/dashboard'}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </List>
        <List
          disablePadding
          subheader={
            <ListSubheader>
              Members
            </ListSubheader>
          }
        >
          <ListItemButton
            disabled={selectedPage === 'team/create'}
            onClick={() => setSelectedPage('team/members/invite')}
            selected={selectedPage === 'team/members/invite'}
          >
            <ListItemIcon>
              <InviteIcon />
            </ListItemIcon>
            <ListItemText primary="Invite" />
          </ListItemButton>
          <ListItemButton
            disabled={selectedPage === 'team/create'}
            onClick={() => setSelectedPage('team/members')}
            selected={selectedPage === 'team/members'}
          >
            <ListItemIcon>
              <UsersIcon />
            </ListItemIcon>
            <ListItemText primary="Manage" />
          </ListItemButton>
        </List>

        <List
          disablePadding
          subheader={
            <ListSubheader>
              Projects
            </ListSubheader>
          }
        >
          <ListItemButton
            disabled={selectedPage === 'team/create'}
            onClick={() => setSelectedPage('team/projects/create')}
            selected={selectedPage === 'team/projects/create'}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Create" />
          </ListItemButton>
          <ListItemButton
            disabled={selectedPage === 'team/create'}
            onClick={() => setSelectedPage('team/projects')}
            selected={selectedPage === 'team/projects'}
          >
            <ListItemIcon>
              <PluginIcon />
            </ListItemIcon>
            <ListItemText primary="Manage" />
          </ListItemButton>
        </List>
      </Paper>

      <Box>
        {pageComponent}
      </Box>
    </Box>
  </>
}

export function ComingSoonPage(): JSX.Element {
  return <>
    <Typography
      align="center"
      variant="h2"
    >
      Coming Soon
    </Typography>
  </>
}

TeamPage.auth = true

export default TeamPage
