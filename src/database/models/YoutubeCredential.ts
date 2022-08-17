import {Schema, model} from 'mongoose';

const youtubeCredentialSchema = new Schema<YoutubeCredential>(
	{
		access_token: {type: String, required: true},
		refresh_token: {type: String, required: true},
		scope: {type: String, required: true},
		token_type: {type: String, required: true},
		expiry_date: {type: Number, required: true},
	},
	{
		timestamps: true,
	}
);

export default model<YoutubeCredential>(
	'YoutubeCredential',
	youtubeCredentialSchema
);
