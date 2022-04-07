/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { IncomingMessage } from "http";
import type { NextApiRequestCookies } from "next/dist/server/api-utils";
import { getToken } from "next-auth/jwt";

import { User, Subscription } from "../../models";

const userChannels = async (
	req: IncomingMessage & { cookies: NextApiRequestCookies }
) => {
	const token = await getToken({ req });

	const user = await User.findOne({ _s: token?.id });
	const channels = (
		await Subscription.find({ user: user?._id }).populate("channel")
	).map(s => s.channel);

	return channels;
};

export default userChannels;
