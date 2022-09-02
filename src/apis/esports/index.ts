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
			case 'fifa':
			case 'pubg':
			case 'hearthstone':
			case 'artifact':
			case 'heroesofthestorm':
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
		default:
			return 'Daily Fights';
	}
};

export const getTitle = (game: ESportsVideo) => {
	switch (game) {
		case 'csgo':
			return 'CSGO Results';
		case 'valorant':
			return 'Valorant Results';
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
