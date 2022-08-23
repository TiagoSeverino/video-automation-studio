import fetchMatches from './fetchMatches';
import {renderFullMatchVideo, renderVideo} from './renderVideo';
import uploadVideo from './uploadVideo';

export default [
	{
		name: 'Fetch ESports matches',
		cron: '*/15 * * * *',
		job: fetchMatches,
	},
	{
		name: 'Render ESports matches',
		cron: '25 */6 * * *',
		job: renderVideo,
	},
	{
		name: 'Render ESports matches',
		cron: '*/20 * * * *',
		job: renderFullMatchVideo,
	},
	{
		name: 'Upload ESports matches',
		cron: '*/30 * * * *',
		job: uploadVideo,
	},
] as CronJob[];
