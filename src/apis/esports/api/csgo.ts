import HLTV from 'hltv';
import {dateToString} from '../../../utils/date';

const fixLogoUrl = (url: string) =>
	url.startsWith('/') ? `https://www.hltv.org${url}` : url;

export default async (): Promise<MatchResult[]> => {
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
				logo: fixLogoUrl(r.team1.logo),
				rounds: r.result.team1,
			},
			team2: {
				name: r.team2.name,
				logo: fixLogoUrl(r.team2.logo),
				rounds: r.result.team2,
			},
			tournament: r.event?.name,
			stars: r.stars,
		};
	});
};
