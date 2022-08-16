import cron from 'node-cron';

cron.schedule('*/15 * * * *', () => {
	console.log(new Date().toUTCString());
	console.log('running a task every 15 minutes');
});
