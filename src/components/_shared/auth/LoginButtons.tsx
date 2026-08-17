import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useCallback } from "react";

type Props = {
	onDontClick?: () => void;
};

export default function LoginButtons(props: Props): JSX.Element {
	const { onDontClick } = props;

	const supabase = useSupabaseClient();
	const loginWithDiscord = useCallback(() => {
		supabase.auth.signInWithOAuth({
			provider: "discord",
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`,
				scopes: "identify email",
			},
		});
	}, [supabase]);
	const loginWithGithub = useCallback(() => {
		supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`,
			},
		});
	}, [supabase]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				gap: 1,
			}}
		>
			<Button onClick={loginWithDiscord} variant="contained">
				Discord
				<Image
					alt="Discord"
					src="/discord-mark-white.svg"
					height={16}
					width={21}
					unoptimized
					style={{ marginLeft: "0.5em" }}
				/>
			</Button>

			<Button onClick={loginWithGithub} variant="contained">
				Github
				<GitHubIcon color="action" sx={{ ml: "0.25em" }} />
			</Button>

			{onDontClick ? (
				<Button variant="outlined" onClick={onDontClick}>
					Don&apos;t
				</Button>
			) : null}
		</Box>
	);
}
