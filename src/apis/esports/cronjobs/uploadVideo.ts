import ESportsVideoData from '../../../database/models/ESportsVideoData';
import TiktokAccount from '../../../database/models/TiktokAccount';
import YoutubeCredentialStorage from '../../../database/models/YoutubeCredentialStorage';
import uploadYoutube from '../../google/youtube';
import log from '../../log';
import {uploadTitok} from '../../tiktok';

export default async () => {
	const videosForYoutube = (await ESportsVideoData.find()).filter(
		(videoData) => !videoData.platforms?.youtube?.id
	);

	if (videosForYoutube.length > 0) {
		log(`Uploading ${videosForYoutube.length} videos for youtube`);

		const youtubeCredentials = await YoutubeCredentialStorage.findOne();

		await Promise.all(
			videosForYoutube.map(async (videoData) => {
				if (youtubeCredentials !== null) {
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
				}
			})
		);
	}

	const videosForTiktok = (await ESportsVideoData.find()).filter(
		(videoData) => !videoData.platforms?.tiktok?.id
	);

	if (videosForTiktok.length > 0) {
		const tiktokAccount = await TiktokAccount.findOne();
		if (!tiktokAccount) return;

		log(`Uploading ${videosForTiktok.length} videos for tiktok`);

		for (const videoData of videosForTiktok) {
			const tiktokId = await uploadTitok(
				videoData,
				tiktokAccount.cookies
			);

			if (!tiktokId) continue;

			const url = `https://www.tiktok.com/@${tiktokAccount.name}/video/${tiktokId}`;

			videoData.platforms = {
				...videoData.platforms,
				tiktok: {
					id: url,
				},
			};

			await videoData.save();

			log(`Uploaded tiktok: ${url}`);
		}
	}
};
