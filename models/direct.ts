/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { DirectDocument, DirectModel } from "../types";

const schema = new Schema<DirectDocument>({
	user1: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Direct must be shared between 2 users"],
	},
	user2: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Direct must be shared between 2 users"],
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

schema.virtual("messages", {
	ref: "message",
	foreignField: "direct",
	localField: "_id",
});

const Direct = models.direct
	? (models.direct as DirectModel)
	: model<DirectDocument, DirectModel>("direct", schema);

export default Direct;
