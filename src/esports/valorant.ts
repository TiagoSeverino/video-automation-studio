import axios from 'axios';
import * as cheerio from 'cheerio';

const fixLogoUrl = (url: string) =>
	url.startsWith('//') ? `https:${url}` : url;

export const getValorantMatches = async (): Promise<MatchResult[]> => {
	const res = await axios.get('https://www.vlr.gg/matches/results');
	const $ = cheerio.load(res.data);

	const results = $('.wf-card').slice(1);

	const matchResults = [] as cheerio.Element[];

	$(results)
		.toArray()
		.map((result) => {
			$(result)
				.find('a')
				.toArray()
				.map((a) => matchResults.push(a));
		});

	return Promise.all(
		matchResults.map(async (match) => {
			const matchUrl = $(match).attr('href') || '';

			let team1Logo =
				'https://www.hltv.org/img/static/team/placeholder.svg';
			let team2Logo =
				'https://www.hltv.org/img/static/team/placeholder.svg';

			if (matchUrl.length > 0) {
				const matchPage = await axios.get(
					`https://www.vlr.gg${matchUrl}`
				);
				const $$ = cheerio.load(matchPage.data);

				team1Logo =
					$$('.match-header-link img').first().attr('src') || '';

				team2Logo =
					$$('.match-header-link img').last().attr('src') || '';
			}

			const team1 = {
				name: $(match)
					.find('.match-item-vs-team-name')
					.first()
					.text()
					.trim(),
				logo: fixLogoUrl(team1Logo),
				rounds: parseInt(
					$(match).find('.match-item-vs-team-score').first().text()
				),
			};

			const team2 = {
				name: $(match)
					.find('.match-item-vs-team-name')
					.last()
					.text()
					.trim(),
				logo: fixLogoUrl(team2Logo),
				rounds: parseInt(
					$(match).find('.match-item-vs-team-score').last().text()
				),
			};

			const event = $(match)
				.find('.match-item-event')
				.children()
				.text()
				.trim();

			const [type, bracket] = event.toLowerCase().split('–');

			let stars = 1;

			stars += type.includes('main event') ? 2 : 0;
			stars += type.includes('qualifier') ? 1 : 0;
			stars += type.includes('valorant regional leagues') ? 1 : 0;

			stars += bracket.includes('grand final') ? 1 : 0;

			const tournament = $(match)
				.find('.match-item-event')
				.children()
				.remove()
				.end()
				.text()
				.trim();

			return {
				id: `valorant-${matchUrl.split('/')[1]}`,
				team1,
				team2,
				tournament,
				stars,
			};
		})
	);
};

export const valorantTags = ['valorant'];
