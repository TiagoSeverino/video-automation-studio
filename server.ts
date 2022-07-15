import path from 'path';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia} from '@remotion/renderer';
import {getMatches} from './csgoData';

const start = async (startDate?: string, endDate?: string) => {
	if (!startDate || !endDate) {
		startDate = `${new Date().getFullYear()}-${(
			'0' + new Date().getMonth().toString()
		).slice(-2)}-${('0' + new Date().getDate().toString()).slice(-2)}`;
		endDate = startDate;
	}

	// The composition you want to render
	const compositionId = 'MatchResult';

	// You only have to do this once, you can reuse the bundle.
	const entry = './src/index';
	console.log('Creating a Webpack bundle of the video');
	const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
		// If you have a Webpack override, make sure to add it here
		webpackOverride: (config) => config,
	});

	// Extract all the compositions you have defined in your project
	// from the webpack bundle.
	const comps = await getCompositions(bundleLocation);

	// Select the composition you want to render.
	const composition = comps.find((c) => c.id === compositionId);

	// Ensure the composition exists
	if (!composition) {
		throw new Error(`No composition with the ID ${compositionId} found.
  Review "${entry}" for the correct ID.`);
	}

	console.log(`Fetching matches from ${startDate} to ${endDate}`);
	const matches = await getMatches(startDate, endDate);

	const chunkSize = 5;
	let currentPart = 0;
	const totalParts = Math.ceil(matches.length / chunkSize);

	if (matches.length > 0)
		for (let i = 0; i < matches.length; i += chunkSize) {
			currentPart++;
			const chunk = matches.slice(i, i + chunkSize);

			const outputLocation = `out/${compositionId} (${startDate} to ${endDate}) ${currentPart} of ${totalParts}.mp4`;
			console.log('Attempting to render:', outputLocation);
			await renderMedia({
				composition,
				serveUrl: bundleLocation,
				codec: 'h264',
				outputLocation,
				inputProps: {
					matches: chunk,
				},
			});

			console.log('Rendered:', outputLocation);
		}
	else console.log('No matches found.');

	console.log('Render done!');
};

start('2022-07-10', '2022-07-15');
