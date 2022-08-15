import {csgoTags, getCSGOMatches} from './csgo';
import {getSF5Matches} from './sf5';
import {getValorantMatches, valorantTags} from './valorant';

export const getMatches = (game: ESportsVideo): Promise<MatchResult[]> => {
	switch (game) {
		case 'csgo':
			return getCSGOMatches();
		case 'valorant':
			return getValorantMatches();
		case 'sf5':
			return getSF5Matches();
		default:
			return Promise.reject(new Error('Invalid game'));
	}
};

export const getTags = (game: ESportsVideo) => {
	switch (game) {
		case 'csgo':
			return csgoTags;
		case 'valorant':
			return valorantTags;
		default:
			return [];
	}
};

export const getTitle = (game: ESportsVideo) => {
	switch (game) {
		case 'csgo':
			return 'CSGO Match Results';
		case 'valorant':
			return 'Valorant Match Results';
		case 'sf5':
			return 'SF5 Match Results';
		default:
			return 'Match Results';
	}
};
