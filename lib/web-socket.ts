/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { Server, Socket } from "socket.io";
import type { Schema } from "mongoose";

import { User, Message, Direct } from "../models";

const users: { [index: string]: Socket[] } = {};

const webSocket = (io: Server) => {
	io.on("connection", async socket => {
		console.info("Web socket established...");

		// Getting the user
		const user = await User.findOne({ _s: socket.handshake.query._s });
		const userId = user?._id;

		if (!user) return;

		// Open user tabs
		if (userId in users) users[userId].push(socket);
		else users[userId] = [socket];

		// Make user go offline and notify others
		socket.on("disconnect", async () => {
			users[userId] = users[userId].filter(s => s.id !== socket.id);
			if (!users[userId].length) {
				user!.online = false as unknown as Schema.Types.Boolean;
				await user?.save();

				io.emit("updateOnlineUsers");

				const directs = await Direct.find({
					$or: [{ user1: user?._id }, { user2: user?._id }],
				});
				for (const direct of directs) {
					const otherUser =
						direct.user1.toString() === user?.id ? direct.user2 : direct.user1;

					if (users[otherUser.toString()])
						for (const s of users[otherUser.toString()])
							s.emit("updateDirects");
				}
			}
		});

		// Make user go online and notify others
		user!.online = true as unknown as Schema.Types.Boolean;
		await user?.save();

		io.emit("updateOnlineUsers");

		const directs = await Direct.find({
			$or: [{ user1: user?._id }, { user2: user?._id }],
		});
		for (const direct of directs) {
			const otherUser =
				direct.user1.toString() === user?.id ? direct.user2 : direct.user1;

			if (users[otherUser.toString()])
				for (const s of users[otherUser.toString()]) s.emit("updateDirects");
		}

		// Join user to a specific direction after cleaning previous channels
		socket.on("join", room => {
			for (const r in socket.rooms) socket.leave(r);
			socket.join(room);
		});

		// Notify members of channel upon creation
		socket.on("channelCreated", members => {
			for (const memberId of [...Object.keys(members), user?._id])
				for (const s of users[memberId]) s.emit("updateChannels");
		});

		// Notify all newly made directs
		socket.on("directsCreated", members => {
			for (const memberId of [...Object.keys(members), user?._id])
				for (const s of users[memberId]) s.emit("updateDirects");
		});

		// Fire upon listening to a message event, save it to DB, send the formated message back
		socket.on("message", async info => {
			const body = {
				creator: user?._id,
				text: info.message,
			};

			for (const [key, field] of [
				["channel", info.direction.channel],
				["direct", info.direction.direct],
				["global", true],
			])
				if (field) {
					const msg = await (
						await Message.create({
							...body,
							[key]: field,
						})
					).populate("creator");

					socket.emit("messageSaved", msg);
					socket.to(field === true ? key : field).emit("messageSaved", msg);

					break;
				}
		});

		// Realtime refresh of newly registered reactions
		socket.on("reactionUpdate", (direction, newMsg) => {
			for (const field of [direction.channel, direction.direct, "global"])
				if (field) {
					socket.emit("reactionSaved", newMsg);
					socket.to(field).emit("reactionSaved", newMsg);
					break;
				}
		});
	});
};

export default webSocket;
