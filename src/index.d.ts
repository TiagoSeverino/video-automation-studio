import {availableESports} from './utils/availableESports';

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

type ESportsVideo = typeof availableESports[number];

type VideoCompositions = 'ESportResult';

interface YoutubeCredential {
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

interface YoutubeCredentialStorage extends YoutubeOAuthToken {
	tokens: YoutubeCrential[];
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
