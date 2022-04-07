/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { Schema, SchemaTypes, models, model } from "mongoose";

import type {
	ModifiedQuery,
	SubscriptionDocument,
	SubscriptionModel,
} from "../types";
import { Channel } from ".";

const schema = new Schema<SubscriptionDocument>({
	user: {
		type: SchemaTypes.ObjectId,
		ref: "user",
		immutable: true,
		required: [true, "Subscription must belong to a user"],
	},
	channel: {
		type: SchemaTypes.ObjectId,
		ref: "channel",
		immutable: true,
		required: [true, "Subscription must belong to a channel"],
	},
	createdAt: {
		type: SchemaTypes.Date,
		default: Date.now,
		immutable: true,
	},
});

schema.index({ user: 1, channel: 1 }, { unique: true });

schema.post("save", async function (this: SubscriptionDocument) {
	const channel = await Channel.findById(this.channel);

	channel.subscribers++;
	await channel.save();
});

schema.pre(/delete/i, async function (this: ModifiedQuery, next) {
	this.subscriptions = await this.model.find(this._conditions);

	next();
});

schema.post(/delete/i, async function (this: ModifiedQuery) {
	for (const subscription of this.subscriptions) {
		const channel = await Channel.findById(subscription.channel);

		channel.subscribers--;
		await channel.save();
	}
});

const Subscription = models.subscription
	? (models.subscription as SubscriptionModel)
	: model<SubscriptionDocument, SubscriptionModel>("subscription", schema);

export default Subscription;
