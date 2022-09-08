import {getMatches, updateMatchResults} from '..';
import MatchResult from '../../../database/models/MatchResult';
import {availableESports} from '../../../utils/availableESports';
import log, {logError} from '../../log';

export default () =>
	availableESports.map(async (game) => {
		try {
			//Find matches for the game
			const matches = await getMatches(game);

			const before = (await MatchResult.find({game})).length;

			//Store matches in the database
			await updateMatchResults(
				matches.map((match): StoreMatchResult => ({...match, game}))
			);

			const after = (await MatchResult.find({game})).length;

			if (after > before)
				log(`${after - before} matches found for ${game}`);
		} catch (e) {
			logError(`Error Fetching ${game}: ${e}`);
		}
	});
