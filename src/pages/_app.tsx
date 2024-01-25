import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/utils'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import type { Theme } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import ThemeProvider from '@mui/system/ThemeProvider'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useCallback, useState, type FunctionComponent, type PropsWithChildren } from 'react'
import darkThemeOptions from 'styles/darkThemeOptions'
import 'styles/globals.css'
import createEmotionCache from 'utility/createEmotionCache'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const clientSideEmotionCache: EmotionCache = createEmotionCache()

const darkTheme: Theme = createTheme(darkThemeOptions)

const MyApp: FunctionComponent<MyAppProps> = (props: PropsWithChildren<MyAppProps>) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const [isAccessible, setIsAccessible] = useState<boolean>(false)
  const toggleAccessibility = useCallback(() => {
    const newState = !isAccessible

    if (newState) {
      document.body.classList.add('accessible')
    } else {
      document.body.classList.remove('accessible')
    }

    setIsAccessible(newState)
  }, [isAccessible])

  return <CacheProvider value={emotionCache}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <IconButton
        color="inherit"
        onClick={toggleAccessibility}
        sx={{
          bottom:     '0.75em',
          cursor:     'pointer',
          fontSize:   '2em',
          right:      '0.75em',
          lineHeight: 1,
          position:   'absolute',
          textAlign:  'right',
          zIndex:     100,
        }}
        tabIndex={0}
      >
        {!isAccessible ? <AccessibilityNewIcon fontSize='inherit' /> :
          <AccessibleForwardIcon fontSize='inherit' />}
      </IconButton>
      <Component {...pageProps} />
    </ThemeProvider>
  </CacheProvider>
}

export default MyApp
