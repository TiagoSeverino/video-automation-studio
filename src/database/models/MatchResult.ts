import {Schema, model, connect} from 'mongoose';

const team = {
	name: {type: String, required: true},
	logo: {type: String, required: false},
	rounds: {type: Number, required: true},
};

const matchResultSchema = new Schema<MatchResult>(
	{
		id: {type: String, required: true},
		team1: team,
		team2: team,
		tournament: {type: String, required: false},
		stars: {type: Number, required: true},
	},
	{
		timestamps: true,
	}
);

export default model<MatchResult>('MatchResult', matchResultSchema);
