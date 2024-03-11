import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MuiAppBar from '@mui/material/AppBar'
import ListItemButton from '@mui/material/ListItemButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/system/useMediaQuery'
import Link from 'components/mui/Link'
import Image from 'next/image'
import { useState } from 'react'
import AccountButton from './auth/AccountButton'

export default function AppBar(): JSX.Element {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  return <MuiAppBar
    position="sticky"
    sx={{
      alignItems:     'stretch',
      flexDirection:  'row',
      justifyContent: 'space-between',
      height:         56,

      'a': {
        display:    'grid',
        placeItems: 'center',

        backgroundColor: 'transparent',
        color:           'inherit',
        height:          '100%',
        textDecoration:  'none',
      },

      '.MuiListItemButton-root': {
        flexGrow: 0,
        pb:       0,
        pl:       2,
        pr:       1.6,
        pt:       0.25,
      }
    }}
  >
    <ListItemButton sx={{ pr: '8px !important' }}>
      <Link href="/" sx={{ pt: 0 }}>
        <Image
          alt="logo"
          height={48}
          src="/icons/favicon.ico"
          width={48}
        />
      </Link>
    </ListItemButton>

    {isMobile ? <>
      <ListItemButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        {anchorEl ? <MenuOpenIcon /> : <MenuIcon />}
      </ListItemButton>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        sx={{
          'a': {
            color:          'inherit',
            textDecoration: 'none',

            '&:hover': {
              backgroundColor: 'unset',
            }
          },

          '.MuiMenuItem-root': {
            px: 3,
            py: 0,
          }
        }}
      >
        <MenuItem>
          <Link href="https://discord.gg/lcmod">
            Join the Discord
          </Link>
        </MenuItem>

        <MenuItem>
          <Link href="/tools">
            Search Thunderstore
          </Link>
        </MenuItem>

        <MenuItem>
          <Link href="/team">
            Your Team
          </Link>
        </MenuItem>
      </Menu>
    </> : <>
      <ListItemButton>
        <Link href="https://discord.gg/lcmod">
          Join the Discord
        </Link>
      </ListItemButton>

      <ListItemButton>
        <Link href="/tools">
          Search Thunderstore
        </Link>
      </ListItemButton>

      <ListItemButton>
        <Link href="/team">
          Your Team
        </Link>
      </ListItemButton>
    </>}

    <AccountButton />
  </MuiAppBar>
}
