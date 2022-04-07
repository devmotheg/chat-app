/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

import type { MainMessageProps, UserDocument } from "../../types";
import { MainMessageReactionButton } from ".";

const MainMessage = ({ message: msg, shouldShowImage }: MainMessageProps) => {
	const [message, setMessage] = useState(msg);

	const { data, status } = useQuery(["didReact", message._id], async () => {
		const didReact: { [index: string]: boolean } = {};
		for (const emoji of ["likes", "hearts", "fires"]) {
			const res = await axios(
				`/api/messages/${message._id}/reactions?emoji=${emoji}&kind=boolean`
			);
			didReact[emoji] = res.data.data.exists;
		}
		return didReact;
	});

	return (
		<div className="group my-2 flex w-[99.5%] items-start justify-between gap-6 rounded p-1 transition hover:bg-slate-800/10">
			<div className="flex items-end gap-3">
				<div className="flex shrink-0 flex-col items-center">
					<div
						className="shrink-0"
						style={{
							opacity: shouldShowImage ? 1 : 0,
							visibility: shouldShowImage ? "visible" : "hidden",
						}}>
						<Image
							className="rounded-full"
							src={(message.creator as UserDocument).image as unknown as string}
							alt="user image"
							width="43"
							height="43"
						/>
					</div>
				</div>
				<div>
					<div className="flex items-center gap-1">
						<span className="text-sm text-slate-600">
							{(message.creator as UserDocument).name}
						</span>
						<span className="font-bold text-slate-600">at</span>
						<span className="text-sm text-slate-600">
							{new Date(message.createdAt as unknown as Date).toLocaleString(
								"en-us",
								{
									hour: "numeric",
									minute: "numeric",
									hour12: true,
								}
							)}
						</span>
					</div>
					<p className="break-all text-lg text-slate-800">{message.text}</p>
					<div className="flex items-center gap-2">
						{(
							[
								["likes", "👍️"],
								["hearts", "❤️"],
								["fires", "🔥"],
							] as ["likes" | "hearts" | "fires", any][]
						).map(g => {
							if (!message[g[0]]) return;
							return (
								<span
									key={g[0]}
									className="text-sm"
									style={{
										fontWeight: data && data[g[0]] ? "bold" : "normal",
										color:
											data && data[g[0]] ? "rgb(59 130 246)" : "rgb(71 85 105)",
									}}>
									{g[1]} {message[g[0]]}
								</span>
							);
						})}
					</div>
				</div>
			</div>
			<div className="w-fit rounded-full bg-slate-800 p-1 opacity-0 transition group-hover:opacity-100">
				<MainMessageReactionButton
					message={message}
					setMessage={setMessage}
					didReact={data}
					canReact={status !== "loading"}
				/>
			</div>
		</div>
	);
};

export default MainMessage;
