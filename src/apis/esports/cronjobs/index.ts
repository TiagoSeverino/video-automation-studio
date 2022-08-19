import fetchMatches from './fetchMatches';
import renderVideo from './renderVideo';
import uploadVideo from './uploadVideo';

export default [
	{
		name: 'Fetch ESports matches',
		cron: '0 * * * *',
		job: fetchMatches,
	},
	{
		name: 'Render ESports matches',
		cron: '15 */6 * * *',
		job: renderVideo,
	},
	{
		name: 'Upload ESports matches',
		cron: '30 * * * *',
		job: uploadVideo,
	},
] as CronJob[];
