import type { Theme } from '@mui/material/styles'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const lightThemeOptions: Theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: ['VT323', 'monospace'].join(','),
    fontSize:   24,
  },
})

export default responsiveFontSizes(lightThemeOptions)
