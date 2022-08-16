interface MatchResult {
	id: string;
	team1: TeamData;
	team2: TeamData;
	tournament?: string;
	stars: number;
}

interface TeamData {
	name: string;
	logo?: string;
	rounds: number;
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
