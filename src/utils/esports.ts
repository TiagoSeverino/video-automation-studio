import {getCSGOMatches} from './csgo';
import {getValorantMatches} from './valorant';

export const getMatches = (
	game: 'csgo' | 'valorant'
): Promise<MatchResult[]> => {
	switch (game) {
		case 'csgo':
			return getCSGOMatches();
		case 'valorant':
			return getValorantMatches();
		default:
			return Promise.reject(new Error('Invalid game'));
	}
};
