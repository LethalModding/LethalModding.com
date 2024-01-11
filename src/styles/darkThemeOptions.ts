import type { Theme } from '@mui/material/styles'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const darkThemeOptions: Theme = createTheme({
  palette: {
    mode:    'dark',
    primary: {
      main: '#e8982f',
    },
    secondary: {
      main: '#fc0000',
    },
  },
  typography: {
    fontFamily: ['VT323', 'monospace'].join(','),
    fontSize:   18,
  },
})

export default responsiveFontSizes(darkThemeOptions)
