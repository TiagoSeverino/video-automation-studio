interface VideoData {
	path: string;
	title: string;
	description: string;
	tags: string[];
	thumbnail?: string;
	categoryId: string;
	platforms?: {
		youtube?: {
			id: string;
		};
	};
}

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

type VideoCompositions = 'ESportResult';

interface YoutubeCredentials {
	access_token: string;
	refresh_token: string;
	scope: string;
	token_type: string;
	expiry_date: number;
}

interface YoutubeOAuthToken {
	client_id: string;
	client_secret: string;
}
