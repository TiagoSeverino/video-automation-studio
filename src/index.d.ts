interface MatchResult {
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
	tournament?: string;
	stars: number;
}

type ESportsVideo =
	| 'csgo'
	| 'valorant'
	| 'ssbu'
	| 'tekken7'
	| 'sf5'
	| 'mk11'
	| 'dbfz'
	| 'ggst'
	| 'sc6'
	| 'bh'
	| 'skullgirls'
	| 'ki'
	| 'mv';
