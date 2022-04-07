/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { NextApiResponse, NextApiRequest } from "next";

type NextApiRequestWithMiddleware = NextApiRequest & {
	[index: string]: any;
};

type NextApiResponseWithMiddleware = NextApiResponse & {
	[index: string]: any;
};

type NextApiHandlerWithMiddleware<T = any> = (
	req: NextApiRequestWithMiddleware,
	res: NextApiResponseWithMiddleware<T>,
	next: (result?: any) => void
) => void | Promise<void>;

export {
	NextApiRequestWithMiddleware,
	NextApiResponseWithMiddleware,
	NextApiHandlerWithMiddleware,
};
