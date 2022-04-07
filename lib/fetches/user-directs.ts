/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { IncomingMessage } from "http";
import type { NextApiRequestCookies } from "next/dist/server/api-utils";
import { getToken } from "next-auth/jwt";

import { User, Direct } from "../../models";

const userDirects = async (
	req: IncomingMessage & { cookies: NextApiRequestCookies }
) => {
	const token = await getToken({ req });

	const user = await User.findOne({ _s: token?.id });
	const directs = await Direct.find({
		$or: [{ user1: user?._id }, { user2: user?._id }],
	})
		.populate("user1")
		.populate("user2");

	return directs;
};

export default userDirects;
