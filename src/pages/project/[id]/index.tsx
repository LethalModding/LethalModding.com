import PrivateIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
import { useParams } from 'next/navigation'
import { useSnackbar } from 'notistack'
import type { JSX } from 'react'
import { useCallback, useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { AuthWrapper } from '@/components/_shared/auth/Wrapper.tsx'
import type { Profile } from '@/types/db/Profile.ts'
import type { Project } from '@/types/db/Project.ts'
import type { Team } from '@/types/db/Team.ts'
import { useSupabaseClient } from '@/utility/supabase.ts'

const ProjectContent = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const supabase = useSupabaseClient()

  const [project, setProject] = useState<Project | null>(null)
  const [team, setTeam] = useState<Team | null>(null)

  const refreshProject = useCallback(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          enqueueSnackbar(`Unable to load project: ${error.message}`, {
            variant: 'error',
          })
        } else {
          setProject(data)
        }
      })
  }, [id, supabase, enqueueSnackbar])
  useEffect(() => refreshProject(), [refreshProject])

  const refreshTeam = useCallback(() => {
    if (project === null) {
      return
    }

    supabase
      .from('teams')
      .select('*')
      .eq('id', project.team_id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          enqueueSnackbar(`Unable to load team: ${error.message}`, {
            variant: 'error',
          })
        } else {
          setTeam(data)
        }
      })
  }, [project, supabase, enqueueSnackbar])
  useEffect(() => refreshTeam(), [refreshTeam])

  const [creator, setCreator] = useState<Profile | null>(null)
  const refreshCreator = useCallback(() => {
    if (project === null) {
      return
    }

    supabase
      .from('profiles')
      .select('*')
      .eq('id', project.created_by)
      .single()
      .then(({ data, error }) => {
        if (error) {
          enqueueSnackbar(`Unable to load creator: ${error.message}`, {
            variant: 'error',
          })
        } else {
          setCreator(data)
        }
      })
  }, [project, supabase, enqueueSnackbar])
  useEffect(() => refreshCreator(), [refreshCreator])

  return (
    <Box
      sx={{
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
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',

          borderRadius: 0,
          gap: 4,
          p: 4,
        }}
      >
        <Box>
          {project === null ? (
            <Skeleton variant="text" height={32} width={400} />
          ) : (
            <Typography variant="h5">{project.name}</Typography>
          )}
          {team === null ? (
            <Skeleton variant="text" height={20} width={200} />
          ) : (
            <Typography variant="subtitle1">{team.name}</Typography>
          )}
        </Box>

        <Box sx={{ fontSize: '2em', mb: -2 }}>
          <Tooltip title={project?.type === 'public' ? 'Public' : 'Private'}>
            {project?.type === 'public' ? (
              <PublicIcon fontSize="inherit" />
            ) : (
              <PrivateIcon fontSize="inherit" />
            )}
          </Tooltip>
        </Box>
      </Paper>

      <Paper
        sx={{
          borderRadius: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 4,
        }}
      >
        <Typography variant="h6">Summary</Typography>
        {project === null ? (
          <Skeleton variant="text" height={60} width={600} />
        ) : (
          <Typography variant="body1">{project.summary || 'No summary provided.'}</Typography>
        )}
      </Paper>
      <Paper
        sx={{
          borderRadius: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          p: 4,
        }}
      >
        <Typography variant="h6">Details</Typography>
        <Typography variant="body1">
          Created: <ReactTimeAgo date={new Date(project?.created_at ?? 0)} /> (by{' '}
          {creator?.username || 'Unknown'})
        </Typography>
        <Typography variant="body1">
          Updated: <ReactTimeAgo date={new Date(project?.updated_at ?? 0)} />
        </Typography>
      </Paper>
    </Box>
  )
}

const ProjectPage = (): JSX.Element => (
  <>
    <Head>
      <title>Lethal Company Modding Project</title>
      <meta name="description" content="A Lethal Company modding project and its team." />
    </Head>

    <AuthWrapper>
      <ProjectContent />
    </AuthWrapper>
  </>
)

export default ProjectPage
