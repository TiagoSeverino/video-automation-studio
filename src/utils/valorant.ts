import axios from 'axios';
import * as cheerio from 'cheerio';

const fixLogoUrl = (url: string) =>
	url.startsWith('//') ? `https:${url}` : url;

export const getValorantMatches = async (): Promise<MatchResult[]> => {
	const res = await axios.get('https://www.vlr.gg/matches/results');
	const $ = cheerio.load(res.data);

	const results = $('.wf-card')[1];

	const label = $('#wrapper .wf-label .wf-tag')
		.first()
		.text()
		.trim()
		.toLowerCase();

	if (label !== 'today') return [];

	return Promise.all(
		$(results)
			.find('a')
			.toArray()
			.map(async (match) => {
				const matchPage = await axios.get(
					`https://www.vlr.gg${$(match).attr('href')}`
				);
				const $$ = cheerio.load(matchPage.data);

				const team1Logo =
					$$('.match-header-link img').first().attr('src') || '';

				const team2Logo =
					$$('.match-header-link img').last().attr('src') || '';

				const team1 = {
					name: $(match)
						.find('.match-item-vs-team-name')
						.first()
						.text()
						.trim(),
					logo: fixLogoUrl(team1Logo),
					rounds: parseInt(
						$(match)
							.find('.match-item-vs-team-score')
							.first()
							.text()
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
					team1,
					team2,
					tournament,
					stars,
				};
			})
	);
};
