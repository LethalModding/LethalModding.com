import MuiAppBar from '@mui/material/AppBar'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import AccountButton from './auth/AccountButton'

export default function AppBar(): JSX.Element {
  return <MuiAppBar
    position="sticky"
    sx={{
      alignItems:    'center',
      display:       'flex',
      flexDirection: 'row',
      gap:           2,
      height:        56,
      pl:            1.5,
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
      sx={{ flex: 1 }}
      variant="subtitle1"
    >
      LethalModding.com
    </Typography>

    <AccountButton />
  </MuiAppBar>
}
