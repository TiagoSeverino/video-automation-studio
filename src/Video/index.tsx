import {Composition} from 'remotion';
import {MatchResult} from './MatchResult';

// Each <Composition> is an entry in the sidebar!
const duration = 10;
const fps = 30;
const durationInFrames = fps * duration;

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.tsx <id> out/video.mp4
				id="MatchResult"
				component={MatchResult}
				durationInFrames={durationInFrames}
				fps={fps}
				width={1080}
				height={1920}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					matches: [
						{
							team1: {
								name: 'Furia',
								logo: 'https://img-cdn.hltv.org/teamlogo/mvNQc4csFGtxXk5guAh8m1.svg?ixlib=java-2.1.0&s=11e5056829ad5d6c06c5961bbe76d20c',
								rounds: 0,
							},
							team2: {
								name: 'Virtus Pro',
								logo: 'https://img-cdn.hltv.org/teamlogo/yZ6Bpuui1rW3jocXQ68XgZ.svg?ixlib=java-2.1.0&s=f39be1d3e7baf30a4e7f0b1216720875',
								rounds: 2,
							},
							stars: 4,
							tournament: 'IEM Cologne 2022',
						},

						{
							team1: {
								name: 'Furia',
								logo: 'https://img-cdn.hltv.org/teamlogo/Y37ZjhQhf-74eg44YCXe_m.png?ixlib=java-2.1.0&w=100&s=07c7f78adddce9861546f8facb29e5ba',
								rounds: 16,
							},
							team2: {
								name: 'Virtus Pro',
								logo: 'https://img-cdn.hltv.org/teamlogo/JMeLLbWKCIEJrmfPaqOz4O.svg?ixlib=java-2.1.0&s=c02caf90234d3a3ebac074c84ba1ea62',
								rounds: 14,
							},
							stars: 3,
							tournament: 'IEM Cologne 2022',
						},
						{
							team1: {
								name: 'Furia',
								logo: 'https://img-cdn.hltv.org/teamlogo/-ttGATBV_P_HcZazxNNtIb.png?ixlib=java-2.1.0&w=100&s=8553ef1ff134f4171868cbfaf234836d',
								rounds: 0,
							},
							team2: {
								name: 'Virtus Pro',
								logo: 'https://img-cdn.hltv.org/teamlogo/9iMirAi7ArBLNU8p3kqUTZ.svg?ixlib=java-2.1.0&s=4dd8635be16122656093ae9884675d0c',
								rounds: 2,
							},
							stars: 5,
							tournament: 'IEM Cologne 2022',
						},
						{
							team1: {
								name: 'Furia',
								logo: 'https://img-cdn.hltv.org/teamlogo/mvNQc4csFGtxXk5guAh8m1.svg?ixlib=java-2.1.0&s=11e5056829ad5d6c06c5961bbe76d20c',
								rounds: 0,
							},
							team2: {
								name: 'Virtus Pro',
								logo: 'https://img-cdn.hltv.org/teamlogo/yZ6Bpuui1rW3jocXQ68XgZ.svg?ixlib=java-2.1.0&s=f39be1d3e7baf30a4e7f0b1216720875',
								rounds: 2,
							},
							stars: 1,
							tournament: 'IEM Cologne 2022',
						},
						{
							team1: {
								name: 'Furia',
								logo: 'https://img-cdn.hltv.org/teamlogo/-ttGATBV_P_HcZazxNNtIb.png?ixlib=java-2.1.0&w=100&s=8553ef1ff134f4171868cbfaf234836d',
								rounds: 0,
							},
							team2: {
								name: 'Virtus Pro',
								logo: 'https://img-cdn.hltv.org/teamlogo/9iMirAi7ArBLNU8p3kqUTZ.svg?ixlib=java-2.1.0&s=4dd8635be16122656093ae9884675d0c',
								rounds: 2,
							},
							stars: 3,
							tournament: 'IEM Cologne 2020',
						},
					],
				}}
			/>
		</>
	);
};
