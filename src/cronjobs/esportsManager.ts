import {readFileSync} from 'fs';
import {availableESports, getMatches} from '../apis/esports';
import renderESportsResults from '../apis/esports/render';
import uploadYoutube from '../google/youtube';

export default async () => {
	availableESports.map(async (game) => {
		const matches = await getMatches(game);
		const videosData = await renderESportsResults(game, matches);

		videosData.map(async (videoData) => {
			console.log(`${matches.length} matches found for ${game}`);

			const credentials = JSON.parse(
				readFileSync(`credentials.youtube.json`, 'utf8')
			);

			const youtubeResponse = await uploadYoutube(videoData, credentials);
			console.log(
				`${videoData.title} - https://youtu.be/${youtubeResponse.id}`
			);
		});
	});
};
