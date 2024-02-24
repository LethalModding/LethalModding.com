import AddIcon from '@mui/icons-material/Add'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PluginIcon from '@mui/icons-material/Extension'
import UsersIcon from '@mui/icons-material/Group'
import InviteIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Loader from 'components/_shared/Loader'
import DashboardPage from 'components/user/dashboard'
import TeamCreatePage from 'components/user/Team/Create'
import TeamMemberInvitePage from 'components/user/Team/MemberInvite'
import TeamMemberManagePage from 'components/user/Team/MemberManage'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type Team } from 'types/Team'

const UserPage = (): JSX.Element => {
  const [selectedTeam, setSelectedTeam] = useState('')

  const supabase = useSupabaseClient()

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
  }, [selectedTeam, supabase])
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
    router.replace(`/user/${selectedPage}`, undefined, { shallow: true })
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
  }, [refreshTeams])

  const pageComponent = useMemo(() => {
    if (loading) return <Loader />

    switch (selectedPage) {
    case 'team/create':
      return <TeamCreatePage
        onTeamCreate={handleTeamCreate}
      />
    case 'team/dashboard':
      return <DashboardPage
        onTeamChange={handleTeamCreate}
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
      return <ComingSoonPage />
    case 'team/projects/create':
      return <ComingSoonPage />
    default:
      return <ComingSoonPage />
    }
  }, [loading, selectedPage, handleTeamCreate, teams, selectedTeam])

  const handleSelectedTeamChange = useCallback((event: SelectChangeEvent<string>) => {
    if (event.target.value === 'create') {
      setSelectedPage('team/create')
      setSelectedTeam('create')
      return
    }

    setSelectedTeam(event.target.value)
    if (selectedPage === 'team/create') {
      setSelectedPage('team/dashboard')
    }
  }, [selectedPage])

  return <>
    <Head>
      <title>Your Source for Lethal Company Mods</title>
    </Head>

    <Box
      sx={{
        display:             'grid',
        gridTemplateColumns: teams.length > 0 ? '300px 1fr' : '0px 1fr',

        '& > *': {
          height:   'calc(100vh - 56px)',
          overflow: 'hidden',
        }
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 0,
          zINdex:       1000,

          '.MuiListSubheader-root': {
            userSelect: 'none',
          }
        }}
      >
        <FormControl
          fullWidth
          variant="filled"
        >
          <InputLabel>Team</InputLabel>
          <Select
            label="Team"
            onChange={handleSelectedTeamChange}
            value={selectedTeam}
          >
            {teams.map((team) => <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>)}
            <Divider />
            <MenuItem value="create">
              <em>Create New Team</em>
            </MenuItem>
          </Select>
        </FormControl>

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

      <Box
        sx={{
          overflowX: 'hidden',
          overflowY: 'auto',

          p: 1,

          '&::-webkit-scrollbar': {
            width:  '0.25em',
            height: '0.25em',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--accent)',
          },
        }}
      >
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

UserPage.auth = true

export default UserPage
