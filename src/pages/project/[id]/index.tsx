import PrivateIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'
import { type Profile } from 'types/db/Profile'
import { type Project } from 'types/db/Project'
import { type Team } from 'types/db/Team'

const ProjectPage = (): JSX.Element => {
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
          console.error(error)
        } else {
          setProject(data)
        }
      })
  }, [id, supabase])
  useEffect(() => refreshProject(), [refreshProject])

  const refreshTeam = useCallback(() => {
    if (project === null) return

    supabase
      .from('teams')
      .select('*')
      .eq('id', project.team_id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setTeam(data)
        }
      })
  }, [project, supabase])
  useEffect(() => refreshTeam(), [refreshTeam])

  const [creator, setCreator] = useState<Profile | null>(null)
  const refreshCreator = useCallback(() => {
    if (project === null) return

    supabase
      .from('profiles')
      .select('*')
      .eq('id', project.created_by)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setCreator(data)
        }
      })
  }, [project, supabase])
  useEffect(() => refreshCreator(), [refreshCreator])

  return <>
    <Head>
      <title>Your Source for Lethal Company Mods</title>
    </Head>

    <Box
      sx={{
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
      }}
    > 
      <Paper
        sx={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',

          borderRadius: 0,
          gap:          4,
          p:            4,
        }}
      >
        <Box>
          {project === null
            ? <Skeleton variant="text" height={32} width={400} />
            : <Typography variant="h5">{project.name}</Typography>}
          {team === null
            ? <Skeleton variant="text" height={20} width={200} />
            : <Typography variant="subtitle1">{team.name}</Typography>}
        </Box>
        
        <Box sx={{ fontSize: '2em', mb: -2 }}>
          <Tooltip title={project?.type === 'public' ? 'Public' : 'Private'}>
            {project?.type === 'public'
              ? <PublicIcon fontSize="inherit" />
              : <PrivateIcon fontSize="inherit" />}
          </Tooltip>
        </Box>
      </Paper>

      <Paper
        sx={{
          borderRadius: 0,
          borderTop:    '1px solid',
          borderColor:  'divider',
          p:            4,
        }}
      >
        <Typography variant="h6">
          Summary
        </Typography>
        {project === null
          ? <Skeleton variant="text" height={60} width={600} />
          : <Typography variant="body1">{project.summary || 'No summary provided.'}</Typography>}
      </Paper>
      <Paper
        sx={{
          borderRadius: 0,
          borderTop:    '1px solid',
          borderColor:  'divider',
          p:            4,
        }}
      >
        <Typography variant="h6">
          Details
        </Typography>
        <Typography variant="body1">
          Created: <ReactTimeAgo date={new Date(project?.created_at ?? 0)} /> (by {creator?.username || 'Unknown'})
        </Typography>
        <Typography variant="body1">
          Updated: <ReactTimeAgo date={new Date(project?.updated_at ?? 0)} />
        </Typography>
      </Paper>
    </Box>
  </>
}

ProjectPage.auth = true

export default ProjectPage
