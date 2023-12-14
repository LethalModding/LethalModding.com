import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CornerAccents from 'components/branding/CornerAccents'
import TypedText from 'components/branding/TypedText'
import Link from 'components/mui/Link'
import type { NextPage } from 'next'
import Head from 'next/head'
import useGlobalStyles from 'styles/globalStyles'

const styles = {
  titleBox: {
    color:      '#E00',
    display:    'inline-block',
    fontSize:   'clamp(1rem, 7vw, 4rem)',
    lineHeight: '0.8',
    mx:         'auto',
    textShadow: '4px 0 4px white',
  },

  titleText: {
    border:     '10px solid #E00',
    fontFamily: 'sans-serif',
    padding:    '0.5rem 1rem',
    paddingTop: '1rem',
    transform:  'perspective(300px) rotateX(15deg)',
    'span':     {
      letterSpacing: '0.08em',
      paddingLeft:   '0.3em',
    },
  },
}

const externalLinks = [
  {
    href:  'https://store.steampowered.com/app/1966720/Lethal_Company/',
    label: '> Buy Lethal Company on Steam',
  },
  {
    href:  'https://github.com/LethalCompany/LethalCompanyTemplate',
    label: '> Clone the Template Repository',
  },
  {
    href:  'https://discord.gg/nYcQFEpXfU',
    label: '> Join the Unofficial Discord',
  },
]

const internalLinks = [
  {
    href:  '/mods',
    label: '> Find Mods',
  },
  {
    href:  '/guides',
    label: '> Read Guides',
  },
  {
    href:  '/tools',
    label: '> Use Tools',
  },
]

const Home: NextPage = (): JSX.Element => {
  const globalStyles = useGlobalStyles()

  return <>
    <Head>
      <title>Your Source for Lethal Company Modding Resources</title>
    </Head>

    <CornerAccents />

    <Box sx={{
      ...globalStyles.container,
      display:    'grid',
      placeItems: 'center',
    }}
    >
      <Box sx={{ display: 'grid' }}>
        <Box sx={styles.titleBox}>
          <Box component="h1" sx={styles.titleText}>
            <span>LETHAL</span><br />MODDING
          </Box>
        </Box>

        <Box sx={globalStyles.linksBox}>
          <Box className="column">
            <Typography variant="h3">
              <TypedText
                finalText="Internal"
                startDelay={0}
                typingSpeed={17}
              />
            </Typography>
            {internalLinks.map((item, index) => <Link
              color="inherit"
              href={item.href}
              key={index}
              underline="none"
            >
              <TypedText
                finalText={item.label}
                startDelay={index * 800 + 400}
                typingSpeed={17}
              />
            </Link>)}
          </Box>

          <Box className="column">
            <Typography variant="h3">
              <TypedText
                finalText="External"
                startDelay={200}
                typingSpeed={17}
              />
            </Typography>
            {externalLinks.map((item, index) => <Link
              color="inherit"
              href={item.href}
              key={index}
              target="_blank"
              underline="none"
            >
              <TypedText
                finalText={item.label}
                startDelay={index * 800 + 600}
                typingSpeed={17}
              />
            </Link>)}
          </Box>
        </Box>
      </Box>
    </Box>
  </>
}

export default Home
