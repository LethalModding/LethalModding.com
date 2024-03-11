import MenuIcon from '@mui/icons-material/Menu'
import MuiAppBar from '@mui/material/AppBar'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListSubheader from '@mui/material/ListSubheader'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/system/useMediaQuery'
import Link from 'components/mui/Link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import AccountButton from './auth/AccountButton'

export default function AppBar(): JSX.Element {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  const router = useRouter()

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
    {isMobile ? <>
      <ListItemButton onClick={() => setDrawerOpen(true)}>
        <MenuIcon />
      </ListItemButton>

      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={closeDrawer}
        onOpen={() => setDrawerOpen(true)}
        sx={{
          '.MuiDrawer-paper': {
            maxWidth: '100vw',
            width:    265,
          },

          'a': {
            color:          'inherit',
            textDecoration: 'none',

            '&:hover': {
              backgroundColor: 'unset',
            },
          },
        }}
      >
        <Link
          href="/"
          onClick={closeDrawer}
          sx={{
            alignItems:     'center',
            display:        'flex',
            flexDirection:  'row',
            justifyContent: 'center',
            py:             2,
          }}
        >
          <Image
            alt="logo"
            height={32}
            src="/icons/favicon.ico"
            width={32}
          />
          <Typography
            align="center"
            color="textPrimary"
            sx={{ ml: 1, mt: 0.25 }}
            variant="h6"
          >
            LethalModding.com
          </Typography>
        </Link>

        <List disablePadding>
          <ListItemButton selected={router.pathname === '/team'}>
            <Link onClick={closeDrawer} href="/team">
              Your Team
            </Link>
          </ListItemButton>
          
          <ListSubheader disableSticky sx={{ }}>
            Tools
          </ListSubheader>

          <ListItemButton onClick={closeDrawer} selected={router.pathname === '/tools'}>
            <Link href="/tools">
              Search Thunderstore
            </Link>
          </ListItemButton>

          <ListSubheader disableSticky>
            Community
          </ListSubheader>

          <ListItemButton onClick={closeDrawer} selected={router.pathname === '/'}>
            <Link href="https://discord.gg/lcmod">
              Join the Discord
            </Link>
          </ListItemButton>
        </List>
      </SwipeableDrawer>
    </> : <>
      <ListItemButton selected={router.pathname === '/'} sx={{ pr: '8px !important' }}>
        <Link href="/" sx={{ pt: 0 }}>
          <Image
            alt="logo"
            height={48}
            src="/icons/favicon.ico"
            width={48}
          />
        </Link>
      </ListItemButton>
      
      <ListItemButton>
        <Link href="https://discord.gg/lcmod">
          Join the Discord
        </Link>
      </ListItemButton>

      <ListItemButton selected={router.pathname === '/tools'}>
        <Link href="/tools">
          Search Thunderstore
        </Link>
      </ListItemButton>

      <ListItemButton selected={router.pathname === '/team'}>
        <Link href="/team">
          Your Team
        </Link>
      </ListItemButton>
    </>}

    <AccountButton />
  </MuiAppBar>
}
