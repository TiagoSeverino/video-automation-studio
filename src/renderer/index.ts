import path from 'path';
import {writeFileSync} from 'fs';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia} from '@remotion/renderer';
import {v4 as uuidv4} from 'uuid';

export const renderMatchResult = async (matches: MatchResult[]) => {
	if (matches.length == 0 || matches.length > 5)
		throw new Error('Limit of 5 Matches');

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

	const outputLocation = `out/${compositionId}-${uuidv4()}`;

	writeFileSync(
		`${outputLocation}.txt`,
		matches
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
			matches,
		},
	});

	return outputLocation;
};
