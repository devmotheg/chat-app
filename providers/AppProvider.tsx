/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { createContext, useReducer } from "react";

import type {
	WrapperProps,
	AppContextVal,
	AppProviderAction,
	AppProviderState,
} from "../types";

const AppContext = createContext<AppContextVal>({
	state: {
		isAsideOpen: false,
	},
	dispatch: () => {},
});

const AppProvider = ({ children }: WrapperProps) => {
	const [state, dispatch] = useReducer(
		(state: AppProviderState, action: AppProviderAction): AppProviderState => {
			switch (action.type) {
				case "OPEN_ASIDE":
					return { ...state, isAsideOpen: true };
				case "CLOSE_ASIDE":
					return { ...state, isAsideOpen: false };
				default:
					return state;
			}
		},
		{
			isAsideOpen: false,
		}
	);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext };
export default AppProvider;
