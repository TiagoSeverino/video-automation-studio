import fetchMatches from './fetchMatches';

export default [
	{
		name: 'Fetch ESports matches',
		cron: '*/15 * * * *',
		job: fetchMatches,
	},
] as CronJob[];
