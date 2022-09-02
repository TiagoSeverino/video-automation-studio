import MatchResult from '../../database/models/MatchResult';
import {logError} from '../log';
import getCSGOMatches from './api/csgo';
import getDashfightMatches from './api/dashfight';
import getValorantMatches from './api/valorant';
import getEGamersWorldMatches from './api/egamersworld';

export const getMatches = async (
	game: ESportsVideo
): Promise<MatchResult[]> => {
	try {
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
			case 'dota2':
			case 'lol':
			case 'wildrift':
			case 'rainbowsix':
			case 'rocketleague':
			case 'overwatch':
			case 'halo':
			case 'callofduty':
				return getEGamersWorldMatches(game);
			default:
				return Promise.reject(new Error('Invalid game'));
		}
	} catch (error) {
		logError(`Error getting ${game} matches`);
	}

	return Promise.all([]);
};

export const getYoutubeChannelName = (game: ESportsVideo): string => {
	switch (game) {
		case 'csgo':
			return 'Daily CSGO';
		case 'valorant':
			return 'Daily Valorant';
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
			return 'Daily Fights';
		case 'dota2':
			return 'Daily Dota';
		case 'lol':
			return 'Daily LoL';
		case 'wildrift':
			return 'Daily Wild Rift';
		case 'rainbowsix':
			return 'Daily R6S';
		case 'rocketleague':
			return 'Daily Rocket League';
		case 'overwatch':
			return 'Daily Overwatch';
		case 'halo':
			return 'Daily Halo';
		case 'callofduty':
			return 'Daily Call of Duty';
		default:
			return 'Daily ESports';
	}
};

export const getTitle = (game: ESportsVideo) => {
	switch (game) {
		case 'dota2':
			return 'Dota Results';
		case 'lol':
			return 'LoL Results';
		case 'callofduty':
			return 'CoD Results';
		case 'rainbowsix':
			return 'R6S Results';
		case 'rocketleague':
			return 'Rocket League Results';

		case 'halo':
		case 'valorant':
		case 'overwatch':
		case 'wildrift':
			return `${game.charAt(0).toUpperCase()}${game
				.toLowerCase()
				.slice(1)} Results`;

		default:
			return `${game.toUpperCase()} Results`;
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
