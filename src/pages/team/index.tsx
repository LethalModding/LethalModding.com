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
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Loader from 'components/_shared/Loader'
import ProjectCreatePage from 'components/project/Create'
import ProjectManagePage from 'components/project/Manage'
import TeamCreatePage from 'components/user/Team/Create'
import TeamDashboardPage from 'components/user/Team/Dashboard'
import TeamMemberInvitePage from 'components/user/Team/MemberInvite'
import TeamMemberManagePage from 'components/user/Team/MemberManage'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppStore } from 'store'
import { type Team } from 'types/db/Team'

const TeamPage = (): JSX.Element => {
  const supabase = useSupabaseClient()

  const selectedTeam = useAppStore((state) => state.selectedTeam)
  const setSelectedTeam = useAppStore((state) => state.setSelectedTeam)

  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const refreshTeams = useCallback(() => {
    supabase
      .from('teams')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setTeams(data)

          if (selectedTeam === '' || (selectedTeam !== 'create' &&
            !data.find((team) => team.id === selectedTeam))) {
            setSelectedTeam(data?.[0]?.id)
          }
        }

        setLoading(false)
      })
  }, [selectedTeam, setSelectedTeam, supabase])
  useEffect(() => refreshTeams(), [refreshTeams])

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

  // Return user to /create if they don't have a team
  useEffect(() => {
    if (loading) return
    if (teams.length === 0) setSelectedPage('team/create')
  }, [loading, teams])
  
  const handleTeamCreate = useCallback((teamID: string) => {
    refreshTeams()
    setSelectedTeam(teamID)
    setSelectedPage('team/dashboard')
  }, [refreshTeams, setSelectedTeam])

  const [selectedTeamSlugs, setSelectedTeamSlugs] = useState<string[]>([])
  useEffect(() => {
    if (selectedTeam === '') return

    supabase
      .from('team_slugs')
      .select('slug')
      .eq('team_id', selectedTeam)
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setSelectedTeamSlugs(data.map((team) => team.slug))
        }
      })
  }, [selectedTeam, supabase])

  const pageComponent = useMemo(() => {
    if (loading) return <Loader />

    switch (selectedPage) {
    case 'team/create':
      return <TeamCreatePage
        onTeamCreate={handleTeamCreate}
      />
    case 'team/dashboard':
      return <TeamDashboardPage
        onTeamChange={handleTeamCreate}
        slugs={selectedTeamSlugs}
        team={teams.find((team) => team.id === selectedTeam) as Team}
      />  
    case 'team/members':
      return <TeamMemberManagePage
        onTeamChange={handleTeamCreate}
        team={teams.find((team) => team.id === selectedTeam) as Team}
      />
    case 'team/members/invite':
      return <TeamMemberInvitePage
        onTeamChange={handleTeamCreate}
        team={teams.find((team) => team.id === selectedTeam) as Team}
      />
    case 'team/projects':
      return <ProjectManagePage
        team={teams.find((team) => team.id === selectedTeam) as Team}
      />
    case 'team/projects/create':
      return <ProjectCreatePage
        team={teams.find((team) => team.id === selectedTeam) as Team}
      />
    default:
      return <ComingSoonPage />
    }
  }, [loading, selectedPage, handleTeamCreate, selectedTeamSlugs, teams, selectedTeam])

  return <>
    <Head>
      <title>Your Source for Lethal Company Mods</title>
    </Head>

    <Box
      sx={{
        display:             'grid',
        gridTemplateColumns: teams.length > 0 ? '280px 1fr' : '0px 1fr',

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
