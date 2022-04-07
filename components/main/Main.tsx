/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";

import type { ChannelDocument, DirectDocument } from "../../types";
import { MainHeader, MainChatBox, MainMessageBar, MainAddDirection } from ".";
import { Loading } from "..";
import { useRoom } from "../../hooks";

const Main = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { direction, directionId } = useRoom();

	const { data, status } = useQuery<
		unknown,
		unknown,
		ChannelDocument | DirectDocument | void,
		["direction", typeof direction, typeof directionId]
	>(["direction", direction, directionId], async ({ queryKey }) => {
		if (queryKey[2]) {
			const res = await axios(
				`/api/users/${session?.id}/${queryKey[1]}s/${queryKey[2]}`
			);
			return res.data.data[direction];
		}
	});

	return router.query.add === "channel" || router.query.add === "directs" ? (
		<MainAddDirection />
	) : (
		<main className="relative grid max-h-screen flex-grow grid-flow-row grid-rows-[auto_1fr_auto] gap-2 p-3">
			<div className="absolute top-0 left-0 -z-10 h-full w-full opacity-5">
				<Image
					src="/chat-bg.jpg"
					alt="chat background"
					layout="fill"
					objectFit="cover"
				/>
			</div>
			{status === "loading" ? (
				<Loading />
			) : (
				<>
					{router.query.channel ? (
						<MainHeader channel={data as ChannelDocument} />
					) : router.query.direct ? (
						<MainHeader direct={data as DirectDocument} />
					) : (
						<MainHeader />
					)}
					<MainChatBox />
					<MainMessageBar />
				</>
			)}
		</main>
	);
};

export default Main;
