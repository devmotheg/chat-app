/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";

import type { MainHeaderProps, UserDocument } from "../../types";
import { useSocket } from "../../hooks";

const MainHeader = ({ channel, direct }: MainHeaderProps) => {
	const { data: session } = useSession();
	const socket = useSocket();

	useEffect(() => {
		socket?.emit("join", channel?._id || direct?._id || "global");
	}, [socket, channel, direct, session]);

	let otherUser;
	if (direct) {
		otherUser =
			session?.id === (direct.user1 as UserDocument)._s
				? direct.user2
				: direct.user1;
	}

	return (
		<header className="mb-4">
			<div className="flex items-center gap-3">
				{direct ? (
					<>
						<Image
							className="shrink-0 rounded-full"
							src={(otherUser as UserDocument).image as unknown as string}
							alt="user image"
							width="40"
							height="40"
						/>
						<span className="text-2xl text-slate-800">
							{(otherUser as UserDocument).name}
						</span>
					</>
				) : channel ? (
					<>
						<BsFillPeopleFill className="h-7 w-7 shrink-0 text-slate-800" />
						<span className="text-2xl text-slate-800">{channel.name}</span>
					</>
				) : (
					<>
						<BsGlobe className="h-7 w-7 shrink-0 text-slate-800" />
						<span className="text-2xl capitalize text-slate-800">
							global chat
						</span>
					</>
				)}
			</div>
		</header>
	);
};

export default MainHeader;
