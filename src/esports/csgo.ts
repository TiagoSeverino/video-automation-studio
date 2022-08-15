import HLTV from 'hltv';
import {dateToString} from '../utils/date';

export const getCSGOMatches = async (): Promise<MatchResult[]> => {
	const date = dateToString(new Date());

	const results = await HLTV.getResults({
		startDate: date,
		endDate: date,
		stars: 1,
		delayBetweenPageRequests: 3000,
	});

	return results.map((r) => {
		return {
			team1: {
				name: r.team1.name,
				logo: r.team1.logo,
				rounds: r.result.team1,
			},
			team2: {
				name: r.team2.name,
				logo: r.team2.logo,
				rounds: r.result.team2,
			},
			tournament: r.event?.name,
			stars: r.stars,
		};
	});
};

export const csgoTags = [
	'csgo',
	'counter',
	'strike',
	'counterstrike',
	'counter-stike',
	'match',
	'result',
	'hltv',
];
