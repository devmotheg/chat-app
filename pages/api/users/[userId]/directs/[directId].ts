/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiHandler } from "next";

import { globalErrorHandler, AppError } from "../../../../../lib";
import { Direct } from "../../../../../models";

const handler: NextApiHandler = async (req, res) => {
	try {
		switch (req.method) {
			case "GET": {
				const direct = await Direct.findById(req.query.directId)
					.populate("user1")
					.populate("user2");

				if (!direct) return AppError.NotFound("direct");

				return res.status(200).json({
					status: "success",
					data: {
						direct,
					},
				});
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
