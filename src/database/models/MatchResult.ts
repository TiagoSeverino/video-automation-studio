import {Schema, model, connect} from 'mongoose';

const matchResultSchema = new Schema<MatchResult>({
	id: {type: String, required: true},
	team1: {
		name: {type: String, required: true},
		logo: {type: String, required: true},
		rounds: {type: Number, required: true},
	},
	team2: {
		name: {type: String, required: true},
		logo: {type: String, required: true},
		rounds: {type: Number, required: true},
	},
	tournament: {type: String, required: false},
	stars: {type: Number, required: true},
});

export default model<MatchResult>('MatchResult', matchResultSchema);
