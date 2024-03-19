import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import MessageIcon from '@mui/icons-material/Message'
import SettingsIcon from '@mui/icons-material/Settings'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import type { MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from 'store'
import type { Team } from 'types/db/Team'
import LoginButtons from './LoginButtons'

export default function AccountButton(): JSX.Element {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const hideLoginDialog = useCallback(() => setLoginDialogOpen(false), [])
  const showLoginDialog = useCallback(() => setLoginDialogOpen(true), [])

  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null)
  const openMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setMenuEl(event.currentTarget)
  }, [])
  const closeMenu = useCallback(() => setMenuEl(null), [])

  const session = useSession()

  const supabase = useSupabaseClient()
  const signOut = useCallback(() => {
    supabase.auth.signOut()
  }, [supabase])

  const selectedTeamID = useAppStore(state => state.selectedTeamID)
  const setSelectedTeamID = useAppStore(state => state.setSelectedTeamID)

  const handleSelectedTeamChange = useCallback((event: SelectChangeEvent<string>) => {
    if (event.target.value === 'create') {
      setSelectedTeamID('create')
      return
    }

    setSelectedTeamID(event.target.value)
  }, [setSelectedTeamID])

  const [teams, setTeams] = useState<Partial<Team>[]>([])
  const [loading, setLoading] = useState(true)
  const refreshTeams = useCallback(() => {
    supabase
      .from('teams')
      .select('id,name')
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
        } else {
          setTeams(data)

          if (selectedTeamID === '' || (selectedTeamID !== 'create' &&
            !data.find((team) => team.id === selectedTeamID))) {
            setSelectedTeamID(data?.[0]?.id)
          }
        }

        setLoading(false)
      })
  }, [selectedTeamID, setSelectedTeamID, supabase])
  useEffect(() => refreshTeams(), [refreshTeams])

  if (session?.user.id) {
    return <>
      <ListItemButton
        onClick={openMenu}
        sx={{
          '.MuiTypography-root': {
            lineHeight: 1,
            textAlign:  'right',
          }
        }}
      >
        <ListItemText
          primary={session.user.user_metadata.full_name}
          secondary={teams?.find((team) => team.id === selectedTeamID)?.name || 'No Team'}
        />
        <Avatar
          alt={session.user.email}
          src={session.user.user_metadata.avatar_url}
          sx={{ ml: 1, mb: 0.1 }}
        />
      </ListItemButton>

      <Menu
        anchorEl={menuEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={closeMenu}
        open={Boolean(menuEl)}
      >
        <MenuItem>
          <FormControl
            disabled={loading}
            fullWidth
            variant="filled"
          >
            <InputLabel>Team</InputLabel>
            <Select
              label="Team"
              onChange={handleSelectedTeamChange}
              value={selectedTeamID}
            >
              {teams.map((team) => <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>)}
              <Divider />
              <MenuItem value="create">
                <em>Create New Team</em>
              </MenuItem>
            </Select>
          </FormControl>
        </MenuItem>
        <Divider />
        <MenuItem>
          <AccountCircleIcon sx={{ mr: 2 }} />
          Account
        </MenuItem>
        <MenuItem>
          <MessageIcon sx={{ mr: 2 }} />
          Messages
        </MenuItem>
        <MenuItem>
          <SettingsIcon sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={signOut} sx={{ color: 'warning.main' }}>
          <LogoutIcon sx={{ mr: 2 }} />
          Log Out
        </MenuItem>
      </Menu>
    </>
  }

  return <>
    <Dialog
      fullWidth
      onClose={hideLoginDialog}
      open={loginDialogOpen}
      maxWidth="xs"
    >
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <LoginButtons />
      </DialogContent>
    </Dialog>

    <Button
      color="primary"
      onClick={showLoginDialog}
      size="small"
      variant="outlined"
    >
      <AccountCircleIcon sx={{ mr: 1 }} />
      Login
    </Button>
  </>
}
