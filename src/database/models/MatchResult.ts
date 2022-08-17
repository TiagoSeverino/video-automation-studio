import {Schema, model} from 'mongoose';

const team = {
	name: {type: String, required: true},
	logo: {type: String, required: false},
	rounds: {type: Number, required: true},
};

const matchResultSchema = new Schema<StoreMatchResult>(
	{
		id: {type: String, required: true},
		team1: team,
		team2: team,
		tournament: {type: String, required: false},
		stars: {type: Number, required: true},
		game: {type: String, required: true},
		videoId: {type: String, required: false},
	},
	{
		timestamps: true,
	}
);

export default model<StoreMatchResult>('MatchResult', matchResultSchema);
