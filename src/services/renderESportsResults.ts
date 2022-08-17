import {getTags, getTitle} from '../apis/esports';
import {categoryIds} from '../google/youtube';
import {renderMatchResult} from '../renderer';
import {dateToString} from '../utils/date';
import getChunks from '../utils/getChunks';

export default async (
	game: ESportsVideo,
	matches: MatchResult[]
): Promise<VideoData[]> => {
	const chunks = getChunks(matches, 5);

	return Promise.all(
		chunks.map(async (chunk, k) => {
			const suffix = chunks.length > 1 ? `#${k + 1}` : '';
			const path = await renderMatchResult(chunk);

			return {
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
			} as VideoData;
		})
	);
};
