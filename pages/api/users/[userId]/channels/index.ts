/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiHandler } from "next";

import { User, Channel, Subscription } from "../../../../../models";
import { globalErrorHandler, AppError, userChannels } from "../../../../../lib";

const handler: NextApiHandler = async (req, res) => {
	try {
		switch (req.method) {
			case "GET": {
				const channels = await userChannels(req);

				return res.status(200).json({
					status: "success",
					data: {
						channels,
					},
				});
			}
			case "POST": {
				const user = await User.findOne({ _s: req.query.userId });

				if (!user) return AppError.NotFound("user");

				const channel = await Channel.create({
					name: req.body.name,
					creator: user._id,
				});

				if (!(req.body.members instanceof Object)) {
					await channel.remove();
					throw new AppError("Members must be an object", 400);
				}

				for (const member of [...Object.keys(req.body.members), user._id])
					await Subscription.create({
						user: member,
						channel: channel._id,
					});

				return res.status(200).json({
					status: "success",
					data: {
						channel,
					},
				});
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
