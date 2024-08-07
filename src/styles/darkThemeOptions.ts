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
  breakpoints: {
    values: {
      xs: 0,
      sm: 800,
      md: 1000,
      lg: 1400,
      xl: 2000,
    },
  },
  typography: {
    fontFamily:  ['VT323', 'monospace'].join(','),
    fontSize:    18,
    allVariants: {
      letterSpacing: '0.25rem',
      lineHeight:    0.97,
      wordSpacing:   '-0.1rem',
    },
    body1: {
      letterSpacing: '0.3rem',
      lineHeight:    1.24,
    },
  },
})

export default responsiveFontSizes(darkThemeOptions)
