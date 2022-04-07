/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { BsEmojiSmileFill } from "react-icons/bs";
import axios from "axios";

import type { MainMessageReactionButtonProps } from "../../types";
import { useRoom, useSocket } from "../../hooks";

const MainReactionButton = ({
	message,
	setMessage,
	didReact,
	canReact,
}: MainMessageReactionButtonProps) => {
	const [areReactionsOpen, setAreReactionsOpen] = useState(false);
	const { direction, directionId } = useRoom();
	const socket = useSocket();
	const queryClient = useQueryClient();

	const mutation = useMutation<
		unknown,
		unknown,
		{ emoji: "likes" | "hearts" | "fires" }
	>(
		async ({ emoji }) => {
			if (didReact![emoji])
				await axios.delete(`/api/messages/${message._id}/reactions`, {
					data: emoji,
				});
			else
				await axios.post(`/api/messages/${message._id}/reactions`, {
					emoji,
				});
		},
		{
			onSuccess: (data, { emoji }) => {
				const newMessage = {
					...message,
					[emoji]:
						(message[emoji] as unknown as number) + (didReact![emoji] ? -1 : 1),
				};
				socket?.emit(
					"reactionUpdate",
					directionId ? { [direction]: directionId } : "global",
					newMessage
				);
				queryClient.invalidateQueries(["didReact", message._id], {
					exact: true,
				});
			},
		}
	);

	useEffect(() => {
		const listener = (newMessage: any) => {
			if (newMessage._id === message._id) setMessage(newMessage);
		};

		socket?.on("reactionSaved", listener);

		return () => {
			socket?.off("reactionSaved", listener);
		};
	}, [socket, message, setMessage]);

	return (
		<div className="relative flex">
			<button
				className="opacity-80 transition hover:opacity-100"
				onClick={() => setAreReactionsOpen(!areReactionsOpen)}>
				<BsEmojiSmileFill className="h-4 w-4 text-pink-200" />
			</button>
			<div
				className="absolute bottom-1/2 right-7 flex translate-y-1/2 items-center gap-2 transition-all"
				style={{
					opacity: areReactionsOpen ? 1 : 0,
					visibility: areReactionsOpen ? "visible" : "hidden",
				}}>
				{(
					[
						["likes", "👍️"],
						["hearts", "❤️"],
						["fires", "🔥"],
					] as ["likes" | "hearts" | "fires", any][]
				).map(g => {
					return (
						<button
							key={g[0]}
							className="opacity-80 transition-all hover:scale-125 hover:opacity-100 disabled:grayscale"
							onClick={() => mutation.mutate({ emoji: g[0] })}
							disabled={mutation.isLoading || !canReact}>
							{g[1]}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default MainReactionButton;
