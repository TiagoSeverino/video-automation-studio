import {Img} from 'remotion';

export const TeamLogo = ({
	url,
	team2 = false,
}: {
	url: string;
	team2?: boolean;
}) => {
	return (
		<div className={`team${team2 ? '2' : '1'}`}>
			<Img
				className="logo"
				src={
					url.length > 0
						? url
						: 'https://www.hltv.org/img/static/team/placeholder.svg'
				}
			/>
		</div>
	);
};
