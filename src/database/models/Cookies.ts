import {Schema, model} from 'mongoose';

const CookieSchema = new Schema<Cookie>({
	domain: {type: String, required: true},
	path: {type: String, required: true},
	path: {type: String, required: true},
	value: {type: String, required: true},
});

export default model<Cookie>('Cookie', CookieSchema);
