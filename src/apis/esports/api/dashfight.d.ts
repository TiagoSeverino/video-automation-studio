export interface DashfightApiResponse {
	data: Data;
	extensions: Extensions;
}

interface Data {
	matches: Matches;
}

interface Matches {
	items: Item[];
	offset: number;
	hasMore: boolean;
	__typename: string;
}

interface Item {
	id: string;
	status: string;
	bestOf: number;
	score: number[];
	startedAt?: string;
	videoRecords: VideoRecord[];
	stage: Stage;
	participants: Participant[];
	vote?: Vote;
	techwin: boolean;
	displayTime: boolean;
	__typename: string;
}

interface VideoRecord {
	id: string;
	type: string;
	link: string;
	__typename: string;
}

interface Stage {
	id: string;
	name: string;
	tournament: Tournament;
	__typename: string;
}

interface Tournament {
	id: string;
	name: string;
	event: Event;
	disciplineInstance: DisciplineInstance;
	__typename: string;
}

interface Event {
	id: string;
	name: string;
	complex: boolean;
	__typename: string;
}

interface DisciplineInstance {
	name: string;
	logo: Logo;
	__typename: string;
}

interface Logo {
	original: string;
	__typename: string;
}

interface Participant {
	id: string;
	side: number;
	player: Player;
	__typename: string;
}

interface Player {
	id: string;
	country?: Country;
	nickname: string;
	image?: Image;
	published: boolean;
	__typename: string;
}

interface Country {
	code: string;
	__typename: string;
}

interface Image {
	original: string;
	__typename: string;
}

interface Vote {
	id: string;
	__typename: string;
}

interface Extensions {
	requestId: string;
	cacheControl: CacheControl;
}

interface CacheControl {
	version: number;
	hints: Hint[];
}

interface Hint {
	path: any[];
	maxAge: number;
	root?: boolean;
	defaultMaxAge?: boolean;
}
