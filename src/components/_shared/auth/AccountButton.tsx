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
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useCallback, useState, type MouseEvent } from 'react'
import LoginButtons from './LoginButtons'

export default function AccountButton(): JSX.Element {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const hideLoginDialog = useCallback(() => setLoginDialogOpen(false), [])
  const showLoginDialog = useCallback(() => setLoginDialogOpen(true), [])

  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null)
  const openMenu = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setMenuEl(event.currentTarget)
  }, [])
  const closeMenu = useCallback(() => setMenuEl(null), [])

  const session = useSession()

  const supabase = useSupabaseClient()
  const signOut = useCallback(() => {
    supabase.auth.signOut()
  }, [supabase])

  if (session?.user.id) {
    return <>
      <IconButton onClick={openMenu} size="small">
        <Avatar
          alt={session.user.email}
          src={session.user.user_metadata.avatar_url}
        />
      </IconButton>
    
      <Menu open={Boolean(menuEl)} onClose={closeMenu} anchorEl={menuEl}>
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
