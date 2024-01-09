import Box from '@mui/material/Box'
import CornerAccents from 'components/branding/CornerAccents'
import MOTD from 'components/branding/MOTD'
import type { NextPage } from 'next'
import Head from 'next/head'
import useGlobalStyles from 'styles/globalStyles'

const Home: NextPage = (): JSX.Element => {
  const globalStyles = useGlobalStyles()

  return <>
    <Head>
      <title>Your Source for Lethal Company Modding Resources</title>
    </Head>

    <CornerAccents />

    <Box
      sx={{
        ...globalStyles.container,
        display:    'grid',
        placeItems: 'center',
      }}
    >
      <Box sx={{ display: 'grid' }}>
        <MOTD />
      </Box>
    </Box>
  </>
}

export default Home
