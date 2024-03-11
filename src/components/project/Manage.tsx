import UnpublishedIcon from '@mui/icons-material/Unpublished'
import VisibilityOnIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Loader from 'components/_shared/Loader'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Project } from 'types/db/Project'
import { type Team } from 'types/db/Team'

type Props = {
  team: Team
}

export default function ProjectManagePage(props: Props): JSX.Element {
  const { team } = props

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = useSupabaseClient()
  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('team_id', team.id)
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setProjects(data)
        }
        setLoading(false)
      })
  }, [supabase, team.id])

  const router = useRouter()

  return <>
    <Loader open={loading} />

    <Paper sx={{ px: 2, pt: 2, pb: 1.5 }}>
      <Typography variant="h5">Projects</Typography>
    </Paper>

    {projects.map((project) => (
      <Paper elevation={1} key={project.id}>
        <ListItemButton
          onClick={() => router.push(`/project/${project.id}`)}
        >
          <ListItemIcon>
            <UnpublishedIcon
              color="inherit"
              sx={{ color: 'text.secondary', ml: 0.75 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={project.name}
            secondary={project.summary || 'Not Published'}
          />
          <Typography variant="caption">
            {project.type === 'public'
              ? <VisibilityOnIcon
                color="inherit"
                sx={{ color: 'text.secondary', mt: 1, mr: 2 }}
              />
              : <VisibilityOffIcon
                color="inherit"
                sx={{ color: 'text.secondary', mt: 1, mr: 2 }}
              />}
          </Typography>
        </ListItemButton>
      </Paper>
    ))}
  </>
}
