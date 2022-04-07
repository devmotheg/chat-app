import next from "next";
import express from "express";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import { webSocket, connectDb, globalErrorHandler } from "../lib";

const port = parseInt(process.env.PORT || "3000", 10);
const framework = next({ dev: process.env.NODE_ENV !== "production" });
const handle = framework.getRequestHandler();

(async () => {
	try {
		await framework.prepare();
		const app = express();

		const server = app.listen(port, () => {
			console.info(`Listening on port ${port}...`);
		});

		webSocket(new Server(server));

		app.all(/^\/(?!api($|\/.*))/, (req, res) => handle(req, res));

		await connectDb();
		app.all(/^\/api($|\/.*)/, (req, res) => handle(req, res));

		app.use(express.json());
		app.use(cookieParser());
	} catch (err) {
		globalErrorHandler(err);
	}
})();
