/* eslint-disable @next/next/no-img-element */
import TrashIcon from '@mui/icons-material/Delete'
import DotsIcon from '@mui/icons-material/MoreVert'
import WorldIcon from '@mui/icons-material/Public'
import SettingsIcon from '@mui/icons-material/Settings'
import VerifiedIcon from '@mui/icons-material/VerifiedOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

type Props = {
  id: string
  name: string
  owner: string
  summary: string
  verified?: boolean
}

export default function ModListItem(props: Props): JSX.Element {
  const {
    id,
    name,
    owner,
    summary,
    verified,
  } = props

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(menuAnchor)

  return <ListItemButton>
    <img
      alt={`Mod icon for ${name}`}
      src={`https://picsum.photos/seed/${id}/96/96`}
      style={{
        height: 96,
        width:  96,
      }}
    />

    <Box
      sx={{
        display:       'flex',
        flex:          1,
        flexDirection: 'column',
        mt:            -1,
      }}
    >
      <Box
        sx={{
          alignItems:    'baseline',
          display:       'flex',
          flexDirection: 'row',
          gap:           1,
          mb:            -0.75,
          width:         'auto',
          letterSpacing: '.15em',
          wordSpacing:   '-.35em',
        }}
      >
        <Typography variant="h6">
          {name.replaceAll('_', ' ').replaceAll('-', ' ')}
        </Typography>

        {verified && <VerifiedIcon
          color="success"
          fontSize="inherit"
          sx={{
            ml:       -0.5,
            position: 'relative',
            top:      4,
          }}
        />}

        <Typography variant="subtitle2">
          {owner}
        </Typography>
      </Box>

      <Typography
        sx={{
          color:         'primary.dark',
          fontSize:      '90%',
          lineHeight:    1,
          maxHeight:     56,
          letterSpacing: '.15em',
          wordSpacing:   '-.25em',
        }}
        variant="body2"
      >
        {summary}
      </Typography>
    </Box>

    <IconButton
      color="primary"
      onClick={(e) => setMenuAnchor(e.currentTarget)}
    >
      <DotsIcon color="inherit" />
    </IconButton>

    <Menu
      anchorEl={menuAnchor}
      onClose={() => setMenuAnchor(null)}
      open={menuOpen}
    >
      <MenuItem>
        <WorldIcon 
          color="inherit" 
          fontSize="inherit" 
          sx={{ mr: 1 }} 
        />
        <Typography variant="body2">
          Website
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem>
        <SettingsIcon 
          color="inherit" 
          fontSize="inherit" 
          sx={{ mr: 1 }} 
        />
        <Typography variant="body2">
          Settings
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem sx={{ color: 'error.light' }}>
        <TrashIcon 
          color="inherit" 
          fontSize="inherit" 
          sx={{ mr: 1 }} 
        />
        <Typography variant="body2">
          Uninstall
        </Typography>
      </MenuItem>
    </Menu>
  </ListItemButton>
}
