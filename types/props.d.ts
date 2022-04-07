/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextComponentType, NextPage } from "next";
import type { AppProps } from "next/app";
import type {
	Dispatch,
	SetStateAction,
	CSSProperties,
	ReactElement,
	ReactComponentElement,
} from "react";

import type { Auth, ChannelDocument, DirectDocument, MessageDocument } from ".";

type AppPropsWithAuth = AppProps & {
	Component: NextComponentType & {
		auth?: Auth;
	};
};

type AuthFirewallProps = WrapperProps & {
	auth: Auth;
};

type WrapperProps = {
	children: ReactElement | ReactElement[];
};

type ErrorBoundaryProps = WrapperProps & {
	fallbackUi: ReactElement;
};

type AsideListAddButtonProps = {
	text: "channels" | "direct messages";
	endpoint: string;
};

type AsideItemProps = {
	endpoint: string;
	name: string;
	Icon?: ReactComponentElement;
	image?: string;
	online?: boolean;
	active: boolean;
};

type AsideResultsDropdownProps = {
	search: string;
	isVisible: boolean;
};

type MainHeaderProps = {
	channel?: ChannelDocument;
	direct?: DirectDocument;
};

type MainMessageRowProps = {
	messages: MessageDocument[];
	index: number;
};

type MainMessageProps = {
	message: MessageDocument;
	shouldShowImage: boolean;
};

type MainMessageReactionButtonProps = Pick<MainMessageProps, "message"> & {
	didReact: { [index: string]: boolean } | undefined;
	canReact: boolean;
	setMessage: Dispatch<SetStateAction<MessageDocument>>;
};

export {
	AppPropsWithAuth,
	AuthFirewallProps,
	WrapperProps,
	ErrorBoundaryProps,
	AsideListAddButtonProps,
	AsideItemProps,
	AsideResultsDropdownProps,
	MainHeaderProps,
	MainMessageProps,
	MainMessageReactionButtonProps,
	MainMessageRowProps,
};
