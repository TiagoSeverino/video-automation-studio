import React from 'react';
import {MatchInfo} from './MatchInfo';
import {TeamLogo} from './TeamLogo';
import './styles.css';
import {interpolate} from 'remotion';

export interface ResultProps {
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
	stars: number;
	tournament: string;
}

export const Result: React.FC<{
	resultProps: ResultProps;
	entrance: number;
}> = ({resultProps: {tournament, stars, team1, team2}, entrance}) => {
	return (
		<div
			className="card"
			style={{
				transform: `translateY(${interpolate(entrance, [0, 1], [300, 0])}px)`,
				opacity: entrance,
			}}
		>
			<TeamLogo url={team1.logo} />

			<MatchInfo
				team1Rounds={team1.rounds}
				team2Rounds={team2.rounds}
				stars={stars}
				tournament={tournament}
			/>

			<TeamLogo team2 url={team2.logo} />
		</div>
	);
};
