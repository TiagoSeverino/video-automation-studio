export interface EGamersWorldApiResponse {
	count: number;
	finishedMatches?: FinishedMatch[];
	game: Game;
	jsonBreadcrumb: JsonBreadcrumb[];
	seo: Seo;
}

interface FinishedMatch {
	_id: string;
	teams: any[];
	tip_id: any[];
	game_slug: string;
	status: string;
	start_date: string;
	home_team_odd: number;
	away_team_odd: number;
	home_team_id: string;
	home_team_name: string;
	home_team_country_code: string;
	home_team_logo: string;
	away_team_id: string;
	away_team_name: string;
	away_team_country_code: string;
	away_team_logo: string;
	home_team_score: string;
	away_team_score: string;
	home_win: string;
	match_draw: string;
	isIndividual?: boolean;
	tournament_id: string;
	tournament: string;
	best_type: string;
	slug: string;
	createdAt: string;
	image: string;
	forfeit?: boolean;
	is_live?: boolean;
	is_pubg?: boolean;
	match_of_the_day?: boolean;
	no_time?: boolean;
	redirect?: boolean;
	title?: string;
	winrate?: Winrate;
	tournament_logo: string;
	tournament_nlt: boolean;
	comments: number;
	hero?: Hero[];
}

interface Winrate {
	home_team: number;
	away_team: number;
}

interface Hero {
	away_team: AwayTeam;
	home_team: HomeTeam;
	map: number;
	winrate_tip: any;
	date: string;
	home_win: boolean;
}

interface AwayTeam {
	score: number;
	picks: Pick[];
	bans: Ban[];
	players: Player[];
}

interface Pick {
	hero_id: number;
}

interface Ban {
	hero_id: number;
}

interface Player {
	steam_id: number;
	hero_id: number;
	player: string;
	matchCount: number;
	winCount: number;
	kills: number;
	death: number;
	gold: number;
	net_worth: number;
	assists: number;
	gold_per_min: number;
	xp_per_min: number;
	last_hits: number;
	denies: number;
	item0: number;
	item1: number;
	item2: number;
	item3: number;
	item4: number;
	item5: number;
}

interface HomeTeam {
	score: number;
	picks: Pick2[];
	bans: Ban2[];
	players: Player2[];
}

interface Pick2 {
	hero_id: number;
}

interface Ban2 {
	hero_id: number;
}

interface Player2 {
	steam_id: number;
	hero_id: number;
	player: string;
	matchCount: number;
	winCount: number;
	kills: number;
	death: number;
	gold: number;
	net_worth: number;
	assists: number;
	gold_per_min: number;
	xp_per_min: number;
	last_hits: number;
	denies: number;
	item0: number;
	item1: number;
	item2: number;
	item3: number;
	item4: number;
	item5: number;
}

interface Game {
	_id: string;
	image: string;
	name: string;
	slug: string;
	event_prize: number;
	event_prize_factor: number;
	menu_name: string;
}

interface JsonBreadcrumb {
	link: string;
	ankor: string;
}

interface Seo {
	_id: string;
	updatedAt: string;
	createdAt: string;
	slug: string;
	lang: string;
	is_template: string[];
	linkTags: LinkTag[];
	metaTags: MetaTag[];
	content: string;
	h1: string;
	description: string;
	title: string;
	__v: number;
	breadcrumb: string;
	breadcrumb2: string;
	faq: any[];
	json_content: JsonContent;
	navigation: string;
	site: string;
	image: string;
	url: string;
	jsonBreadcrumb: JsonBreadcrumb2[];
}

interface LinkTag {
	property: string;
	href: string;
	hreflang?: string;
}

interface MetaTag {
	property: string;
	content: string;
	noEscape?: boolean;
}

interface JsonContent {
	tr: string;
	ph: string;
	pl: string;
	es: string;
	pt: string;
	de: string;
	ru: string;
	en_GB: string;
}

interface JsonBreadcrumb2 {
	link: string;
	ankor: string;
}
