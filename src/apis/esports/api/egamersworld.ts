import axios from 'axios';
import {EGamersWorldApiResponse} from './egamersworld.d';

const fixLogoUrl = (url: string) =>
	url.startsWith('/') ? `https://egamersworld.com${url}` : url;

const xcustomeheader = {
	dota2: '45537a23c610a6b3335dd4b753fcc72c',
	//counterstrike: '29fd8e6b0d1d982c81462d35fce5937c',
	lol: 'fafafe9656121d0eebed3939362bbe89',
	//valorant: 'a7c0b88ebaba653312644374d963a520',
	wildrift: '44455b677eae62b1cc9196634a8975d7',
	rainbowsix: '7d4f96ad7d847f1dd86e35a48b50bde8',
	rocketleague: 'e25f43835168a5f376d43719bb49cf76',
	overwatch: 'a7b429a1b30593f5a616e6fe0bc00f05',
	fifa: '1505890fa2e585301d9c316457370591',
	pubg: 'e4d7e034180d19abc7dc0b92a092d743',
	hearthstone: '8be213cb2f641b0133ec24f4c46a9854',
	artifact: 'f562eeda047390fcfe46d7fc7e437b23',
	heroesofthestorm: '5d7b80832a4b7f60023a28fdb58d1286',
	halo: '69145c326a0655796f1a9be2690ba21f',
	callofduty: '25ba034587f7668f150aa5820671c9f6',
};

export default async (
	discipline: keyof typeof xcustomeheader
): Promise<MatchResult[]> => {
	const res = (await (
		await axios.get(
			`https://api.egamersworld.com/${discipline}/matches/history?lang=en`,
			{
				headers: {
					referer: 'https://egamersworld.com/',
					'x-customheader': xcustomeheader[discipline],
				},
			}
		)
	).data) as EGamersWorldApiResponse;

	return (
		(res.finishedMatches
			?.map((match) => {
				try {
					return {
						id: `${discipline}-${match._id}`,
						tournament: match.tournament,
						team1: {
							name: match.home_team_name,
							logo: fixLogoUrl(match.home_team_logo),
							rounds: parseInt(match.home_team_score),
						},
						team2: {
							name: match.away_team_name,
							logo: fixLogoUrl(match.away_team_logo),
							rounds: parseInt(match.away_team_score),
						},
						stars: 0,
					};
				} catch {
					return null;
				}
			})
			.filter((m) => m != null) as MatchResult[]) || []
	);
};
