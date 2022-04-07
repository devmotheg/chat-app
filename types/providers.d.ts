/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { Dispatch } from "react";
import type { Socket } from "socket.io-client";

import type { AppProviderState } from ".";

type ProviderAction = {
	type: string;
	payload?: {
		[index: string]: any;
	};
};

type AppProviderAction = ProviderAction;

type AppContextVal = {
	state: AppProviderState;
	dispatch: Dispatch<AppProviderAction>;
};

type SocketContextVal = Socket | null;

export { AppProviderAction, AppContextVal, SocketContextVal };
