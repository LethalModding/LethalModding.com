import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from 'store'
import type { Profile } from 'types/db/Profile'
import TeamInvitesList from './InvitesList'
import TeamMemberInvitePage from './MemberInvite'

export default function TeamMemberManagePage(): JSX.Element {
  const supabase = useSupabaseClient()

  const team = useAppStore(state => state.selectedTeam)
  
  const [members, setMembers] = useState<Profile[]>([])
  const refreshMembers = useCallback(() => {
    if (!team) return

    const members = team.members || []
    members.push(team.owner_id)

    supabase
      .from('profiles')
      .select('*')
      .in('id', members)
      .order('username', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setMembers(data || [])
        }
      })
  }, [supabase, team])
  useEffect(() => refreshMembers(), [refreshMembers])

  return <>
    <TeamMemberInvitePage />
    <Paper sx={{ m: 2, mt: 0, p: 2 }}>
      <Typography gutterBottom variant="h4">
        Members
      </Typography>

      {members.map(member => <Box
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
            {member.id === team?.owner_id
              ? 'Owner'
              : 'Member'}
          </Typography>
        </Box>

        {member.id !== team?.owner_id ? <IconButton size="small">
          <DeleteIcon fontSize="inherit" />
        </IconButton> : null}
      </Box>)}
    </Paper>

    <Paper sx={{ m: 2, mt: 0, p: 2 }}>
      <Typography gutterBottom variant="h4">
        Invites
      </Typography>

      <TeamInvitesList />
    </Paper>
  </>
}
