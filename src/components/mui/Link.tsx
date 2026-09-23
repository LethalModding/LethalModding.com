import MuiLink, { type LinkProps } from '@mui/material/Link'
import NextLink from 'next/link'
import type { Ref } from 'react'

export const Link = ({ ref, href, ...props }: LinkProps & { ref?: Ref<HTMLAnchorElement> }) => (
  <MuiLink component={NextLink} href={href ?? '#'} ref={ref} {...props} />
)
