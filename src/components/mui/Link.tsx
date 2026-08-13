import MuiLink, { type LinkProps } from "@mui/material/Link";
import NextLink from "next/link";
import { forwardRef } from "react";

const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
	<NextLink href={props.href ?? "#"} legacyBehavior passHref>
		<MuiLink ref={ref} {...props} />
	</NextLink>
));

Link.displayName = "CustomLink";

export default Link;
