/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { UserDocument, UserModel } from "../types";

const schema = new Schema<UserDocument>({
	_s: {
		type: SchemaTypes.String,
		immutable: true,
		unique: true,
	},
	name: {
		type: SchemaTypes.String,
		required: [true, "Name is required"],
	},
	image: {
		type: SchemaTypes.String,
		required: [true, "Image is required"],
	},
	online: {
		type: SchemaTypes.Boolean,
		default: false,
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

const User = models.user
	? (models.user as UserModel)
	: model<UserDocument, UserModel>("user", schema);

export default User;
