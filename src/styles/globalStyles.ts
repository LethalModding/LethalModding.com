import { useMediaQuery } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'

type Styles = {
  [key: string]: SxProps<Theme>
}

const globalStyles: Styles = {
  container: {
    alignItems:     'center',
    display:        'flex',
    flexDirection:  'column',
    gap:            '32px',
    justifyContent: 'center',
    minHeight:      '100vh',
    py:             '16px',
    userSelect:     'none',
  },

  linksBox: {
    display:       'flex',
    flexDirection: 'row',
    gap:           '16px',
    maxWidth:      'clamp(400px, 80vw, 1200px)',
    minWidth:      'clamp(400px, 80vw, 1200px)',

    '.column': {
      display:       'flex',
      flex:          '1 1 50%',
      flexDirection: 'column',
      gap:           '24px',
    },
  },
}

export default function useGlobalStyles(): Styles {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  return {
    ...globalStyles,
    linksBox: {
      ...globalStyles.linksBox,
      flexDirection: isDesktop ? 'row' : 'column',
      px:            isDesktop ? undefined : '8px',
      'h3':          {
        fontSize: 'clamp(1.5rem, 3vw, 5rem)',
        mt:       isDesktop ? undefined : '32px',
      },
    },
  }
}
