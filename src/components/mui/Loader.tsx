import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

type Props = {
  fontSize?: string
  size?: 'default' | 'large'
}

export default function Loader(props: Props): JSX.Element {
  const {
    fontSize,
    size
  } = props

  const computedFontSize = fontSize
    ? fontSize
    : size === 'large'
      ? '10rem'
      : undefined

  return <Box sx={{ my: size === 'large' ? 18 : 6 }}>
    <Box
      sx={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={computedFontSize} />
    </Box>
  </Box>
}
