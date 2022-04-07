/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiHandler } from "next";

import { globalErrorHandler, onlineUsers } from "../../../lib";

const handler: NextApiHandler = async (req, res) => {
	try {
		switch (req.method) {
			case "GET": {
				if (req.query.kind === "online") {
					const users = await onlineUsers(req);

					res.status(200).json({
						status: "success",
						data: {
							users,
						},
					});
				}
			}
		}
	} catch (err) {
		globalErrorHandler(err, res);
	}
};

export default handler;
