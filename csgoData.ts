import {HLTV} from 'hltv';

const getResults = async (startDate: string, endDate: string) => {
	return HLTV.getResults({
		startDate,
		endDate,
		stars: 1,
	});
};

const getMatch = async (id: number) => {
	return HLTV.getMatch({
		id,
	});
};

export const getMatches = async (startDate: string, endDate: string) => {
	return Promise.all(
		(await getResults(startDate, endDate)).map(async (r) => {
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
				tournament: (await getMatch(r.id)).event.name,
				stars: r.stars,
			};
		})
	);
};
