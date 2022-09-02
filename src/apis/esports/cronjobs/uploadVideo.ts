import ESportsVideoData from '../../../database/models/ESportsVideoData';
import TiktokAccount from '../../../database/models/TiktokAccount';
import YoutubeCredentialStorage from '../../../database/models/YoutubeCredentialStorage';
import uploadYoutube from '../../google/youtube';
import log, {logError} from '../../log';
import uploadTiktok from '@TiagoSeverino/tiktok-uploader';

export default async () => {
	const videosForYoutube = (await ESportsVideoData.find()).filter(
		(videoData) => !videoData.platforms?.youtube?.id
	);

	if (videosForYoutube.length > 0) {
		const youtubeCredentials = await YoutubeCredentialStorage.findOne();
		if (!youtubeCredentials)
			return logError('No youtube credentials found');

		for (const videoData of videosForYoutube) {
			try {
				const youtubeId = await uploadYoutube(
					videoData,
					youtubeCredentials,
					youtubeCredentials.tokens[0]
				);

				videoData.platforms = {
					...videoData.platforms,
					youtube: {
						id: youtubeId,
					},
				};

				await videoData.save();

				log(`https://youtu.be/${youtubeId}`);
			} catch (err) {
				logError("Couldn't upload video to youtube");
				console.error(err);
				break;
			}
		}
	}

	const videosForTiktok = (await ESportsVideoData.find()).filter(
		(videoData) => !videoData.platforms?.tiktok?.id
	);

	if (videosForTiktok.length > 0) {
		const tiktokAccount = await TiktokAccount.findOne();
		if (!tiktokAccount) return logError('No tiktok account found');

		for (const videoData of videosForTiktok) {
			try {
				const tiktokId = await uploadTiktok(
					{
						path: videoData.path,
						title: `${videoData.title} ${videoData.tags
							.sort((a, b) => a.length - b.length)
							.map((t) => `#${t}`.replace(/\s/g, ''))
							.join(' ')}`.slice(0, 150),
					},
					tiktokAccount.cookies
				);

				if (!tiktokId) break;

				videoData.platforms = {
					...videoData.platforms,
					tiktok: {
						id: `https://www.tiktok.com/@${tiktokAccount.name}/video/${tiktokId}`,
					},
				};

				await videoData.save();

				log(videoData.platforms!.tiktok!.id);
			} catch (err) {
				logError("Couldn't upload video to tiktok");
				console.error(err);

				break;
			}
		}
	}
};
