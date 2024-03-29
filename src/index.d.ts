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
		tiktok?: {
			id: string;
		};
	};
}

interface ESportsVideoData extends VideoData {
	game: ESportsVideo;
}

interface MatchResult {
	id: string;
	team1: TeamData;
	team2: TeamData;
	tournament?: string;
	stars: number;
}

interface StoreMatchResult extends MatchResult {
	game: ESportsVideo;
	videoId?: string;
}

interface TeamData {
	name: string;
	logo?: string;
	rounds: number;
}

const availableESports = [
	'csgo',
	'valorant',
	'ssbu',
	'tekken7',
	'sf5',
	'mk11',
	'dbfz',
	'ggst',
	'sc6',
	'bh',
	'skullgirls',
	'ki',
	'mv',
	'dota2',
	'lol',
	'wildrift',
	'rainbowsix',
	'rocketleague',
	'overwatch',
	'halo',
	'callofduty',
] as const;

type ESportsVideo = typeof availableESports[number];

type VideoCompositions = 'ESportResult';

enum YoutubeCategoryIds {
	Gaming = '20',
}

interface CronJob {
	name: string;
	cron: string;
	job: () => any;
}

interface TiktokAccount {
	name: string;
	cookies: any[];
}

interface YoutubeAccount {
	name: string;
	cookies: any[];
}
