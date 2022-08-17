import {availableESports, getMatches} from '..';
import log from '../../log';

export default () =>
	availableESports.map(async (game) => {
		const matches = await getMatches(game);
		log(`${matches.length} matches found for ${game}`);
	});
