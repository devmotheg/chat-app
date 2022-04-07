/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useSession } from "next-auth/react";
import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

import type { WrapperProps, SocketContextVal } from "../types";

const SocketContext = createContext<SocketContextVal>(null);

const SocketProvider = ({ children }: WrapperProps) => {
	const { data: session } = useSession();
	const [socket, setSocket] = useState<SocketContextVal>(null);

	useEffect(() => {
		if (!session) return;

		const socket = io("/", {
			query: {
				_s: session?.id,
			},
		});

		setSocket(socket);

		return () => {
			socket.close();
		};
	}, [session]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export { SocketContext };
export default SocketProvider;
