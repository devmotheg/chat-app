/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { ChangeEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

import type { UserDocument, ChannelDocument } from "../../types";
import { Loading } from "..";
import { useSocket } from "../../hooks";

const MainAddChannel = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const socket = useSocket();

	const [inputs, setInputs] = useState<{
		name: string;
		members: { [index: string]: boolean };
	}>({
		name: "",
		members: {},
	});

	const { data: users } = useQuery<UserDocument[]>("onlineUsers", async () => {
		const res = await axios("/api/users?kind=online");
		return res.data.data.users;
	});

	const mutation = useMutation<
		ChannelDocument | void,
		unknown,
		{ directionEndpoint: "channel" | "directs"; directionInfo: typeof inputs }
	>(
		async ({ directionEndpoint, directionInfo }) => {
			const res = await axios.post(
				`/api/users/${session?.id}/${
					directionEndpoint === "channel" ? "channels" : directionEndpoint
				}`,
				directionInfo
			);
			if (directionEndpoint === "channel")
				return res.data.data[directionEndpoint];
		},
		{
			onSuccess: (direction, { directionEndpoint, directionInfo }) => {
				if (directionEndpoint === "channel") {
					socket?.emit("channelCreated", directionInfo.members);
					router.push(`/?channel=${direction?._id}`);
				} else {
					socket?.emit("directsCreated", directionInfo.members);
					router.push("/");
				}
			},
		}
	);

	useEffect(() => {
		const listener = () => {
			queryClient.invalidateQueries("onlineUsers");
		};
		socket?.on("updateOnlineUsers", listener);
		return () => {
			socket?.off("updateOnlineUsers", listener);
		};
	}, [queryClient, socket]);

	useEffect(() => {
		if (users)
			setInputs(inputs => {
				return {
					...inputs,
					members: users.reduce((acc: { [index: string]: boolean }, user) => {
						acc[user._id as unknown as string] = false;
						return acc;
					}, {}),
				};
			});
	}, [users]);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target;
		const name = target.name;
		const value = target.type === "checkbox" ? target.checked : target.value;

		setInputs(inputs => {
			if (target.type === "checkbox")
				return {
					name: inputs.name,
					members: { ...inputs.members, [name]: value as boolean },
				};
			else return { ...inputs, [name]: value };
		});
	};

	return (
		<main className="relative flex max-h-screen flex-grow flex-col gap-4 p-2">
			<div className="flex items-center justify-between">
				<span className="text-2xl font-bold capitalize">
					{router.query.add === "channel"
						? "create a new channel"
						: "direct online users"}
				</span>
				<button onClick={() => router.back()}>
					<FaTimes className="h-7 w-7 text-slate-800 opacity-80 transition hover:opacity-100" />
				</button>
			</div>
			<form
				className="grid h-full w-full grid-flow-row"
				style={{
					gridTemplateRows:
						router.query.add === "channel" ? "auto auto 1fr" : "auto 1fr",
				}}>
				{router.query.add === "channel" && (
					<div className="mb-4">
						<label
							className="mb-2 block w-fit text-lg font-bold capitalize text-slate-800"
							htmlFor="name">
							name
						</label>
						<input
							className="w-full rounded border-2 border-solid border-neutral-200 bg-white p-2 text-lg outline-0 placeholder:text-lg placeholder:capitalize placeholder:text-neutral-500 placeholder:transition focus:placeholder:opacity-0"
							type="text"
							placeholder="channel name"
							name="name"
							id="name"
							value={inputs.name}
							onChange={handleInputChange}
						/>
					</div>
				)}
				<div>
					<div className="flex items-center justify-between">
						<span className="mb-2 block text-lg font-bold capitalize text-slate-800">
							{router.query.add === "channel" ? "members" : "users"}
						</span>
						<span className="mb-2 block text-lg font-bold capitalize text-slate-800">
							{router.query.add === "channel" ? "invited" : "added"}
						</span>
					</div>
					<div className="my-2 mr-1 max-h-96 space-y-4 overflow-y-auto">
						{inputs.members ? (
							!users?.length ? (
								<span className="my-2 block px-4 text-center text-lg text-slate-800">
									No online users at the moment
								</span>
							) : (
								users?.map(u => {
									return (
										<div
											key={u._id as unknown as string}
											className="flex items-center justify-between">
											<label
												className="flex w-[99.5%] items-center justify-between"
												htmlFor={u._id as unknown as string}>
												<div className="flex items-center gap-3">
													<Image
														className="shrink-0 rounded-full"
														src={u.image as unknown as string}
														alt="user image"
														width="30"
														height="30"
													/>
													<span className="text-lg text-slate-800">
														{u.name}
													</span>
												</div>
												{inputs.members[u._id as unknown as string] ? (
													<RiCheckboxFill className="h-7 w-7 text-slate-800" />
												) : (
													<RiCheckboxBlankLine className="h-7 w-7 text-slate-800" />
												)}
											</label>
											<input
												className="hidden"
												type="checkbox"
												id={u._id as unknown as string}
												name={u._id as unknown as string}
												checked={inputs.members[u._id as unknown as string]}
												onChange={handleInputChange}
											/>
										</div>
									);
								})
							)
						) : (
							<Loading />
						)}
					</div>
				</div>
				<button
					className="ml-auto h-fit w-fit rounded bg-slate-800 p-2 text-lg font-bold capitalize text-pink-200 opacity-80 transition hover:opacity-100"
					onClick={e => {
						e.preventDefault();

						mutation.mutate({
							directionEndpoint: router.query.add as "channel" | "directs",
							directionInfo: inputs,
						});
					}}>
					{router.query.add === "channel"
						? "Add new channel"
						: "Add new directs"}
				</button>
			</form>
		</main>
	);
};

export default MainAddChannel;
