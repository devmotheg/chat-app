/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiHandler } from "next";
import { getToken } from "next-auth/jwt";

import { User, Reaction, Message } from "../../../../models";
import { globalErrorHandler } from "../../../../lib";

const handler: NextApiHandler = async (req, res) => {
	try {
		const token = await getToken({ req });
		const user = await User.findOne({ _s: token?.id });

		switch (req.method) {
			case "GET": {
				if (req.query.kind === "boolean") {
					const exists = !!(await Reaction.count({
						creator: user?._id,
						message: req.query.messageId,
						emoji: req.query.emoji,
					}));

					return res.status(200).json({
						status: "success",
						data: {
							exists,
						},
					});
				}
			}
			case "POST": {
				const reaction = await Reaction.create({
					creator: user?._id,
					message: req.query.messageId,
					emoji: req.body.emoji,
				});

				await Reaction.findById(reaction._id);

				return res.status(200).json({
					status: "success",
					message: "Reaction registered",
				});
			}
			case "DELETE": {
				await Reaction.findOneAndDelete({
					creator: user?._id,
					message: req.query.messageId,
					emoji: req.body,
				});

				await Message.findById(req.query.messageId);

				return res.status(204).end();
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
