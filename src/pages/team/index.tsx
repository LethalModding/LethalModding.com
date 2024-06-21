import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TeamCreatePage from 'components/Team/Create'
import TeamMemberManagePage from 'components/Team/MemberManage'
import TeamMenu from 'components/Team/Menu'
import TeamProfilePage from 'components/Team/Profile'
import Link from 'components/mui/Link'
import ProjectManagePage from 'components/project/Manage'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from 'store'

const TeamPage = (): JSX.Element => {
  const [selectedPage, setSelectedPage] = useState('')

  const pageComponent = useMemo(() => {
    switch (selectedPage) {
      case 'create':
        return <TeamCreatePage />
      case 'members':
        return <TeamMemberManagePage />
      case 'profile':
        return <TeamProfilePage />
      case 'projects':
        return <ProjectManagePage />
      default:
        return null
    }
  }, [selectedPage])
  const router = useRouter()
  useEffect(() => {
    if (router.query.page) {
      setSelectedPage((router.query.page as string[]).join('/'))
    }
  }, [router.query.page])

  const selectedTeam = useAppStore(state => state.selectedTeam)

  return (
    <>
      <Head>
        <title>Your Source for Lethal Company Mods</title>
      </Head>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 56px)',

          overflowX: 'hidden',
          overflowY: 'auto',

          '&::-webkit-scrollbar': {
            width: '0.25em',
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
            {selectedPage !== '' ? (
              <>
                <Link
                  onClick={() => setSelectedPage('')}
                  sx={{ textDecoration: 'none' }}
                >
                  {selectedTeam?.name || 'Team'}
                </Link>
                {' > '}
                {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
              </>
            ) : (
              selectedTeam?.name || 'Team'
            )}
          </Typography>
        </Paper>

        {selectedPage === 'create' ? (
          pageComponent
        ) : selectedTeam === null ? (
          <Box sx={{ p: 2 }}>
            <Typography
              gutterBottom
              variant="h5"
            >
              Please select a team to view or manage.
            </Typography>
            <Typography variant="h6">
              Alternatively, you can{' '}
              <Link href="/team/create">create a new team</Link>.
            </Typography>
          </Box>
        ) : pageComponent ? (
          pageComponent
        ) : (
          <TeamMenu setSelectedPage={setSelectedPage} />
        )}
      </Box>
    </>
  )
}

TeamPage.auth = true

export default TeamPage
