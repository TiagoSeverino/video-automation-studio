import fetchMatches from './fetchMatches';
import renderVideo from './renderVideo';

export default [
	{
		name: 'Fetch ESports matches',
		cron: '*/15 * * * *',
		job: fetchMatches,
	},
	{
		name: 'Render ESports matches',
		cron: '*/1 * * * *',
		job: renderVideo,
	},
] as CronJob[];
