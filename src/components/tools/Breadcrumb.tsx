import Typography from "@mui/material/Typography";
import TypedText from "components/branding/TypedText";
import Link from "components/mui/Link";
import { Fragment } from "react";

type Props = {
	parts: string[];
};

const Breadcrumb = (props: Props): JSX.Element => {
	const { parts } = props;

	return (
		<Typography variant="h2">
			<Link
				href="/"
				sx={{
					cursor: "pointer",
					marginRight: "32px",
					textDecoration: "none",
					"&:hover": {
						background: "inherit",
					},
				}}
			>
				#
			</Link>
			{parts.map((part, index) => {
				return (
					<Fragment key={parts.slice(0, index + 1).join("/")}>
						<TypedText
							finalText={part}
							startDelay={index * 300}
							typingSpeed={5}
						/>
						{index < parts.length - 1 && (
							<span style={{ margin: "0 16px" }}>/</span>
						)}
					</Fragment>
				);
			})}
		</Typography>
	);
};

export default Breadcrumb;
