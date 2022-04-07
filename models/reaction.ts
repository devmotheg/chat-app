/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type { ReactionDocument, ReactionModel, ModifiedQuery } from "../types";
import { Message } from ".";

const schema = new Schema<ReactionDocument>({
	creator: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Reaction must belong to a user"],
	},
	message: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Reaction must belong to a message"],
	},
	emoji: {
		type: SchemaTypes.String,
		required: ["Reaction must have an emoji"],
		validate: {
			validator: function (emoji: string) {
				return (
					emoji in
					{
						likes: true,
						hearts: true,
						fires: true,
					}
				);
			},
			message: "Invalid emoji",
		},
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

schema.index({ creator: 1, message: 1, emoji: 1 }, { unique: true });

schema.post("save", async function (this: ReactionDocument) {
	const message = (await Message.findById(this.message)) as any;

	message[this.emoji as unknown as string]++;
	await message.save();
});

schema.pre(/delete/i, async function (this: ModifiedQuery, next) {
	this.reactions = await this.model.find(this._conditions);

	next();
});

schema.post(/delete/i, async function (this: ModifiedQuery) {
	for (const reaction of this.reactions) {
		const message = (await Message.findById(reaction.message)) as any;

		message[reaction.emoji]--;
		await message.save();
	}
});

const Reaction = models.reaction
	? (models.reaction as ReactionModel)
	: model<ReactionDocument, ReactionModel>("reaction", schema);

export default Reaction;
