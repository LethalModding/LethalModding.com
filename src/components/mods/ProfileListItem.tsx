/* eslint-disable @next/next/no-img-element */
import TrashIcon from '@mui/icons-material/Delete'
import DotsIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import type { Dispatch, MouseEvent, SetStateAction } from 'react'
import { useCallback, useState } from 'react'
import type { Profile } from 'types/Profile'

type Props = {
  onSelect: Dispatch<SetStateAction<Profile>>
  profile: Profile
}

export default function ProfileListItem(props: Props): JSX.Element {
  const {
    onSelect,
    profile,
  } = props

  const handleClick = useCallback(() => onSelect(profile), [onSelect, profile])

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(menuAnchor)

  const handleMenuClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }, [])

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null)
  }, [])

  return <ListItemButton
    selected={profile.id === '30'}
    onClick={handleClick}
  >
    <img
      alt={`Profile icon for ${profile.name}`}
      src={`https://picsum.photos/seed/${profile.id}/40/40`}
      style={{
        height: 40,
        width:  40,
      }}
    />

    <Box
      sx={{
        display:       'flex',
        flex:          1,
        flexDirection: 'column',
        mx:            2,
      }}
    >
      <Typography
        sx={{
          fontSize:   `${24 * (1 - (profile.name.length / 75))}px !important`,
          lineHeight: 1,
        }}
        variant='h6'
      >
        {profile.name}
      </Typography>

      {profile.owner && <Typography
        color="text.secondary"
        sx={{
          fontSize:   `${18 * (1 - (profile.owner.length / 75))}px !important`,
          lineHeight: 1,
        }}
        variant='body2'
      >
        {profile.owner}
      </Typography>}
    </Box>

    <IconButton
      color="primary"
      onClick={handleMenuClick}
      size="small"
      sx={{ mr: -1 }}
    >
      <DotsIcon color="inherit" fontSize="inherit" />
    </IconButton>

    <Menu
      anchorEl={menuAnchor}
      onClose={handleMenuClose}
      open={menuOpen}
    >
      <MenuItem sx={{ color: 'error.light' }}>
        <TrashIcon color="inherit" fontSize="inherit" sx={{ mr: 1 }} />
        <Typography variant="body2">
          Delete
        </Typography>
      </MenuItem>
    </Menu>
  </ListItemButton>
}
