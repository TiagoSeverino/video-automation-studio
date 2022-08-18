import ESportsVideoData from '../../../database/models/ESportsVideoData';
import YoutubeCredentialStorage from '../../../database/models/YoutubeCredentialStorage';
import uploadYoutube from '../../google/youtube';

export default async () => {
	const videosData = await ESportsVideoData.find({
		platforms: {$exists: false},
	});

	const youtubeCredentials = await YoutubeCredentialStorage.findOne();

	videosData.map(async (videoData) => {
		if (youtubeCredentials !== null) {
			const {platforms} = await uploadYoutube(
				videoData,
				youtubeCredentials,
				youtubeCredentials.tokens[0]
			);

			videoData.platforms!.youtube = platforms!['youtube'];
			await videoData.save();
		}
	});
};
