import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import type { JSX } from 'react'
import { Link } from '@/components/mui/Link.tsx'
import type { Mod } from '@/types/Mod.ts'

export function ModGrid({ mods }: { mods: Mod[] }): JSX.Element {
  return (
    <Box
      sx={{
        display: 'grid',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        gridTemplateColumns: 'repeat(auto-fill, minmax(calc(192px + 32px), 1fr))',
        gap: 1,
        my: 2,

        '& > *': {
          backgroundColor: 'var(--background)',
          borderRadius: 0.2,
          p: 2,
          width: 'calc(192px + 32px)',

          '&:hover': {
            backgroundColor: 'var(--accent)',
          },

          '.MuiTypography-root': {
            // overflow with ellipsis
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },

          '.MuiTypography-body2': {
            color: 'white',
            fontSize: '0.8em',
            pt: 1,
          },
        },
      }}
    >
      {mods.map((x) => {
        // filterMods drops a mod with no versions, so this is a type guard, not a case.
        const version = x.versions[0]
        if (version === undefined) {
          return null
        }
        return (
          <Link
            href={x.package_url}
            key={x.uuid4}
            sx={{
              color: 'inherit',
              display: 'block',
              textDecoration: 'none',
            }}
            target="_blank"
          >
            {/* Unoptimized so the browser fetches each icon from ccdn itself: the optimizer
                fetches them all from the server's one IP and Thunderstore rate-limits the burst. */}
            <Image
              alt={x.name}
              height={192}
              loading="lazy"
              src={version.icon}
              unoptimized={true}
              width={192}
            />
            <Typography variant="body2">{x.owner}</Typography>
            <Typography variant="body1">{x.name}</Typography>
          </Link>
        )
      })}
    </Box>
  )
}
