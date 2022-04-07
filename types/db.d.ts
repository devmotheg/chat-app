/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { Query, Schema, Document, Model } from "mongoose";

type ModifiedQuery = Query<any, any> & {
	[index: string]: any;
};

interface UserSchema extends Schema {
	_s: Schema.Types.String;
	name: Schema.Types.String;
	image: Schema.Types.String;
	online: Schema.Types.Boolean;
	createdAt: Schema.Types.Date;
}

type UserDocument = UserSchema & Document;

type UserModel = Model<UserDocument>;

interface ChannelSchema extends Schema {
	creator: Schema.Types.ObjectId | UserDocument;
	name: Schema.Types.String;
	subscribers: Schema.Types.Number;
	createdAt: Schema.Types.Date;
}

interface ChannelDocument extends ChannelSchema, Document {
	subscriptions: SubscriptionDocument[];
}

type ChannelModel = Model<CHannelDocument>;

interface SubscriptionSchema extends Schema {
	user: Schema.Types.ObjectId | UserDocument;
	channel: Schema.Types.ObjectId | ChannelDocument;
	createdAt: Schema.Types.Date;
}

type SubscriptionDocument = SubscriptionSchema & Document;

type SubscriptionModel = Model<SubscriptionDocument>;

interface DirectSchema extends Schema {
	user1: Schema.Types.ObjectId | UserDocument;
	user2: Schema.Types.ObjectId | UserDocument;
	createdAt: Schema.Types.Date;
}

type DirectDocument = DirectSchema & Document;

type DirectModel = Model<DirectDocument>;

interface MessageSchema extends Schema {
	creator: Schema.Types.ObjectId | UserDocument;
	channel: Schema.Types.ObjectId | ChannelDocument;
	direct: Schema.Types.ObjectId | DirectDocument;
	global: Schema.Types.Boolean;
	text: Schema.Types.String;
	likes: Schema.Types.Number;
	hearts: Schema.Types.Number;
	fires: Schema.Types.Number;
	lastEditedAt: Schema.Types.Date;
	createdAt: Schema.Types.Date;
}

type MessageDocument = MessageSchema & Document;

type MessageModel = Model<MessageDocument>;

interface ReactionSchema extends Schema {
	creator: Schema.Types.ObjectId | UserDocument;
	message: Schema.Types.ObjectId | MessageDocument;
	emoji: Schema.Types.String;
	createdAt: Schema.Types.Date;
}

type ReactionDocument = ReactionSchema & Document;

type ReactionModel = Model<ReactionDocument>;

export {
	ModifiedQuery,
	UserDocument,
	UserModel,
	ChannelDocument,
	ChannelModel,
	SubscriptionDocument,
	SubscriptionModel,
	DirectDocument,
	DirectModel,
	MessageDocument,
	MessageModel,
	ReactionDocument,
	ReactionModel,
};
