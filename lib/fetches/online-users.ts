/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { IncomingMessage } from "http";
import type { NextApiRequestCookies } from "next/dist/server/api-utils";
import { getToken } from "next-auth/jwt";

import { User } from "../../models";

const onlineUsers = async (
	req: IncomingMessage & { cookies: NextApiRequestCookies }
) => {
	const token = await getToken({ req });

	const users = await User.find({ online: true, _s: { $ne: token?.id } });

	return users;
};

export default onlineUsers;
