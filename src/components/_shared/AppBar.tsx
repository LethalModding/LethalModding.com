import MuiAppBar from '@mui/material/AppBar'
import ListItemButton from '@mui/material/ListItemButton'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/system/useMediaQuery'
import Link from 'components/mui/Link'
import Image from 'next/image'
import AccountButton from './auth/AccountButton'

export default function AppBar(): JSX.Element {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

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

    <AccountButton />
  </MuiAppBar>
}
