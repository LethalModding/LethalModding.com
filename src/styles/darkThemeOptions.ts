import type { Theme } from '@mui/material/styles'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const darkThemeOptions: Theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: ['VT323', 'monospace'].join(','),
    fontSize:   24,
  },
})

export default responsiveFontSizes(darkThemeOptions)
