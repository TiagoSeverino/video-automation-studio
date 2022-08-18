import ESportsVideoData from '../../../database/models/ESportsVideoData';
import YoutubeCredentialStorage from '../../../database/models/YoutubeCredentialStorage';
import uploadYoutube from '../../google/youtube';
import log from '../../log';

export default async () => {
	const videosData = await ESportsVideoData.find();

	const videosForYoutube = videosData.filter(
		(videoData) => !videoData.platforms?.youtube?.id
	);

	if (videosForYoutube.length > 0) {
		log(`Uploading ${videosForYoutube.length} videos for youtube`);

		const youtubeCredentials = await YoutubeCredentialStorage.findOne();

		await Promise.all(
			videosForYoutube.map(async (videoData) => {
				if (youtubeCredentials !== null) {
					const {platforms} = await uploadYoutube(
						videoData,
						youtubeCredentials,
						youtubeCredentials.tokens[0]
					);

					videoData.platforms!.youtube = platforms!['youtube'];
					await videoData.save();
				}
			})
		);
	}
};
