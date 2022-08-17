import {availableESports, updateMatchResults} from '..';
import ESportsVideoData from '../../../database/models/ESportsVideoData';
import MatchResult from '../../../database/models/MatchResult';
import render from '../Video/render';

export default async () =>
	availableESports.map(async (game) => {
		//Select matches not rendered
		const matchesNotRendered = await MatchResult.find({
			game,
			videoId: {$exists: false},
		});

		//Render matches
		const videosData = await render(game, matchesNotRendered);

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
