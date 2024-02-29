import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Loader from 'components/_shared/Loader'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { type Team } from 'types/Team'

type UserProfile = {
  id: string

  created_at: string
  updated_at: string
  deleted_at?: string

  avatar_url: string
  full_name: string
  username?: string
}

type Props = {
  onTeamChange: (teamID: string) => void
  team: Team
}

export default function TeamMemberManagePage(props: Props): JSX.Element {
  const { team } = props
  
  const supabase = useSupabaseClient()
  
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<UserProfile[]>([])
  const sortedMembers = useMemo(() => {
    return members.sort((a, b) => {
      return a.created_at < b.created_at ? 1 : -1
    })
  }, [members])

  const refreshMembers = useCallback(() => {
    const members = team.members || []
    members.push(team.owner_id)

    supabase
      .from('profiles')
      .select('*')
      .in('id', members)
      .then(({ data, error }) => {
        setLoading(false)

        if (error) {
          console.error(error)
        } else {
          setMembers(data)
        }
      })
  }, [supabase, team.members, team.owner_id])
  useEffect(() => refreshMembers(), [refreshMembers])

  return <Box
    sx={{
      display:    'grid',
      height:     '100%',
      placeItems: 'center'
    }}
  >
    <Loader open={loading} />

    <Paper
      sx={{
        display:       'flex',
        flexDirection: 'column',
        gap:           1,
        p:             2,
      }}
    >
      <Typography sx={{ pb: 1.5 }} variant="h5">
        Members
      </Typography>

      {sortedMembers.map((member) => <Box
        key={member.id}
        sx={{
          display:             'grid',
          alignItems:          'center',
          flexDirection:       'row',
          gap:                 2,
          gridTemplateColumns: '1fr auto',
        }}
      >
        <Box>
          <Typography variant="h5">
            {member.username ? `@${member.username}` : member.full_name}
          </Typography>
          <Typography variant="body2">
            {member.id === team.owner_id ? 'Owner' : ''}
          </Typography>
        </Box>

        {member.id !== team.owner_id ? <IconButton size="small">
          <DeleteIcon fontSize="inherit" />
        </IconButton> : null}
      </Box>)}
    </Paper>
  </Box>
}
