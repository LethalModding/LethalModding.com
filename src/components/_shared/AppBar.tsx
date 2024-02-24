import MuiAppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Link from 'components/mui/Link'
import Image from 'next/image'
import AccountButton from './auth/AccountButton'

export default function AppBar(): JSX.Element {
  return <MuiAppBar
    position="sticky"
    sx={{
      alignItems:    'center',
      display:       'flex',
      flexDirection: 'row',
      height:        56,
      pl:            1.5,
      userSelect:    'none',
    }}
  >
    <Link
      href="/"
      sx={{
        display:        'flex',
        alignItems:     'center',
        flex:           1,
        gap:            1,
        textDecoration: 'none',

        '&:hover': {
          backgroundColor: 'unset !important',
        },
      }}
    >
      <Image
        alt="logo"
        height={48}
        src="/icons/favicon.ico"
        width={48}
      />

      <Typography
        color="text.secondary"
        component="h1"
        variant="subtitle1"
      >
        LethalModding.com
      </Typography>
    </Link>

    <AccountButton />
  </MuiAppBar>
}
