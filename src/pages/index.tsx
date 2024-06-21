import Box from '@mui/material/Box'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import CornerAccents from 'components/branding/CornerAccents'
import MOTD from 'components/branding/MOTD'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ofetch } from 'ofetch'
import { useEffect } from 'react'
import useGlobalStyles from 'styles/globalStyles'

const Home: NextPage = (): JSX.Element => {
  const globalStyles = useGlobalStyles()

  const router = useRouter()
  const supabase = useSupabaseClient()
  // get session from fragment #access_token=...&expires_in=...&token_type=...
  useEffect(() => {
    const hash = (router.asPath as string).split('#')[1] // error=unauthorized_client&error_code=401error_description=Something+went+wrong
    const parsedHash = new URLSearchParams(hash)

    const errorHash = parsedHash.get('error_description') // Something went wrong
    if (errorHash !== null) {
      console.log('errorHash', errorHash)
      return
    }

    const access_token = parsedHash.get('access_token')
    const refresh_token = parsedHash.get('refresh_token')

    // enforce certain query params
    if (!access_token || !refresh_token) return

    supabase.auth.setSession({
      access_token:  access_token,
      refresh_token: refresh_token,
    })
    router.replace('/')
  }, [router, supabase])

  const session = useSession()
  useEffect(() =>
  {
    if (!session) return

    // Send our session to the local client (if it's running)
    // Assume this will fail (most people don't have the client)
    try
    {
      ofetch('http://localhost:25792/connect', {
        body: {
          access_token:  session.access_token,
          refresh_token: session.refresh_token,
        },
        cache:  'no-cache',
        method: 'POST',
      })
    } catch (e) {
      console.log('Can\'t talk to Concrete:', e)
    }
  }, [session])

  return <>
    <Head>
      <title>Your Source for Lethal Company Modding Resources</title>
    </Head>

    <CornerAccents />

    <Box sx={globalStyles.container}>
      <Box sx={{ display: 'grid' }}>
        <MOTD />
      </Box>
    </Box>
  </>
}

export default Home
