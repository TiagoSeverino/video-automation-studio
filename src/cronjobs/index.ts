import cron from 'node-cron';
import {availableGames, getMatches} from '../esports';

cron.schedule('*/15 * * * *', () => {
	console.log(new Date().toUTCString());

	availableGames.map(async (game) => {
		const matches = await getMatches(game);

		if (matches.length > 0) {
			console.log(`${matches.length} matches found for ${game}`);
		}
	});
});
