import cron from 'node-cron';
import esportsManager from './esportsManager';

cron.schedule('0 */8 * * *', () => {
	console.log(new Date().toUTCString());
	esportsManager();
});
