import {schedule} from 'node-cron';
import esportsJobs from '../apis/esports/cronjobs';
import {logError} from '../apis/log';

const jobs = [] as CronJob[];

jobs.push(...esportsJobs);

jobs.map(({cron, job, name}) => {
	schedule(cron, async () => {
		try {
			await job();
		} catch (error) {
			console.error(error);
			logError(`Error in ${name} cronjob`);
		}
	});
});
