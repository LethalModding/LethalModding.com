import Box from "@mui/material/Box";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ofetch } from "ofetch";
import { useEffect } from "react";
import { CornerAccents } from "@/components/branding/CornerAccents.tsx";
import { MOTD } from "@/components/branding/MOTD.tsx";
import { useGlobalStyles } from "@/styles/globalStyles.ts";

const Home: NextPage = (): JSX.Element => {
	const globalStyles = useGlobalStyles();

	const router = useRouter();
	const supabase = useSupabaseClient();
	// get session from fragment #access_token=...&expires_in=...&token_type=...
	useEffect(() => {
		const hash = (router.asPath as string).split("#")[1]; // error=unauthorized_client&error_code=401error_description=Something+went+wrong
		const parsedHash = new URLSearchParams(hash);

		const errorHash = parsedHash.get("error_description"); // Something went wrong
		if (errorHash !== null) {
			return;
		}

		const access_token = parsedHash.get("access_token");
		const refresh_token = parsedHash.get("refresh_token");

		// enforce certain query params
		if (!(access_token && refresh_token)) {
			return;
		}

		// The redirect runs either way: it is what strips the token fragment from
		// the URL, and a failed exchange simply leaves the visitor signed out.
		const clearTokenFragment = (): void => {
			router.replace("/").catch(() => {
				// next/router rejects a replace only when the navigation is
				// superseded, which means the visitor already moved on and the
				// fragment goes with the page they left.
			});
		};

		supabase.auth
			.setSession({
				access_token,
				refresh_token,
			})
			.then(clearTokenFragment)
			.catch(clearTokenFragment);
	}, [router, supabase]);

	const session = useSession();
	useEffect(() => {
		if (!session) {
			return;
		}

		// Hand the session to the desktop client if it happens to be listening.
		// Most visitors do not run it, so a rejected handshake is the normal case
		// and carries no user-visible consequence.
		ofetch("http://localhost:25792/connect", {
			body: {
				access_token: session.access_token,
				refresh_token: session.refresh_token,
			},
			cache: "no-cache",
			method: "POST",
		}).catch(() => undefined);
	}, [session]);

	return (
		<>
			<Head>
				<title>Your Source for Lethal Company Modding Resources</title>
			</Head>

			<CornerAccents />

			<Box sx={globalStyles.container}>
				<Box sx={{ display: "grid" }}>
					<MOTD />
				</Box>
			</Box>
		</>
	);
};

export default Home;
