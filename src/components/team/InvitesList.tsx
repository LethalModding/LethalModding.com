import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useSnackbar } from 'notistack'
import type { JSX } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from '@/store.ts'
import type { TeamInvite } from '@/types/db/TeamInvite.ts'
import { TeamInviteListItem } from './InviteListItem.tsx'

export function TeamInvitesList(): JSX.Element | JSX.Element[] {
  const { enqueueSnackbar } = useSnackbar()
  const supabase = useSupabaseClient()

  const [invites, setInvites] = useState<TeamInvite[]>([])
  const teamID = useAppStore((state) => state.selectedTeamID)
  const refreshInvites = useCallback(() => {
    supabase
      .from('team_invites')
      .select('*')
      .eq('team_id', teamID)
      .then(({ data, error }) => {
        if (error) {
          enqueueSnackbar(`Unable to load invites: ${error.message}`, {
            variant: 'error',
          })
        } else {
          setInvites(data)
        }
      })
  }, [supabase, teamID, enqueueSnackbar])
  useEffect(() => refreshInvites(), [refreshInvites])

  return invites.map((invite) => (
    <TeamInviteListItem invite={invite} key={invite.id} refresh={refreshInvites} />
  ))
}
