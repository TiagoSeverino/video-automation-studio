import {Schema, model} from 'mongoose';

const YoutubeAccount = new Schema<YoutubeAccount>({
	name: {type: String, required: true},
	cookies: [{type: Schema.Types.Mixed, required: false}],
});

export default model<YoutubeAccount>('YoutubeAccount', YoutubeAccount);
