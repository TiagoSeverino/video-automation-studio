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
				src={`${url.startsWith('/') ? 'https://www.hltv.org' : ''}${url}`}
			/>
		</div>
	);
};
