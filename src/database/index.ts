import mongoose from 'mongoose';
import {logError} from '../apis/log';

mongoose
	.connect(process.env.MONGO_URI!)
	.then(() => {
		console.log('MongoDB connected');
	})
	.catch(logError);
