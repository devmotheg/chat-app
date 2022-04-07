/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { BsFillPeopleFill } from "react-icons/bs";
import axios from "axios";

import type {
	AsideResultsDropdownProps,
	UserDocument,
	ChannelDocument,
	DirectDocument,
} from "../../types";

const AsideResultsDropdown = ({
	search,
	isVisible,
}: AsideResultsDropdownProps) => {
	const { data: session } = useSession();

	const { data: channels, status: channelsStatus } = useQuery<
		ChannelDocument[]
	>("channels", async () => {
		const res = await axios(`/api/users/${session?.id}/channels`);
		return res.data.data.channels;
	});

	const { data: directs, status: directsStatus } = useQuery<DirectDocument[]>(
		"directs",
		async () => {
			const res = await axios(`/api/users/${session?.id}/directs`);
			return res.data.data.directs;
		}
	);

	const searchRegExp = new RegExp(
		`^${search
			.split("")
			.map(c => `\\${c}`)
			.join("")}`,
		"i"
	);

	return (
		<div
			className="absolute top-[calc(100%+1rem)] left-1/2 z-10 w-full -translate-x-1/2 space-y-4 rounded bg-white p-3 transition-all"
			style={{
				opacity: isVisible ? 1 : 0,
				visibility: isVisible ? "visible" : "hidden",
			}}>
			<div>
				<span className="mb-3 block capitalize text-neutral-500">channels</span>
				{channelsStatus === "loading" ? (
					<span className="text-sm capitalize text-slate-800">fetching...</span>
				) : (
					<ul className="space-y-1">
						{(() => {
							const filteredChannels = channels?.map(c => {
								if (searchRegExp.test(c.name as unknown as string) && search)
									return (
										<li key={c._id}>
											<Link href={`/?channel=${c._id}`}>
												<a className="flex items-center gap-3 p-2 transition hover:bg-pink-100">
													<BsFillPeopleFill className="h-3 w-3 text-slate-800" />
													<span className="text-sm text-slate-800">
														{c.name}
													</span>
												</a>
											</Link>
										</li>
									);
							});

							return filteredChannels?.some(c => c) ? (
								filteredChannels
							) : (
								<span className="text-sm text-slate-800">
									No channels found
								</span>
							);
						})()}
					</ul>
				)}
			</div>
			<div>
				<span className="mb-3 block capitalize text-neutral-500">users</span>
				{directsStatus === "loading" ? (
					<span className="text-sm capitalize text-slate-800">fetching...</span>
				) : (
					<ul className="space-y-1">
						{(() => {
							const filteredDirects = directs?.map(d => {
								const otherUser =
									session?.id === (d.user1 as UserDocument)._s
										? d.user2
										: d.user1;

								if (
									searchRegExp.test(
										(otherUser as UserDocument).name as unknown as string
									) &&
									search
								)
									return (
										<li key={d._id}>
											<Link href={`/?direct=${d._id}`}>
												<a className="flex items-center gap-3 p-2 transition hover:bg-pink-100">
													<Image
														className="shrink-0 rounded-full"
														src={
															(otherUser as UserDocument)
																.image as unknown as string
														}
														alt="user image"
														width="25"
														height="25"
													/>
													<span className="text-sm text-slate-800">
														{(otherUser as UserDocument).name}
													</span>
												</a>
											</Link>
										</li>
									);
							});

							return filteredDirects?.some(d => d) ? (
								filteredDirects
							) : (
								<span className="text-sm text-slate-800">No users found</span>
							);
						})()}
					</ul>
				)}
			</div>
		</div>
	);
};

export default AsideResultsDropdown;
