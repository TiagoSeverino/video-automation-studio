import path from 'path';
import {writeFileSync} from 'fs';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia} from '@remotion/renderer';
import {v4 as uuidv4} from 'uuid';

import {MatchResult} from '../utils/csgo';

export const renderMatchResult = async (matches: MatchResult[]) => {
	const compositionId = 'MatchResult';

	const entry = './src/index.tsx';
	const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
		webpackOverride: (config) => config,
	});

	const composition = (await getCompositions(bundleLocation)).find(
		(c) => c.id === compositionId
	);

	if (!composition)
		throw new Error(`No composition with the ID ${compositionId} found.
  Review "${entry}" for the correct ID.`);

	const chunkSize = 5;
	const totalParts = Math.ceil(matches.length / chunkSize);

	if (matches.length > 0) {
		const chunks = [];
		for (let i = 0; i < matches.length; i += chunkSize) {
			chunks.push(matches.slice(i, i + chunkSize));
		}

		return await Promise.all(
			chunks.map(async (chunk, k) => {
				const outputLocation = `out/${compositionId}-${uuidv4()}-${
					k + 1
				}-of-${totalParts}`;

				writeFileSync(
					`${outputLocation}.txt`,
					chunk
						.map(
							(m) =>
								`${m.team1.name} ${m.team1.rounds} - ${m.team2.rounds} ${m.team2.name} at ${m.tournament}\n`
						)
						.join('')
				);

				await renderMedia({
					composition,
					serveUrl: bundleLocation,
					codec: 'h264',
					outputLocation: `${outputLocation}.mp4`,
					inputProps: {
						matches: chunk,
					},
				});

				return outputLocation;
			})
		);
	} else return [];
};
