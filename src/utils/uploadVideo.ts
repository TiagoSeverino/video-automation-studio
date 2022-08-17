import uploadYoutube from '../apis/google/youtube';
import log from '../apis/log';
import getYoutubeCredentials from './getYoutubeCredentials';

export default async (videoData: VideoData) => {
	const youtubeCredentials = await getYoutubeCredentials();

	if (youtubeCredentials) {
		videoData = await uploadYoutube(videoData, youtubeCredentials);
		log(
			`${videoData.title} - https://youtu.be/${
				videoData.platforms!.youtube!.id
			}`
		);

		return true;
	}

	return false;
};
