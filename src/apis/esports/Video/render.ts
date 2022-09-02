import {getTitle} from '../';
import renderComposition from '../../../utils/renderComposition';
import {dateToString} from '../../../utils/date';
import getChunks from '../../../utils/getChunks';

interface VideoDetail {
	videoData: ESportsVideoData;
	results: StoreMatchResult[];
}

export default async (
	game: ESportsVideo,
	matches: StoreMatchResult[],
	count = 0
): Promise<VideoDetail[]> => {
	const chunks = getChunks(matches, 5);

	const videosDetails = [] as VideoDetail[];

	for (const chunk of chunks) {
		const currentCount =
			count > 0 || chunks.length > 1
				? ` #${count + videosDetails.length + 1} `
				: ' ';
		const path = await renderComposition('ESportResult', {
			matches: chunk,
		});

		videosDetails.push({
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
							game,
							...chunk.map((m) => m.team1.name),
							...chunk.map((m) => m.team2.name),
							...chunk.map((m) => m.tournament || ''),
						].filter((t) => t.length > 0)
					),
				],
				path,
				categoryId: YoutubeCategoryIds.Gaming,
				game,
			},
			results: chunk,
		});
	}

	return videosDetails;
};
