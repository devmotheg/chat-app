/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "react-query";

import type { NextPageWithAuth } from "../types";
import { Aside, Main } from "../components";

const Home: NextPageWithAuth = () => {
	return (
		<div className="flex min-h-screen">
			<Aside />
			<Main />
		</div>
	);
};

Home.auth = {
	usersOnly: true,
};

import { onlineUsers, userChannels, userDirects } from "../lib";

const getServerSideProps: GetServerSideProps = async context => {
	const queryClient = new QueryClient();

	queryClient.prefetchQuery("channels", async () => {
		const channels = await userChannels(context.req);

		return channels;
	});

	queryClient.prefetchQuery("directs", async () => {
		const directs = await userDirects(context.req);

		return directs;
	});

	if (context.query.add) {
		queryClient.prefetchQuery("users", async () => {
			const users = await onlineUsers(context.req);

			return users;
		});
	}

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
};

export { getServerSideProps };
export default Home;
