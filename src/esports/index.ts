import MatchResult from '../database/models/MatchResult';
import {csgoTags, getCSGOMatches} from './csgo';
import {getDashfightMatches} from './dashfight';
import {getValorantMatches, valorantTags} from './valorant';

export const availableGames = [
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

export const getMatches = async (
	game: ESportsVideo
): Promise<MatchResult[]> => {
	const matches = await getMatch(game);

	const notRendered = (
		await Promise.all(
			matches.map(async (match) => {
				const rendered = await MatchResult.findOne({
					where: {
						matchId: match.id,
					},
				});

				if (rendered?.id) return false;
				else return match;
			})
		)
	).filter((m) => m !== false) as MatchResult[];

	await Promise.all(
		notRendered.map(async (match) => {
			await MatchResult.create(match);
		})
	);

	return notRendered;
};

const getMatch = (game: ESportsVideo): Promise<MatchResult[]> => {
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
