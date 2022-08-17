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
	let currentLength = 0;

	const tournamentName = tournament
		.split(' ')
		.map((t) => {
			currentLength += t.length;
			return currentLength > 30 ? `` : t;
		})
		.join(' ');

	return (
		<div className="center">
			<div className="tournamentcontainer">
				<span>{tournamentName}</span>
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
			{stars > 0 && (
				<div className="starscontainer">
					<span>{'⭐'.repeat(stars)}</span>
				</div>
			)}
		</div>
	);
};
