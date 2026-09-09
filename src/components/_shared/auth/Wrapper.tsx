import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import AuthRequired from "@/components/_shared/auth/Required.tsx";
import Loader from "@/components/_shared/Loader.tsx";

export default function AuthWrapper(props: PropsWithChildren): JSX.Element {
	const supabase = useSupabaseClient();
	const user = useUser();

	const [loggedIn, setLoggedIn] = useState<boolean>();
	useEffect(() => {
		let active = true;

		async function userLoggedIn(): Promise<boolean> {
			if (user) {
				return true;
			}

			const {
				data: { session },
			} = await supabase.auth.getSession();

			return Boolean(session);
		}

		userLoggedIn()
			.then((value) => {
				if (active) {
					setLoggedIn(value);
				}
			})
			.catch(() => {
				// An unreachable session endpoint is indistinguishable from no
				// session: send the visitor to the login prompt rather than
				// leaving the wrapper stuck on the loader.
				if (active) {
					setLoggedIn(false);
				}
			});

		return () => {
			active = false;
		};
	}, [user, supabase]);

	// if supabase and we're not logged in, then we need to login
	if (supabase && loggedIn === false) {
		return <AuthRequired />;
	}

	// if !supabase or !user, then we're still loading
	if (!(supabase && user)) {
		return <Loader />;
	}

	const { children } = props;

	return children as JSX.Element;
}
