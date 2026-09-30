import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { JSX } from 'react'
import { Link } from '@/components/mui/Link.tsx'
import { useGlobalStyles } from '@/styles/globalStyles.ts'
import { TypedText } from './TypedText.tsx'

const MOTD_TYPING_SPEED = 17
const LINK_STAGGER_MS = 800
const INTERNAL_LINK_BASE_DELAY_MS = 400
const EXTERNAL_LINK_BASE_DELAY_MS = 600
const EXTERNAL_HEADING_DELAY_MS = 200

const styles = {
  titleBox: {
    color: '#fc0000',
    display: 'inline-block',
    fontSize: 'clamp(1rem, 6vw, 3rem)',
    lineHeight: '0.8',
    mx: 'auto',
    textShadow: '4px 0 4px',
  },

  titleText: {
    border: '10px solid #fc0000',
    fontFamily: 'sans-serif',
    padding: '0.5rem 1rem',
    paddingTop: '1rem',
    transform: 'perspective(300px) rotateX(15deg)',
    span: {
      letterSpacing: '0.08em',
      paddingLeft: '0.3em',
    },
  },
}

const externalLinks = [
  {
    href: 'https://store.steampowered.com/app/1966720/Lethal_Company/',
    label: '> Buy Lethal Company on Steam',
  },
  {
    href: 'https://github.com/LethalCompany/LethalCompanyTemplate',
    label: '> Clone the Template Repository',
  },
  {
    href: 'https://discord.gg/XeyYqRdRGC',
    label: '> Join the Modding Discord',
  },
]

const internalLinks = [
  {
    href: '/team',
    label: '> LethalModding (WIP)',
  },
  {
    href: '/tools',
    label: '> Thunderstore Search',
  },
]

export function MOTD(): JSX.Element {
  const globalStyles = useGlobalStyles()

  return (
    <>
      <Box sx={styles.titleBox}>
        <Box component="h1" sx={styles.titleText}>
          <span>LETHAL</span>
          <br />
          MODDING
        </Box>
      </Box>

      <Box sx={globalStyles.linksBox}>
        <Box className="column">
          <Typography variant="h3">
            <TypedText finalText="Internal" startDelay={0} typingSpeed={MOTD_TYPING_SPEED} />
          </Typography>
          {internalLinks.map((item, index) => (
            <Link color="inherit" href={item.href} key={item.href} underline="none">
              <TypedText
                finalText={item.label}
                startDelay={index * LINK_STAGGER_MS + INTERNAL_LINK_BASE_DELAY_MS}
                typingSpeed={MOTD_TYPING_SPEED}
              />
            </Link>
          ))}
        </Box>

        <Box className="column">
          <Typography variant="h3">
            <TypedText
              finalText="External"
              startDelay={EXTERNAL_HEADING_DELAY_MS}
              typingSpeed={MOTD_TYPING_SPEED}
            />
          </Typography>
          {externalLinks.map((item, index) => (
            <Link color="inherit" href={item.href} key={item.href} target="_blank" underline="none">
              <TypedText
                finalText={item.label}
                startDelay={index * LINK_STAGGER_MS + EXTERNAL_LINK_BASE_DELAY_MS}
                typingSpeed={MOTD_TYPING_SPEED}
              />
            </Link>
          ))}
        </Box>
      </Box>
    </>
  )
}
