import {readFileSync} from 'fs';
import {availableESports, getMatches} from '../apis/esports';
import renderESportsResults from '../apis/esports/render';
import uploadYoutube from '../apis/google/youtube';
import log from '../apis/log';

export default async () => {
	availableESports.map(async (game) => {
		const matches = await getMatches(game);
		const videosData = await renderESportsResults(game, matches);

		videosData.map(async (videoData) => {
			log(`${matches.length} matches found for ${game}`);

			const credentials = JSON.parse(
				readFileSync(`credentials.youtube.json`, 'utf8')
			);

			const youtubeResponse = await uploadYoutube(videoData, credentials);
			log(`${videoData.title} - https://youtu.be/${youtubeResponse.id}`);
		});
	});
};
