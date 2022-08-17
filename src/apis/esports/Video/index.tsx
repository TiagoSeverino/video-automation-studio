import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Background} from './Background';
import {Result, ResultProps} from './Result';

const cardEntrace = ({
	index,
	fps,
	frame,
	size,
}: {
	index: number;
	fps: number;
	frame: number;
	size: number;
}): number => {
	return spring({
		fps,
		frame: frame - index * fps * (1 / size),
		config: {
			damping: 400,
			mass: 5,
		},
	});
};

const ESportResult: React.FC<{matches: ResultProps[]}> = ({matches}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Fade out the animation at the end
	const opacity = interpolate(
		frame,
		[durationInFrames - fps, durationInFrames],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<>
			<Background seed={JSON.stringify(matches)} />
			<AbsoluteFill className="container" style={{opacity}}>
				{matches.map((match, index) => (
					<Result
						key={index}
						resultProps={match}
						entrance={cardEntrace({
							index,
							fps,
							frame,
							size: matches.length,
						})}
					/>
				))}
			</AbsoluteFill>
		</>
	);
};

export default ESportResult;
