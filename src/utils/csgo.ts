import HLTV from 'hltv/src';

export interface MatchResult {
	team1: {
		name: string;
		logo: string;
		rounds: number;
	};
	team2: {
		name: string;
		logo: string;
		rounds: number;
	};
	tournament: string;
	stars: number;
}

const getResults = async (startDate: string, endDate: string) => {
	return HLTV.getResults({
		startDate,
		endDate,
		stars: 1,
		delayBetweenPageRequests: 3000,
	});
};

const getMatch = async (id: number) => {
	return HLTV.getMatch({
		id,
	});
};

const dateToString = (date: Date) =>
	`${date.getFullYear()}-${('0' + (date.getMonth() + 1).toString()).slice(
		-2
	)}-${('0' + date.getDate().toString()).slice(-2)}`;

export const getMatches = async (
	startDate: Date,
	endDate: Date
): Promise<MatchResult[]> => {
	return Promise.all(
		(await getResults(dateToString(startDate), dateToString(endDate))).map(
			async (r) => {
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
			}
		)
	);
};
