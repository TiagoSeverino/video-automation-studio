import uploadYoutube from '../apis/google/youtube';
import log, {logError} from '../apis/log';
import getYoutubeCredentials from './getYoutubeCredentials';

export default async (videoData: VideoData) => {
	try {
		const youtubeCredentials = await getYoutubeCredentials();

		if (youtubeCredentials) {
			videoData = await uploadYoutube(
				videoData,
				youtubeCredentials,
				youtubeCredentials.tokens[0]
			);
			log(
				`${videoData.title} - https://youtu.be/${
					videoData.platforms!.youtube!.id
				}`
			);

			return true;
		}
	} catch (e) {
		console.error(e);
		logError('Error uploading video to youtube');
	}

	return false;
};
