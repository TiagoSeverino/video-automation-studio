export const MatchInfo = ({
	team1Rounds,
	team2Rounds,
	stars,
	tournament,
}: {
	team1Rounds: number;
	team2Rounds: number;
	stars: number;
	tournament: string;
}) => {
	return (
		<div className="center">
			<div className="tournamentcontainer">
				<span>{tournament}</span>
			</div>
			<p className="resultdisplay">
				<span className={team1Rounds >= team2Rounds ? 'won' : 'lost'}>
					{team1Rounds}
				</span>
				{' - '}
				<span className={team2Rounds >= team1Rounds ? 'won' : 'lost'}>
					{team2Rounds}
				</span>
			</p>
			<div className="starscontainer">
				<span>{'⭐'.repeat(stars)}</span>
			</div>
		</div>
	);
};
