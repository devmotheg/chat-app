/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { VirtuosoHandle } from "react-virtuoso";
import { useState, useEffect, useRef /* useCallback */ } from "react";
import { useInfiniteQuery } from "react-query";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";

import type { MessageDocument } from "../../types";
import { MainMessageRow } from ".";
import { Loading } from "..";
import { useRoom, useSocket } from "../../hooks";

const MainChatBox = () => {
	// const [firstItemIndex, setFirstItemIndex] = useState(Number.MAX_SAFE_INTEGER);
	const { direction, directionId } = useRoom();
	const virtuosoRef = useRef<VirtuosoHandle>(null);
	const [messages, setMessages] = useState<MessageDocument[]>([]);
	const socket = useSocket();

	const { /* hasNextPage, fetchNextPage, */ data, isLoading } =
		useInfiniteQuery<
			MessageDocument[],
			unknown,
			MessageDocument[],
			["messages", typeof direction, typeof directionId]
		>(
			["messages", direction, directionId],
			async ({ queryKey, pageParam = 1 }) => {
				let endpoint = `/api/messages/?page=${pageParam}`;
				if (queryKey[2]) endpoint += `&kind=${queryKey[1]}&id=${queryKey[2]}`;
				else endpoint += "&kind=global";

				const res = await axios(endpoint);
				return res.data.data.messages;
			},
			{
				// onSuccess: data => {
				// 	setFirstItemIndex(firstItemIndex - 10);
				// 	setMessages(messages =>
				// 		data.pages[data.pages.length - 1].concat(messages)
				// 	);
				// },
				getNextPageParam: (lastPage, allPages) => {
					if (lastPage.length < 10) return;
					return allPages.length + 1;
				},
			}
		);

	useEffect(() => {
		if (!messages.length && data)
			setMessages(
				data?.pages.reduce((acc, val) => [...val, ...acc], []).reverse()
			);
	}, [data, messages]);

	useEffect(() => {
		const listener = (newMessage: any) => {
			setMessages(messages => messages.concat(newMessage));
			virtuosoRef.current?.scrollToIndex({
				index: "LAST",
			});
		};

		socket?.on("messageSaved", listener);

		return () => {
			socket?.off("messageSaved", listener);
		};
	}, [socket, setMessages]);

	// const prependItems = useCallback(() => {
	// 	if (hasNextPage) fetchNextPage();
	// 	return !hasNextPage;
	// }, [hasNextPage, fetchNextPage]);

	if (isLoading) return <Loading />;
	return (
		<div>
			{messages && messages.length ? (
				<Virtuoso
					style={{
						height: "100%",
					}}
					ref={virtuosoRef}
					// firstItemIndex={firstItemIndex}
					// startReached={prependItems}
					initialTopMostItemIndex={messages.length - 1}
					data={messages}
					itemContent={(index, message) => {
						index = messages.findIndex(m => m._id === message._id);
						return <MainMessageRow messages={messages} index={index} />;
					}}
				/>
			) : (
				<span className="relative mx-auto block w-fit text-center text-lg text-slate-800 before:absolute before:left-[calc(100%+0.5rem)] before:top-1/2 before:h-[0.1rem] before:w-1/3 before:-translate-y-1/2 before:bg-slate-800 after:absolute after:right-[calc(100%+0.5rem)] after:top-1/2 after:h-[0.1rem] after:w-1/3 after:-translate-y-1/2 after:bg-slate-800">
					No messages found
				</span>
			)}
		</div>
	);
};

export default MainChatBox;
