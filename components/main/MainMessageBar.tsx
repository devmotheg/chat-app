/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useState, useEffect } from "react";
import { BsTelegram } from "react-icons/bs";

import { useSocket, useRoom } from "../../hooks";

const MainMessageBar = () => {
	const [isDisabled, setIsDisabled] = useState(false);
	const [message, setMessage] = useState("");
	const socket = useSocket();
	const { direction, directionId } = useRoom();

	const sendMessage = (message: string) => {
		socket?.emit("message", {
			direction: directionId ? { [direction]: directionId } : "global",
			message,
		});
	};

	useEffect(() => {
		if (isDisabled) {
			const timeout = setTimeout(() => setIsDisabled(false), 100);
			return () => clearTimeout(timeout);
		}
	});

	return (
		<form className="flex flex-row-reverse items-center gap-3 rounded bg-white/80 p-2">
			<input
				className="peer h-full w-full bg-transparent text-xl text-slate-800 caret-slate-800 outline-0 placeholder:text-xl placeholder:capitalize placeholder:text-neutral-500 placeholder:transition focus:placeholder:opacity-0"
				type="text"
				placeholder="type your message"
				value={message}
				onChange={e => setMessage(e.target.value)}
			/>
			<button
				className="group opacity-80 transition hover:opacity-100 peer-focus:opacity-100"
				onClick={e => {
					e.preventDefault();
					sendMessage(message);
					setMessage("");
					setIsDisabled(true);
				}}
				disabled={isDisabled}>
				<span className="sr-only">search</span>
				<BsTelegram className="h-7 w-7 text-slate-800 transition group-disabled:text-red-800" />
			</button>
		</form>
	);
};

export default MainMessageBar;
