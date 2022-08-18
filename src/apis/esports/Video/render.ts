import {getTags, getTitle} from '../';
import {categoryIds} from '../../google/youtube';
import renderComposition from '../../../utils/renderComposition';
import {dateToString} from '../../../utils/date';
import getChunks from '../../../utils/getChunks';

export default async (
	game: ESportsVideo,
	matches: StoreMatchResult[],
	count = 0
): Promise<{videoData: ESportsVideoData; results: StoreMatchResult[]}[]> => {
	const chunks = getChunks(matches, 5);

	return Promise.all(
		chunks.map(async (chunk, k) => {
			const currentCount =
				count > 0 || chunks.length > 1 ? ` #${count + k + 1} ` : ' ';
			const path = await renderComposition('ESportResult', {
				matches: chunk,
			});

			return {
				videoData: {
					title: `${getTitle(game)}${currentCount}${dateToString(
						new Date(),
						false
					)}`,
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
					game,
				} as ESportsVideoData,
				results: chunk,
			};
		})
	);
};
