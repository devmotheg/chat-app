/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiHandler } from "next";

import { User, Direct } from "../../../../../models";
import { globalErrorHandler, AppError, userDirects } from "../../../../../lib";

const handler: NextApiHandler = async (req, res) => {
	try {
		switch (req.method) {
			case "GET": {
				const directs = await userDirects(req);

				return res.status(200).json({
					status: "success",
					data: {
						directs,
					},
				});
			}
			case "POST": {
				const user = await User.findOne({ _s: req.query.userId });

				if (!user) return AppError.NotFound("user");

				if (!(req.body.members instanceof Object)) {
					throw new AppError("Members must be an object", 400);
				}

				for (const member of Object.keys(req.body.members))
					await Direct.create({
						user1: user._id,
						user2: member,
					});

				return res.status(200).json({
					status: "success",
					message: "Directs linked",
				});
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
