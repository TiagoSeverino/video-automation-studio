import cron from 'node-cron';
import fetchESportsResultsAndUpload from '../services/fetchESportsResultsAndUpload';

cron.schedule('0 */8 * * *', () => {
	console.log(new Date().toUTCString());
	fetchESportsResultsAndUpload();
});
