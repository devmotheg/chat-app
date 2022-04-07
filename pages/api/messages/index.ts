/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiHandler } from "next";

import { globalErrorHandler, APIFeatures } from "../../../lib";
import { Message } from "../../../models";

const handler: NextApiHandler = async (req, res) => {
	try {
		switch (req.method) {
			case "GET": {
				let queryFilter;

				if (req.query.kind === "channel" || req.query.kind === "direct")
					queryFilter = { [req.query.kind]: req.query.id };
				else queryFilter = { global: true };

				const messages = await new APIFeatures(
					Message.find(queryFilter).populate("creator"),
					req.query
				)
					.sort()
					// .paginate()
					.execute();

				return res.status(200).json({
					status: "success",
					data: {
						messages,
					},
				});
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
