/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { ChannelDocument, ChannelModel } from "../types";

const schema = new Schema<ChannelDocument>({
	creator: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Channel must have a creator"],
	},
	name: {
		type: SchemaTypes.String,
		required: [true, "Name is required"],
	},
	subscribers: {
		type: SchemaTypes.Number,
		default: 0,
		min: [0, "Subscriptions can't be a negative number"],
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

schema.virtual("subscriptions", {
	ref: "subscription",
	foreignField: "channel",
	localField: "_id",
});

schema.virtual("messages", {
	ref: "message",
	foreignField: "channel",
	localField: "_id",
});

const Channel = models.channel
	? (models.channel as ChannelModel)
	: model<ChannelDocument, ChannelModel>("channel", schema);

export default Channel;
