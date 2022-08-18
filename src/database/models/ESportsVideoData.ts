import {Schema, model} from 'mongoose';

const ESportsVideoDataSchema = new Schema<ESportsVideoData>(
	{
		path: {type: String, required: true},
		title: {type: String, required: true},
		description: {type: String, required: true},
		tags: [{type: String, required: true}],
		thumbnail: {type: String, required: false},
		categoryId: {type: String, required: true},
		platforms: {
			youtube: {
				id: {type: String, required: false},
			},
			tiktok: {
				id: {type: String, required: false},
			},
		},
		game: {type: String, required: true},
	},
	{
		timestamps: true,
	}
);

export default model<ESportsVideoData>(
	'ESportsVideoData',
	ESportsVideoDataSchema
);
