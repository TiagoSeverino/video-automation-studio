import {Schema, model} from 'mongoose';

const youtubeCredentialStorageSchema = new Schema<YoutubeCredentialStorage>(
	{
		client_id: {type: String, required: true},
		client_secret: {type: String, required: true},
		tokens: [
			{
				access_token: {type: String, required: true},
				refresh_token: {type: String, required: true},
				scope: {type: String, required: true},
				token_type: {type: String, required: true},
				expiry_date: {type: Number, required: true},
			},
		],
	},
	{
		timestamps: true,
	}
);

export default model<YoutubeCredentialStorage>(
	'YoutubeCredentialStorage',
	youtubeCredentialStorageSchema
);
