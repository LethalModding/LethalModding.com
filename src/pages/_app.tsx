import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/utils'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import { ThemeProvider } from '@mui/material/styles'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import type { FunctionComponent, PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { AppBar } from '@/components/_shared/AppBar.tsx'
import { SupabaseProvider } from '@/components/_shared/auth/Supabase.tsx'
import { useAppStore } from '@/store.ts'
import { darkTheme } from '@/styles/darkThemeOptions.ts'
import { useSupabaseClient } from '@/utility/supabase.ts'
import '@/styles/globals.css'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { createEmotionCache } from '@/utility/createEmotionCache.ts'

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache
}

const clientSideEmotionCache: EmotionCache = createEmotionCache()

/** Loads the team row whenever the selected team changes. */
function SelectedTeamLoader(): null {
  const supabase = useSupabaseClient()
  const selectedTeamID = useAppStore((state) => state.selectedTeamID)
  const setSelectedTeam = useAppStore((state) => state.setSelectedTeam)
  useEffect(() => {
    if (selectedTeamID === '' || selectedTeamID === 'create') {
      setSelectedTeam(null)
      return
    }

    supabase
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
  }, [selectedTeamID, setSelectedTeam, supabase])

  return null
}

const MyApp: FunctionComponent<MyAppProps> = (props: PropsWithChildren<MyAppProps>) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

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

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline enableColorScheme={true} />

        <SnackbarProvider>
          <SupabaseProvider>
            <SelectedTeamLoader />
            <AppBar />

            <Component {...pageProps} />
          </SupabaseProvider>
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
