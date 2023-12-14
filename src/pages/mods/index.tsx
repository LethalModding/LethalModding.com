import ComputerIcon from '@mui/icons-material/Computer'
import DownloadIcon from '@mui/icons-material/Download'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import StorageIcon from '@mui/icons-material/Storage'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CornerAccents from 'components/branding/CornerAccents'
import TypedText from 'components/branding/TypedText'
import Link from 'components/mui/Link'
import type { NextPage } from 'next'
import Head from 'next/head'
import useGlobalStyles from 'styles/globalStyles'
// import ShareIcon from '@mui/icons-material/Share'

const externalLinks = [
  {
    href:  'https://thunderstore.io/c/lethal-company/',
    label: '> Find More Mods on Thunderstore',
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

const recommendedMods = [
  {
    id:             'notnotnotswipez-MoreCompany-1.7.1',
    description:    'Allows you to play with up to 32 players in a single game.',
    vanillaBreaker: false,
  },
  {
    id:             'x753-More_Suits-1.3.3',
    description:    'Adds 6+ new suits to the suit rack in the ship.',
    vanillaBreaker: false,
  },
  {
    id:             'TeamClark-SCP_Foundation_Suit-1.0.1',
    description:    'Adds the SCP Foundation Guard suit to the suit rack in the ship.',
    vanillaBreaker: false,
  },
  {
    id:             'Sligili-More_Emotes-1.1.2',
    description:    'Adds 5+ emotes, use keys 3-6 to middle finger, golf clap, or gritty.',
    vanillaBreaker: false,
  },
  {
    id:             'malco-Lategame_Upgrades-2.5.1',
    description:    'Adds 10+ late-game upgrades to give you something to work towards.',
    vanillaBreaker: true,
  },
  {
    id:             'Verity-TooManySuits-1.0.3',
    description:    'Adds a pager to the suit rack, allowing you to have more than 10 suits. (Default: N / B)',
    vanillaBreaker: false,
  },
  {
    id:             'taffyko-NameplateTweaks-1.0.2',
    description:    'Shows a speaking icon above the name of the people who are speaking.',
    onlyClient:     true,
    vanillaBreaker: false,
  },
  {
    id:             'Hexnet111-SuitSaver-1.0.3',
    description:    'Saves and automatically re-selects your previously used suit.',
    onlyClient:     true,
    vanillaBreaker: false,
  },
  {
    id:             'RickArg-Helmet_Cameras-2.1.3',
    description:    'Adds a remote first-person view of your teammate beside the radar screen.',
    onlyClient:     true,
    vanillaBreaker: false,
  },
  {
    id:             'PopleZoo-BetterItemScan-2.0.3',
    description:    'Improves the item scanner to have a better UI and faster calculation.',
    onlyClient:     true,
    vanillaBreaker: false,
  },
  {
    id:             'tinyhoot-ShipLoot-1.0.0',
    description:    'Gives a cumulative total of all the loot you\'ve brought to the ship.',
    onlyClient:     true,
    vanillaBreaker: false,
  },
  {
    id:             'Renegades-FlashlightToggle-1.3.1',
    description:    'Adds a keybind to toggle your flashlight on and off. (Default: F)',
    onlyClient:     true,
    vanillaBreaker: false,
  },
  {
    id:             'Renegades-WalkieUse-1.2.3',
    description:    'Adds a keybind to use your equipped walkie-talkie. (Default: R)',
    onlyClient:     true,
    vanillaBreaker: false,
  },
  {
    id:             'FlipMods-LetMeLookDown-1.0.1',
    description:    'Allows you to look down, because by default, you can\'t. Weird.',
    onlyClient:     true,
    vanillaBreaker: false,
  },
  {
    id:             'Drakorle-MoreItems-1.0.1',
    description:    'Allows you to have unlimited items in your ship without de-spawning them.',
    onlyServer:     true,
    vanillaBreaker: false,
  },
  {
    id:             'tinyhoot-ShipLobby-1.0.2',
    description:    'Allows people to join your ship any time that you\'re in orbit, not just when starting.',
    onlyServer:     true,
    vanillaBreaker: false,
  },
  {
    id:             'Nips-Brutal_Company_Plus-3.2.0',
    description:    'Adds a lot of variety in the form of random landing events, moon heat, and more.',
    onlyServer:     true,
    vanillaBreaker: false,
  },
  {
    id:             'anormaltwig-TerminalExtras-1.0.1',
    description:    'Adds extra commands to the terminal, such as toggling the door, teleporter, or lightswitch.',
    vanillaBreaker: true,
  },
  {
    id:             'Evaisa-LethalThings-0.7.1',
    description:    'Adds a LOT, including a rocket launcher and personal teleporter.',
    vanillaBreaker: true,
  },
  {
    id:             'FlipMods-BetterStamina-1.2.1',
    description:    'Reworks the stamina system entirely. Configurable sprint duration, regeneration, and weight penalties.',
    vanillaBreaker: false,
  },
  {
    id:             'egeadam-MoreScreams-1.0.2',
    description:    'Allows you to hear your teammates scream while they die. (Default: 2 seconds)',
    vanillaBreaker: false,
  },
  {
    id:             'Bibendi-AEIOUCompany-1.2.0',
    description:    'Adds moon base alpha text-to-speech to the game. Also increases chat length to 1023.',
    onlyClient:     true,
    vanillaBreaker: false,
  }
]

const ModsHome: NextPage = (): JSX.Element => {
  const globalStyles = useGlobalStyles()

  return <>
    <Head>
      <title>Your Source for Lethal Company Mods</title>
    </Head>

    <CornerAccents />

    <Box
      sx={{
        ...globalStyles.container,
        height:         '100vh',
        justifyContent: 'stretch',
        overflowX:      'hidden',
        overflowY:      'auto',

        '&::-webkit-scrollbar': {
          width:  '0.25em',
          height: '0.25em',
        },

        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--accent)',
        },
      }}
    >
      <Box sx={globalStyles.linksBox}>
        <Box className="column" sx={{ my: 4 }}>
          <Typography variant='h2'>
            <TypedText
              finalText="# Mods"
              startDelay={0}
              typingSpeed={17}
            />
          </Typography>

          <Typography sx={{ mb: 2 }} variant="body2">
            <TypedText
              finalText="Soon LethalModding will be your source for Lethal Company mods. In the meantime, check out the external links below for more mods. If you're interested in making your own mods, check out the template repository."
              startDelay={300}
              typingSpeed={5}
            />
          </Typography>

          <Typography variant="h3">
            <TypedText
              finalText="Recommended Mods"
              startDelay={1800}
              typingSpeed={17}
            />
          </Typography>

          {recommendedMods.map((item, index) => {
            const parts = item.id.split('-')
            const creator = parts[0]
            const version = parts[parts.length - 1]
            const name = parts.slice(1, parts.length - 1).join('-')

            // const imageURL = `https://gcdn.thunderstore.io/live/repository/icons/${item.id}.png.128x128_q95.png`

            const downloadURL = `https://thunderstore.io/package/download/${creator}/${name}/${version}/`

            return <Box
              key={index}
            >
              {/* <Image
                alt={'icon'}
                src={imageURL}
                height={128}
                width={128}
              /> */}

              <Box
                sx={{
                  display:       'flex',
                  flexDirection: 'row',
                  gap:           '0.5em',
                }}
              >
                <Box>
                  <TypedText
                    finalText={`${creator}/${name} v${version}`}
                    startDelay={index * 200 + 2200}
                    typingSpeed={2}
                  />
                </Box>
                {item.vanillaBreaker && <Box>
                  <LinkOffIcon />
                  <TypedText
                    finalText='(Vanilla Breaker)'
                    startDelay={index * 200 + 2200 + 100}
                    typingSpeed={1}
                  /></Box>}
                {item.onlyClient && <Box>
                  <ComputerIcon />
                  <TypedText
                    finalText='(Client-Only)'
                    startDelay={index * 200 + 2200 + 100}
                    typingSpeed={1}
                  /></Box>}
                {item.onlyServer && <Box>
                  <StorageIcon />
                  <TypedText
                    finalText='(Server-Only)'
                    startDelay={index * 200 + 2200 + 100}
                    typingSpeed={1}
                  /></Box>}
              </Box>

              <Box
                sx={{
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           '0.1em',
                  mx:            '2em',
                  mt:            '0.25em',
                  mb:            '0.5em',
                }}
              >
                <Box>
                  <TypedText
                    finalText={`${item.description}`}
                    startDelay={index * 200 + 2200 + 100}
                    typingSpeed={1}
                  />
                </Box>

                <Box>
                  <Link
                    color="inherit"
                    href={`https://thunderstore.io/c/lethal-company/p/${creator}/${name}/`}
                    target="_blank"
                    underline="none"
                  >
                    &gt; <OpenInNewIcon />
                    <TypedText
                      finalText={'View on Thunderstore'}
                      startDelay={index * 200 + 2200 + 100}
                      typingSpeed={1}
                    />
                  </Link>
                </Box>

                <Box>
                  <Link
                    color="inherit"
                    href={downloadURL}
                    target="_blank"
                    underline="none"
                  >
                    &gt; <DownloadIcon color="inherit" />
                    <TypedText
                      finalText={'Download'}
                      startDelay={index * 200 + 2200 + 100}
                      typingSpeed={1}
                    />
                  </Link>
                </Box>
              </Box>
            </Box>
          })}

          <Typography variant="h3">
            <TypedText
              finalText="External"
              startDelay={2000 + recommendedMods.length * 200}
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
            <OpenInNewIcon />
            <TypedText
              finalText={item.label}
              startDelay={index * 500 + recommendedMods.length * 200 + 2200}
              typingSpeed={17}
            />
          </Link>)}
        </Box>
      </Box>
    </Box>
  </>
}

export default ModsHome
