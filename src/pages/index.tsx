
import Box from '@mui/material/Box'
import type { SxProps } from '@mui/system'
import CornerAccents from 'components/branding/CornerAccents'
import TypedText from 'components/branding/TypedText'
import Link from 'components/mui/Link'
import type { NextPage } from 'next'
import Head from 'next/head'

const styles: { [key: string]: SxProps } = {
  container: {
    alignItems:     'center',
    display:        'flex',
    flexDirection:  'column',
    gap:            10,
    justifyContent: 'center',
    minHeight:      '100vh',
    textAlign:      'center',
    userSelect:     'none',
  },
  titleBox: {
    display:  'inline-block',
    position: 'relative',
    width:    'auto',
  },
  titleText: {
    border:     '12px solid #F00',
    color:      '#F00',
    fontSize:   'clamp(1.5rem, 8vw, 7.5rem)',
    fontWeight: 'bold',
    lineHeight: 0.8,
    padding:    '0.5rem 0.5rem',
    textShadow: '0 0 2px black',
    transform:  'perspective(300px) rotateX(10deg)',
    'span':     {
      letterSpacing: '0.75rem',
      paddingLeft:   '0.4rem',
    },
  },
  linksBox: {
    display:       'flex',
    flexDirection: 'column',
    fontFamily:    'VT323, monospace',
    fontSize:      'clamp(1rem, 5vw, 2rem)',
    gap:           4,
    lineHeight:    1,
    marginRight:   '40vw',
    minHeight:     'clamp(10rem, 25vh, 20rem)',
    minWidth:      'clamp(20rem, 40vw, 60rem)',
    textAlign:     'left',
    letterSpacing: '0.1rem',
    wordSpacing:   '0.2rem',
    '& > *':       {
      padding: '0.25rem 0',
    },
    '& > *:hover': {
      background: 'var(--accent)',
      color:      '#440000',
      cursor:     'pointer',
    },
  },
}

const linkItems = [
  {
    href:  'https://store.steampowered.com/app/1966720/Lethal_Company/',
    label: '> Lethal Company (video game) [Steam]',
  },
  {
    href:  'https://github.com/LethalCompany/LethalCompanyTemplate',
    label: '> Mod Repository Template [GitHub]',
  },
  {
    href:  '',
    label: '> Unofficial Community [Discord]',
  },
]

const Home: NextPage = (): JSX.Element => {
  return <>
    <Head>
      <title>Your Source for Lethal Company Modding Resources</title>
    </Head>

    <CornerAccents />

    <Box sx={styles.container}>
      <Box sx={styles.titleBox}>
        <Box sx={styles.titleText}>
          <span>LETHAL</span><br />MODDING
        </Box>
      </Box>

      <Box sx={styles.linksBox}>
        {linkItems.map((item, index) => (
          <Link color="inherit" href={item.href} key={index} underline="none">
            <TypedText
              finalText={item.label}
              startDelay={index * 1000}
              typingSpeed={25}
            />
          </Link>
        ))}
      </Box>
    </Box>
  </>
}

export default Home
