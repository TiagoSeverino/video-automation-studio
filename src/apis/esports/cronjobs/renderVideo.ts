import {startOfDay, endOfDay} from 'date-fns';

import {availableESports, updateMatchResults} from '..';
import ESportsVideoData from '../../../database/models/ESportsVideoData';
import MatchResult from '../../../database/models/MatchResult';
import log from '../../log';

export const renderVideo = (completeOnly?: boolean) =>
	availableESports.map(async (game) => {
		//Select matches not rendered
		const matchesNotRendered = await MatchResult.find({
			game,
			videoId: {$exists: false},
		});

		if (matchesNotRendered.length === 0) return;

		while (completeOnly && matchesNotRendered.length % 5 !== 0)
			matchesNotRendered.pop();

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
	});

export const renderFullMatchVideo = () => renderVideo(true);
