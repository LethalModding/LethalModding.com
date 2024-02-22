import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useSnackbar } from 'notistack'
import { useCallback } from 'react'
import { type TeamInvite } from 'types/TeamInvite'

type Props = {
  expanded?: boolean
  invite: TeamInvite
  refresh: () => void
}

export default function InviteListItem(props: Props): JSX.Element {
  const { expanded, invite, refresh } = props

  const session = useSession()
  const supabase = useSupabaseClient()

  const { enqueueSnackbar } = useSnackbar()
  const handleRevoke = useCallback(() => {
    supabase
      .from('team_invites')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', invite.id)
      .then(({ error }) => {
        refresh()

        if (error) {
          enqueueSnackbar('Unable to revoke invite', { variant: 'error' })
          console.error(error)
        } else {
          enqueueSnackbar('Invite revoked', { variant: 'success' })
        }
      })
  }, [enqueueSnackbar, invite.id, refresh, supabase])

  return <Box
    sx={{
      display:             'grid',
      gridTemplateColumns: '1fr auto auto',
      alignItems:          'center',
      gap:                 2,
      
      '&:not(:last-child)': {
        borderBottom: '1px solid',
        borderColor:  'divider',
      },

      color:          invite.deleted_at ? 'text.disabled' : 'text.primary',
      textDecoration: invite.deleted_at ? 'line-through' : 'none',
    }}
  >
    <Box>
      <Typography>
        {invite.email}
      </Typography>

      {expanded ? <Typography color="text.secondary">
        {invite.type}
      </Typography> : null}
    </Box>

    <Box>
      {expanded ? <Typography color="text.secondary">
        {invite.inviter === session?.user.id ? 'You' : invite.inviter}
      </Typography> : null}
      <Typography color="text.secondary" variant="body2">
        {invite.created_at}
      </Typography>
    </Box>

    {invite.deleted_at ? null : <IconButton color="primary" onClick={handleRevoke} size="small">
      <DeleteIcon fontSize="inherit" />
    </IconButton>}
  </Box>
}
