import MuiLink, { type LinkProps } from '@mui/material/Link'
import NextLink from 'next/link'
import type { Ref } from 'react'

export const Link = ({ ref, ...props }: LinkProps & { ref?: Ref<HTMLAnchorElement> }) => (
  <NextLink href={props.href ?? '#'} legacyBehavior={true} passHref={true}>
    <MuiLink ref={ref} {...props} />
  </NextLink>
)
