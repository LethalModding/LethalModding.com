import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'components/mui/Link'
import useGlobalStyles from 'styles/globalStyles'
import TypedText from './TypedText'

const styles = {
  titleBox: {
    color:      '#fc0000',
    display:    'inline-block',
    fontSize:   'clamp(1rem, 6vw, 3rem)',
    lineHeight: '0.8',
    mx:         'auto',
    textShadow: '4px 0 4px',
  },

  titleText: {
    border:     '10px solid #fc0000',
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
    href:  'https://discord.gg/XeyYqRdRGC',
    label: '> Join the Modding Discord',
  },
]

const internalLinks = [
  {
    href:  '/team',
    label: '> LethalModding (WIP)',
  },
  {
    href:  '/tools',
    label: '> Thunderstore Search',
  },
]

export default function MOTD(): JSX.Element {
  const globalStyles = useGlobalStyles()

  return <>
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
  </>
}
