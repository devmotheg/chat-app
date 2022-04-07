/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { MessageDocument, MessageModel } from "../types";

const schema = new Schema<MessageDocument>({
	creator: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Message must belong to a user"],
	},
	channel: {
		type: SchemaTypes.ObjectId,
		ref: "channel",
		immutable: true,
		required: [
			function (this: MessageDocument) {
				return !this.global && !this.direct;
			},
			"Message must either belong to global chat or a channel or a direct",
		],
	},
	direct: {
		type: SchemaTypes.ObjectId,
		ref: "direct",
		immutable: true,
		required: [
			function (this: MessageDocument) {
				return !this.global && !this.channel;
			},
			"Message must either belong to global chat or a channel or a direct",
		],
	},
	global: {
		type: SchemaTypes.Boolean,
		required: [
			function (this: MessageDocument) {
				return !this.channel && !this.direct;
			},
			"Message must either belong to global chat or a channel or a direct",
		],
	},
	text: {
		type: SchemaTypes.String,
		required: [true, "Text is required"],
	},
	likes: {
		type: SchemaTypes.Number,
		default: 0,
		min: [0, "Likes can't be a negative number"],
	},
	hearts: {
		type: SchemaTypes.Number,
		default: 0,
		min: [0, "Hearts can't be a negative number"],
	},
	fires: {
		type: SchemaTypes.Number,
		default: 0,
		min: [0, "Fires can't be a negative number"],
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

const Message = models.message
	? (models.message as MessageModel)
	: model<MessageDocument, MessageModel>("message", schema);

export default Message;
