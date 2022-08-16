import axios from 'axios';
import {dateToString} from '../utils/date';
import {DashfightApiResponse} from './dashfight.d';

const fixLogoUrl = (url: string) =>
	url.startsWith('/') ? `https://dashfight.com${url}` : url;

export const getDashfightMatches = async (
	discipline: string
): Promise<MatchResult[]> => {
	const res = (await (
		await axios.post('https://api.dashfight.com/', {
			operationName: 'matches',
			variables: {
				withPaginationInfo: true,
				withCount: false,
				filters: {
					status: 'finished',
					discipline: [discipline],
				},
				sort: [
					{
						by: 'startedAt',
						direction: 'DESC',
					},
				],
				pagination: {
					limit: 200,
					offset: 0,
				},
				any: false,
			},
			query: 'query matches($filters: MatchFiltersInput, $sort: [SortInputType!], $pagination: PaginationInputType!, $withPaginationInfo: Boolean = true, $withCount: Boolean = false, $any: Boolean) {\n  matches(filters: $filters, sort: $sort, pagination: $pagination, any: $any) {\n    items {\n      id\n      status\n      bestOf\n      score\n      startedAt\n      videoRecords {\n        id\n        type\n        link\n        __typename\n      }\n      stage {\n        id\n        name\n        tournament {\n          id\n          name\n          event {\n            id\n            name\n            complex\n            __typename\n          }\n          disciplineInstance {\n            name\n            logo {\n              original\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      participants {\n        id\n        side\n        player {\n          id\n          country {\n            code\n            __typename\n          }\n          nickname\n          image {\n            original\n            __typename\n          }\n          published\n          __typename\n        }\n        __typename\n      }\n      vote {\n        id\n        __typename\n      }\n      techwin\n      displayTime\n      __typename\n    }\n    offset\n    hasMore @include(if: $withPaginationInfo)\n    count @include(if: $withCount)\n    __typename\n  }\n}',
		})
	).data) as DashfightApiResponse;

	return res.data.matches.items
		.filter(
			(m) =>
				m.startedAt != null &&
				m.startedAt.startsWith(dateToString(new Date()))
		)
		.map((match) => {
			return {
				tournament: match.stage.tournament.name,
				event: match.stage.tournament.event.name,
				team1: {
					name: match.participants[0].player.nickname,
					logo: fixLogoUrl(
						match.participants[0].player.image?.original || ''
					),
					rounds: match.score[0],
				},
				team2: {
					name: match.participants[1].player.nickname,
					logo: fixLogoUrl(
						match.participants[1].player.image?.original || ''
					),
					rounds: match.score[1],
				},
				stars: 0,
			};
		});
};
