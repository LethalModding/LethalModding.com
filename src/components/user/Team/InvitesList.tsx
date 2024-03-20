import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from 'store'
import type { TeamInvite } from 'types/db/TeamInvite'
import InviteListItem from '../inviteListItem'

export default function TeamInvitesList(): JSX.Element | JSX.Element[] {
  const supabase = useSupabaseClient()

  const [invites, setInvites] = useState<TeamInvite[]>([])
  const teamID = useAppStore(state => state.selectedTeamID)
  const refreshInvites = useCallback(() => {
    supabase
      .from('team_invites')
      .select('*')
      .eq('team_id', teamID)
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setInvites(data)
        }
      })
  }, [supabase, teamID])
  useEffect(() => refreshInvites(), [refreshInvites])

  return invites.map((invite) => <InviteListItem
    invite={invite}
    key={invite.id}
    refresh={refreshInvites}
  />)
}
