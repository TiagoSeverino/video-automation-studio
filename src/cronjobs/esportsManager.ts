import {availableESports, getMatches} from '../apis/esports';
import renderESportsResults from '../apis/esports/render';
import log from '../apis/log';
import uploadVideo from '../utils/uploadVideo';

export default async () => {
	availableESports.map(async (game) => {
		const matches = await getMatches(game);
		const videosData = await renderESportsResults(game, matches);

		videosData.map(async (videoData) => {
			log(`${matches.length} matches found for ${game}`);

			uploadVideo(videoData);
		});
	});
};
