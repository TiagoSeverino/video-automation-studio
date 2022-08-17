import MatchResult from '../../database/models/MatchResult';
import getCSGOMatches, {csgoTags} from './api/csgo';
import getDashfightMatches from './api/dashfight';
import getValorantMatches, {valorantTags} from './api/valorant';

export const availableESports = [
	'csgo',
	'valorant',
	'ssbu',
	'tekken7',
	'sf5',
	'mk11',
	'dbfz',
	'ggst',
	'sc6',
	'bh',
	'skullgirls',
	'ki',
	'mv',
] as ESportsVideo[];

export const getMatches = (game: ESportsVideo): Promise<MatchResult[]> => {
	switch (game) {
		case 'csgo':
			return getCSGOMatches();
		case 'valorant':
			return getValorantMatches();

		//Dashfight
		case 'ssbu':
		case 'tekken7':
		case 'sf5':
		case 'mk11':
		case 'dbfz':
		case 'ggst':
		case 'sc6':
		case 'bh':
		case 'skullgirls':
		case 'ki':
		case 'mv':
			return getDashfightMatches(game);
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
		default:
			return `${game.toUpperCase()} Match Results`;
	}
};

export const updateMatchResult = async (match: StoreMatchResult) =>
	MatchResult.updateOne(
		{
			id: match.id,
		},
		match,
		{
			upsert: true,
		}
	);

export const updateMatchResults = async (matches: StoreMatchResult[]) =>
	Promise.all(matches.map(updateMatchResult));
