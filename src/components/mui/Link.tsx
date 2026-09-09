import MuiLink, { type LinkProps } from "@mui/material/Link";
import NextLink from "next/link";
import { forwardRef } from "react";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
	<NextLink href={props.href ?? "#"} legacyBehavior={true} passHref={true}>
		<MuiLink ref={ref} {...props} />
	</NextLink>
));

Link.displayName = "CustomLink";
