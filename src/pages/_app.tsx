import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/utils'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import type { Theme } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import ThemeProvider from '@mui/system/ThemeProvider'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import AppBar from 'components/_shared/AppBar'
import Loader from 'components/_shared/Loader'
import AuthWrapper from 'components/_shared/auth/Wrapper'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'
import type { FunctionComponent, PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { useAppStore } from 'store'
import darkThemeOptions from 'styles/darkThemeOptions'
import 'styles/globals.css'
import createEmotionCache from 'utility/createEmotionCache'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

interface MyAppProps extends Omit<AppProps, 'Component'> {
  Component: AppProps['Component'] & { auth?: boolean }
  emotionCache?: EmotionCache
}

const clientSideEmotionCache: EmotionCache = createEmotionCache()

const darkTheme: Theme = createTheme(darkThemeOptions)

const MyApp: FunctionComponent<MyAppProps> = (props: PropsWithChildren<MyAppProps>) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: {
      initialSession,
      ...pageProps
    },
  } = props

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    if (isMounted) return
    setIsMounted(true)

    TimeAgo.addLocale(en)
  }, [isMounted])

  const isAccessible = useAppStore(state => state.isAccessible)
  const toggleAccessibility = useAppStore(state => state.toggleAccessibility)
  useEffect(() => {
    if (isAccessible) {
      document.body.classList.add('accessible')
    } else {
      document.body.classList.remove('accessible')
    }
  }, [isAccessible])

  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  // when the selectedTeamID changes, update the selectedTeam
  const selectedTeamID = useAppStore(state => state.selectedTeamID)
  const setSelectedTeam = useAppStore(state => state.setSelectedTeam)
  useEffect(() => {
    if (supabaseClient === null) return

    if (selectedTeamID === '') {
      setSelectedTeam(null)
    } else {
      supabaseClient
        .from('teams')
        .select('*')
        .eq('id', selectedTeamID)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error(error)
          } else {
            setSelectedTeam(data)
          }
        })
    }
  }, [selectedTeamID, setSelectedTeam, supabaseClient])

  return <CacheProvider value={emotionCache}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />

      <SnackbarProvider>
        {supabaseClient === null ? <Loader /> : <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={initialSession}
        >
          <AppBar />

          {Component.auth ? <AuthWrapper>
            <Component {...pageProps} />
          </AuthWrapper> : (
            <Component {...pageProps} />
          )}
        </SessionContextProvider>}
      </SnackbarProvider>

      <IconButton
        color="inherit"
        onClick={toggleAccessibility}
        sx={{
          bottom:    '0.75em',
          cursor:    'pointer',
          fontSize:  '2em',
          right:     '0.75em',
          position:  'absolute',
          textAlign: 'right',
          zIndex:    100,
        }}
        tabIndex={0}
      >
        {!isAccessible ? <AccessibilityNewIcon fontSize='inherit' /> :
          <AccessibleForwardIcon fontSize='inherit' />}
      </IconButton>
    </ThemeProvider>
  </CacheProvider>
}

export default MyApp
