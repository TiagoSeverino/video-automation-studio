import HLTV from 'hltv';
import {dateToString} from '../utils/date';

export const getCSGOMatches = async (): Promise<MatchResult[]> => {
	const today = new Date();
	const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);

	const results = await HLTV.getResults({
		startDate: dateToString(yesterday),
		endDate: dateToString(today),
		delayBetweenPageRequests: 3000,
	});

	return results.map((r) => {
		return {
			id: `csgo-${r.id}`,
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

export const csgoTags = ['csgo'];
