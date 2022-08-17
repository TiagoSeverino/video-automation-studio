import {Schema, model} from 'mongoose';

const youtubeOAuthTokenSchema = new Schema<YoutubeOAuthToken>(
	{
		client_id: {type: String, required: true},
		client_secret: {type: String, required: true},
	},
	{
		timestamps: true,
	}
);

export default model<YoutubeOAuthToken>(
	'YoutubeOAuthToken',
	youtubeOAuthTokenSchema
);
