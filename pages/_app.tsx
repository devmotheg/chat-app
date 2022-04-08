/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import "../styles/globals.css";

import dynamic from "next/dynamic";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";

import type { AppPropsWithAuth } from "../types";
import { AppProvider, SocketProvider } from "../providers";
import { AuthFirewall, ErrorBoundary } from "../components";

const App = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithAuth) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						useErrorBoundary: true,
						retry: false,
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	return (
		<>
			<Head>
				<title>Chat App</title>
			</Head>
			<ErrorBoundary
				fallbackUi={
					<main className="flex min-h-screen items-center justify-center">
						<strong className="block p-3 text-center text-3xl font-bold capitalize text-neutral-800">
							an error has occurred, come back later
						</strong>
					</main>
				}>
				<SessionProvider session={session}>
					<AppProvider>
						<SocketProvider>
							<QueryClientProvider client={queryClient}>
								<Hydrate state={pageProps.dehydratedState}>
									{Component.auth ? (
										<AuthFirewall auth={Component.auth}>
											<Component {...pageProps} />
										</AuthFirewall>
									) : (
										<Component {...pageProps} />
									)}
								</Hydrate>
							</QueryClientProvider>
						</SocketProvider>
					</AppProvider>
				</SessionProvider>
			</ErrorBoundary>
		</>
	);
};

export default App;
