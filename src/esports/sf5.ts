import axios from 'axios';
import * as cheerio from 'cheerio';

const fixLogoUrl = (url: string) =>
	url.startsWith('/') ? `https://dashfight.com${url}` : url;

export const getSF5Matches = async (): Promise<MatchResult[]> => {
	const res = await axios.get('https://dashfight.com/sf5/matches');
	const $ = cheerio.load(res.data, {
		recognizeSelfClosing: true,
	});

	const matchList = $(`[class^="MatchList_block"]`).first();

	const tba = $(matchList).find('h3').first().text().trim().toUpperCase();

	if (tba !== 'TBA') return [];

	return Promise.all(
		$(matchList)
			.find('[class^="MatchDetails_grid"]')
			.toArray()
			.map(async (grid) => {
				const matchBlock = $(grid).prev();

				const matchPage = await axios.get(
					`https://dashfight.com${$(matchBlock)
						.find('div a')
						.first()
						.attr('href')}`
				);

				const $$ = cheerio.load(matchPage.data, {
					recognizeSelfClosing: true,
				});

				return {
					team1: {
						name: $(matchBlock)
							.find(`[class^="PlayerLink_name"]`)
							.first()
							.text()
							.trim(),
						rounds: parseInt(
							$(grid)
								.find(`[class^="CardView_score"]`)
								.first()
								.text()
								.trim()
						),
						logo: fixLogoUrl(
							$$('[class^="PlayersCard_avatar"] img')
								.first()
								.attr('src') || ''
						),
					},
					team2: {
						name: $(matchBlock)
							.find(`[class^="PlayerLink_name"]`)
							.last()
							.text()
							.trim(),
						rounds: parseInt(
							$(grid)
								.find(`[class^="CardView_score"]`)
								.last()
								.text()
								.trim()
						),
						logo: fixLogoUrl(
							$$('[class^="PlayersCard_avatar"] img')
								.last()
								.attr('src') || ''
						),
					},
					tournament: $$('meta[content="4"]').prev().text().trim(),
					stars: 0,
				} as MatchResult;
			})
	);
};
