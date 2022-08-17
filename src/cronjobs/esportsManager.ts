import {availableESports, getMatches} from '../apis/esports';
import renderESportsResults from '../apis/esports/render';
import uploadYoutube from '../apis/google/youtube';
import log from '../apis/log';
import getYoutubeCredentials from '../utils/getYoutubeCredentials';

export default async () => {
	availableESports.map(async (game) => {
		const matches = await getMatches(game);
		const videosData = await renderESportsResults(game, matches);

		videosData.map(async (videoData) => {
			log(`${matches.length} matches found for ${game}`);

			const youtubeCredentials = await getYoutubeCredentials();

			if (youtubeCredentials) {
				videoData = await uploadYoutube(videoData, youtubeCredentials);
				log(
					`${videoData.title} - https://youtu.be/${
						videoData.platforms!.youtube!.id
					}`
				);
			}
		});
	});
};
