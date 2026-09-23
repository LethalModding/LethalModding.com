import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/utils'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import { ThemeProvider } from '@mui/material/styles'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import type { FunctionComponent, PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { AppBar } from '@/components/_shared/AppBar.tsx'
import { Loader } from '@/components/_shared/Loader.tsx'
import { useAppStore } from '@/store.ts'
import { darkTheme } from '@/styles/darkThemeOptions.ts'
import '@/styles/globals.css'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { createEmotionCache } from '@/utility/createEmotionCache.ts'

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache
}

const clientSideEmotionCache: EmotionCache = createEmotionCache()

const MyApp: FunctionComponent<MyAppProps> = (props: PropsWithChildren<MyAppProps>) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { initialSession, ...pageProps },
  } = props

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    if (isMounted) {
      return
    }
    setIsMounted(true)

    TimeAgo.addLocale(en)
  }, [isMounted])

  const isAccessible = useAppStore((state) => state.isAccessible)
  const toggleAccessibility = useAppStore((state) => state.toggleAccessibility)
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
  const selectedTeamID = useAppStore((state) => state.selectedTeamID)
  const setSelectedTeam = useAppStore((state) => state.setSelectedTeam)
  useEffect(() => {
    if (selectedTeamID === '' || selectedTeamID === 'create') {
      setSelectedTeam(null)
      return
    }

    if (supabaseClient === null) {
      return
    }

    supabaseClient
      .from('teams')
      .select('*')
      .eq('id', selectedTeamID)
      .single()
      .then(({ data, error }) => {
        if (error) {
          enqueueSnackbar(`Unable to load team: ${error.message}`, {
            variant: 'error',
          })
        } else {
          setSelectedTeam(data)
        }
      })
  }, [selectedTeamID, setSelectedTeam, supabaseClient])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline enableColorScheme={true} />

        <SnackbarProvider>
          {supabaseClient === null ? (
            <Loader />
          ) : (
            <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
              <AppBar />

              <Component {...pageProps} />
            </SessionContextProvider>
          )}
        </SnackbarProvider>

        <IconButton
          color="inherit"
          onClick={toggleAccessibility}
          sx={{
            bottom: '0.75em',
            cursor: 'pointer',
            fontSize: '2em',
            right: '0.75em',
            position: 'absolute',
            textAlign: 'right',
            zIndex: 100,
          }}
          tabIndex={0}
        >
          {isAccessible ? (
            <AccessibleForwardIcon fontSize="inherit" />
          ) : (
            <AccessibilityNewIcon fontSize="inherit" />
          )}
        </IconButton>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
