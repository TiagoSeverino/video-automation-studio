import {Img} from 'remotion';

export const TeamLogo = ({url, team2 = false}) => {
	return (
		<div className={`team${team2 ? '2' : '1'}`}>
			<Img className="logo" src={url} />
		</div>
	);
};
