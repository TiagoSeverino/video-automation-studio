import {readFileSync} from 'fs';
import {availableGames, getMatches, getTags, getTitle} from '../esports';
import {categoryIds} from '../google/youtube';
import {renderMatchResult} from '../renderer';
import {dateToString} from '../utils/date';
import getChunks from '../utils/getChunks';
import handleYoutubeUpload from './handleYoutubeUpload';

export default async () => {
	availableGames.map(async (game) => {
		const matches = await getMatches(game);

		if (matches.length < 1) return;

		console.log(`${matches.length} matches found for ${game}`);

		const credentials = JSON.parse(
			readFileSync(`credentials.youtube.json`, 'utf8')
		);

		const chunks = getChunks(matches, 5);

		chunks.map(async (chunk, k) => {
			const suffix = chunks.length > 1 ? `#${k + 1}` : '';
			const path = await renderMatchResult(chunk);

			const videoData = {
				title: `${getTitle(game)} ${dateToString(
					new Date(),
					false
				)} ${suffix}`,
				description: chunk
					.map(
						(m) =>
							`${m.team1.name} ${m.team1.rounds} - ${m.team2.rounds} ${m.team2.name} at ${m.tournament}`
					)
					.join('\n'),
				tags: [
					...new Set(
						[
							...getTags(game),
							...chunk.map((m) => m.team1.name),
							...chunk.map((m) => m.team2.name),
							...chunk.map((m) => m.tournament || ''),
						].filter((t) => t.length > 0)
					),
				],
				path,
				categoryId: categoryIds.Gaming,
			};

			const youtubeResponse = await handleYoutubeUpload(
				videoData,
				credentials
			);
			console.log(
				`${videoData.title} - https://youtu.be/${youtubeResponse.id}`
			);
		});
	});
};
