import {startOfDay, endOfDay} from 'date-fns';

import {updateMatchResults} from '..';
import ESportsVideoData from '../../../database/models/ESportsVideoData';
import MatchResult from '../../../database/models/MatchResult';
import {availableESports} from '../../../utils/availableESports';
import log from '../../log';
import render from '../Video/render';

export const renderVideo = async (completeOnly?: boolean) => {
	for (const game of availableESports) {
		//Select matches not rendered
		const matchesNotRendered = await MatchResult.find({
			game,
			videoId: {$exists: false},
		});

		while (completeOnly && matchesNotRendered.length % 5 !== 0)
			matchesNotRendered.pop();

		if (matchesNotRendered.length === 0) continue;

		//Render matches
		log(`Rendering ${matchesNotRendered.length} matches for ${game}`);

		const videoDataCountToday = (
			await ESportsVideoData.find({
				createdAt: {
					$gte: startOfDay(new Date()),
					$lte: endOfDay(new Date()),
				},
				game,
			})
		).length;

		const videosData = await render(
			game,
			matchesNotRendered,
			videoDataCountToday
		);

		//Save VideoData to database
		videosData.map(async ({videoData, results}) => {
			const videoDataModel = await ESportsVideoData.create(videoData);

			await updateMatchResults(results);

			await Promise.all(
				results.map(async ({id}) => {
					const m = await MatchResult.findOne({id});

					if (!m) return;

					m.videoId = videoDataModel._id.toString();
					await m.save();
				})
			);
		});
	}
};

export const renderFullMatchVideo = () => renderVideo(true);
