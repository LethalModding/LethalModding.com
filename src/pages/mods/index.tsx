import AccountCircle from '@mui/icons-material/AccountCircle'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/Help'
import ImportIcon from '@mui/icons-material/ImportExport'
import PlayIcon from '@mui/icons-material/PlayArrow'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ModListItem from 'components/mods/ModListItem'
import ProfileListItem from 'components/mods/ProfileListItem'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { type Profile } from 'types/Profile'

const allProfiles = [
  {
    id:    '10',
    mods:  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    name:  'Bug Fix Pack',
    owner: '',
  },
  {
    id:    '20',
    mods:  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    name:  'LethalModding.com Official Pack',
    owner: 'LethalModding.com',
  },
  {
    id:    '30',
    mods:  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    name:  'Default',
    owner: '',
  },
]

const ModsHome: NextPage = (): JSX.Element => {
  const [selectedProfile, setSelectedProfile] = useState<Profile>(allProfiles[0])

  return <>
    <Head>
      <title>Your Source for Lethal Company Mods</title>
    </Head>

    <AppBar
      elevation={4}
      position="static"
      sx={{
        alignItems:    'center',
        display:       'flex',
        flexDirection: 'row',
        gap:           2,
        height:        56,
        px:            1.5,
      }}
    >
      <Image
        alt="LethalModding.com logo"
        height={48}
        src="/icons/favicon.ico"
        width={48}
      />

      <Box
        sx={{
          display:       'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          color="text.secondary"
          component="h1"
          variant="subtitle1"
        >
          LethalModding.com
        </Typography>
      </Box>

      <InputBase
        color="primary"
        endAdornment={<IconButton>
          <SearchIcon />
        </IconButton>}
        sx={{ flex: 1, mx: 1 }}
        placeholder="Search online for mods or profiles..."
      />

      <Button
        color="primary"
        size="small"
        variant="outlined"
      >
        <AccountCircle sx={{ mr: 1 }} />
        Login
      </Button>
    </AppBar>

    <Box
      sx={{
        display:             'grid',
        gridTemplateColumns: '300px 1fr',

        '& > *': {
          borderRadius:  0,
          display:       'flex',
          flexDirection: 'column',
          height:        'calc(100vh - 56px)',
          overflow:      'hidden',
        }
      }}
    >
      <Paper elevation={1}>
        <Box
          sx={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 1.5,
            height:              48,
            m:                   1,
            ml:                  1.5,
          }}
        >
          <Button
            color="primary"
            fullWidth
            variant="outlined"
          >
            <AddIcon /> New
          </Button>
          <Button
            color="primary"
            fullWidth
            variant="outlined"
          >
            <ImportIcon /> Import
          </Button>
        </Box>

        <Box
          sx={{
            display:       'flex',
            flexDirection: 'column',
            mb:            'auto',
          }}
        >
          {allProfiles.map((profile) => <ProfileListItem
            key={profile.id}
            onSelect={setSelectedProfile}
            profile={profile}
          />)}
        </Box>

        <Box
          sx={{
            display:       'flex',
            flexDirection: 'row',
            gap:           1.5,
            height:        48,
            m:             1,
            ml:            1.5,
            mr:            1,
          }}
        >
          <Button
            color="primary"
            fullWidth
            variant="outlined"
          >
            <HelpIcon fontSize="inherit" sx={{ mr: 1 }} />
            Get Help
          </Button>
          <Button
            color="primary"
            fullWidth
            variant="outlined"
          >
            <SettingsIcon fontSize="inherit" sx={{ mr: 1 }} />
            Settings
          </Button>
        </Box>

        <Button
          fullWidth
          sx={{ height: 56 }}
          variant="contained"
        >
          <PlayIcon />
          Launch {selectedProfile.name}
        </Button>
      </Paper>

      <Box
        sx={{
          display:       'flex',
          flex:          4,
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flexDirection: 'column',
            overflowX:     'hidden',
            overflowY:     'auto',

            '&::-webkit-scrollbar': {
              width:  '0.25em',
              height: '0.25em',
            },

            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'var(--accent)',
            },
        
            '& > *': {
              backgroundColor: 'background.paper',
              gap:             2.25,
            },
          }}
        >
          <ModListItem
            id="1"
            name="Radar Ident QuickSwitch"
            owner="LethalModding.com"
            summary="Some long description about the mod. This could go on for quite a while, so we should be sure to cap it somewhere, so nobody pulls a Thunderstore and puts all Hs in their summary, screwing up the site for everyone involved."
            verified={true}
          />
          <ModListItem
            id="2"
            name="LethalThings"
            owner="EvaisaDev"
            summary="Short summary is short."
            verified={true}
          />
          <ModListItem
            id="3"
            name="Lategame_Upgrades"
            owner="I FORGOR"
            summary="No summary."
          />
          <ModListItem
            id="4"
            name="LethalThings"
            owner="EvaisaDev"
            summary="Short summary is short."
          />
          <ModListItem
            id="5"
            name="Lategame_Upgrades"
            owner="I FORGOR"
            summary="No summary."
          />
          <ModListItem
            id="6"
            name="LethalThings"
            owner="EvaisaDev"
            summary="Short summary is short."
          />
          <ModListItem
            id="7"
            name="Lategame_Upgrades"
            owner="I FORGOR"
            summary="No summary."
          />
          <ModListItem
            id="8"
            name="LethalThings"
            owner="EvaisaDev"
            summary="Short summary is short."
          />
          <ModListItem
            id="9"
            name="Lategame_Upgrades"
            owner="I FORGOR"
            summary="No summary."
          />
          <ModListItem
            id="10"
            name="LethalThings"
            owner="EvaisaDev"
            summary="Short summary is short."
          />
        </Box>
      </Box>
    </Box>
  </>
}

export default ModsHome
