import Box from '@mui/material/Box'

export default function CornerAccents(): JSX.Element {
  const longDimension = 'clamp(0.5rem, 5vw, 8rem)'
  const shortDimension = 'clamp(0.5rem, 0.75vw, 4rem)'

  return <>
    <Box
      sx={{
        background: 'var(--accent)',
        height:     longDimension,
        position:   'absolute',
        left:       '1rem',
        top:        'calc(1rem + 56px)',
        width:      shortDimension,
        opacity:    0.2,
        zIndex:     2,
      }}
    />
    <Box
      sx={{
        background: 'var(--accent)',
        height:     shortDimension,
        position:   'absolute',
        left:       '1.75rem',
        top:        'calc(1rem + 56px)',
        width:      longDimension,
        opacity:    0.2,
        zIndex:     2,
      }}
    />

    <Box
      sx={{
        background: 'var(--accent)',
        height:     longDimension,
        position:   'absolute',
        right:      '1rem',
        top:        'calc(1rem + 56px)',
        width:      shortDimension,
        opacity:    0.2,
        zIndex:     2,
      }}
    />
    <Box
      sx={{
        background: 'var(--accent)',
        height:     shortDimension,
        position:   'absolute',
        right:      '1.75rem',
        top:        'calc(1rem + 56px)',
        width:      longDimension,
        opacity:    0.2,
        zIndex:     2,
      }}
    />

    <Box
      sx={{
        background: 'var(--accent)',
        height:     longDimension,
        position:   'absolute',
        left:       '1rem',
        bottom:     '1rem',
        width:      shortDimension,
        opacity:    0.2,
        zIndex:     2,
      }}
    />
    <Box
      sx={{
        background: 'var(--accent)',
        height:     shortDimension,
        position:   'absolute',
        left:       '1.75rem',
        bottom:     '1rem',
        width:      longDimension,
        opacity:    0.2,
        zIndex:     2,
      }}
    />

    <Box
      sx={{
        background: 'var(--accent)',
        height:     longDimension,
        position:   'absolute',
        right:      '1rem',
        bottom:     '1rem',
        width:      shortDimension,
        opacity:    0.2,
        zIndex:     2,
      }}
    />
    <Box
      sx={{
        background: 'var(--accent)',
        height:     shortDimension,
        position:   'absolute',
        right:      '1.75rem',
        bottom:     '1rem',
        width:      longDimension,
        opacity:    0.2,
        zIndex:     2,
      }}
    />
  </>
}
