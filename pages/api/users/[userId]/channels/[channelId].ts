/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiHandler } from "next";

import { globalErrorHandler, AppError } from "../../../../../lib";
import { Channel } from "../../../../../models";

const handler: NextApiHandler = async (req, res) => {
	try {
		switch (req.method) {
			case "GET": {
				const channel = await Channel.findById(req.query.channelId);

				if (!channel) return AppError.NotFound("channel");

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
