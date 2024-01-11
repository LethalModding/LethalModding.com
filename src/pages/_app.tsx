import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/utils'
import CssBaseline from '@mui/material/CssBaseline'
import type { Theme } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import ThemeProvider from '@mui/system/ThemeProvider'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import type { FunctionComponent, PropsWithChildren } from 'react'
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

  return <CacheProvider value={emotionCache}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </CacheProvider>
}

export default MyApp
