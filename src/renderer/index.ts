import path from 'path';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia} from '@remotion/renderer';
import {v4 as uuidv4} from 'uuid';

export const renderComposition = async (
	compositionId: VideoCompositions,
	inputProps: object
) => {
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

	const outputLocation = `out/${compositionId}-${uuidv4()}.mp4`;

	await renderMedia({
		composition,
		serveUrl: bundleLocation,
		codec: 'h264',
		outputLocation,
		inputProps,
	});

	return outputLocation;
};
