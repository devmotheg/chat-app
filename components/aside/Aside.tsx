/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { BsGlobe, BsToggles } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";

import { useApp, useSocket } from "../../hooks";
import { AsideChannels, AsideDirects, AsideSearchBar } from ".";

const Aside = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { state, dispatch } = useApp();
	const socket = useSocket();

	useEffect(() => {
		const channelsListener = () => {
			queryClient.invalidateQueries("channels");
		};

		const directsListener = () => {
			queryClient.invalidateQueries("directs");
		};

		socket?.on("updateChannels", channelsListener);
		socket?.on("updateDirects", directsListener);

		return () => {
			socket?.off("updateChannels", channelsListener);
			socket?.off("updateDirects", directsListener);
		};
	}, [queryClient, socket]);

	return (
		<aside
			className={`absolute z-20 flex max-h-screen min-h-screen w-5/6 bg-slate-800 transition-all before:absolute before:top-0 before:right-0 ${
				state.isAsideOpen ? "before:h-0" : "before:h-full"
			} pr-1 before:w-2 lg:static lg:min-h-fit lg:w-fit lg:!translate-x-0 lg:before:hidden`}
			style={{
				transform: `translateX(calc(-100% + ${
					state.isAsideOpen ? "100%" : "0.3rem"
				})`,
			}}>
			<button
				className="absolute top-1/2 -right-6 -z-10 flex h-14 w-14 -translate-y-1/2 items-center rounded-full bg-slate-800 lg:hidden"
				onClick={() =>
					dispatch({
						type: state.isAsideOpen ? "CLOSE_ASIDE" : "OPEN_ASIDE",
					})
				}>
				<span className="sr-only">toggle aside</span>
				<BsToggles className="ml-auto mr-2 h-4 w-4 text-pink-200" />
			</button>
			<div className="bg-slate-900 p-2">
				<button
					className="opacity-80 transition hover:opacity-100"
					onClick={() => signOut()}>
					<span className="sr-only">sign out</span>
					<BiLogOut className="my-2 h-10 w-10 text-pink-200 lg:h-12 lg:w-12" />
				</button>
			</div>
			<div className="max-h-full flex-grow overflow-y-auto">
				<h1 className="mx-20 mb-4 border-b-[0.1rem] border-solid border-pink-200 p-4 text-center text-2xl font-bold capitalize text-white lg:text-3xl">
					chat app
				</h1>
				<AsideSearchBar />
				<Link href="/">
					<a
						className="mb-6 flex w-5/6 items-center gap-3 rounded-r-xl px-4 py-2 capitalize text-neutral-100 transition hover:bg-slate-900 lg:text-lg"
						style={{
							backgroundColor:
								!router.query.direct && !router.query.channel
									? "rgb(15 23 42)"
									: "",
						}}>
						<BsGlobe className="h-4 w-4 text-pink-200 lg:h-5 lg:w-5" />
						global chat
					</a>
				</Link>
				<div className="space-y-6">
					<AsideChannels />
					<AsideDirects />
				</div>
			</div>
		</aside>
	);
};

export default Aside;
