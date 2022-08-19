import {Schema, model} from 'mongoose';

const TiktokAccount = new Schema<TiktokAccount>({
	name: {type: String, required: true},
	cookies: [{type: Schema.Types.Mixed, required: false}],
});

export default model<TiktokAccount>('TiktokAccount', TiktokAccount);
