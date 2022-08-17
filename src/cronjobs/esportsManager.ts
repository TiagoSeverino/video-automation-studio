import {availableESports, getMatches} from '../apis/esports';
import renderESportsResults from '../apis/esports/Video/render';
import log from '../apis/log';
import uploadVideo from '../utils/uploadVideo';

export default async () => {
	availableESports.map(async (game) => {
		const matches = await getMatches(game);
		log(`${matches.length} matches found for ${game}`);

		const videosData = await renderESportsResults(game, matches);

		videosData.map(async ({videoData, results}) => {
			uploadVideo(videoData);
		});
	});
};
