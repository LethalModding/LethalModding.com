import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { JSX } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { AuthWrapper } from '@/components/_shared/auth/Wrapper.tsx'
import { Link } from '@/components/mui/Link.tsx'
import { ProjectManagePage } from '@/components/project/Manage.tsx'
import { TeamCreatePage } from '@/components/team/Create.tsx'
import { TeamMemberManagePage } from '@/components/team/MemberManage.tsx'
import { TeamMenu } from '@/components/team/Menu.tsx'
import { TeamProfilePage } from '@/components/team/Profile.tsx'
import { useAppStore } from '@/store.ts'

const TeamContent = (): JSX.Element => {
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

  const selectedTeam = useAppStore((state) => state.selectedTeam)

  return (
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
          {selectedPage === '' ? (
            selectedTeam?.name || 'Team'
          ) : (
            <>
              <Link onClick={() => setSelectedPage('')} sx={{ textDecoration: 'none' }}>
                {selectedTeam?.name || 'Team'}
              </Link>
              {' > '}
              {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
            </>
          )}
        </Typography>
      </Paper>

      {selectedPage === 'create' ? (
        pageComponent
      ) : selectedTeam === null ? (
        <Box sx={{ p: 2 }}>
          <Typography gutterBottom={true} variant="h5">
            Please select a team to view or manage.
          </Typography>
          <Typography variant="h6">
            Alternatively, you can <Link href="/team/create">create a new team</Link>.
          </Typography>
        </Box>
      ) : pageComponent ? (
        pageComponent
      ) : (
        <TeamMenu setSelectedPage={setSelectedPage} />
      )}
    </Box>
  )
}

const TeamPage = (): JSX.Element => (
  <>
    <Head>
      <title>Your Lethal Company Modding Team</title>
      <meta
        name="description"
        content="Manage your Lethal Company modding team: its profile, members and projects."
      />
    </Head>

    <AuthWrapper>
      <TeamContent />
    </AuthWrapper>
  </>
)

export default TeamPage
