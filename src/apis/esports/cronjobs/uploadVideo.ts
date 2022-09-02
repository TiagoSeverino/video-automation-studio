import ESportsVideoData from '../../../database/models/ESportsVideoData';
import TiktokAccount from '../../../database/models/TiktokAccount';
import YoutubeCredentialStorage from '../../../database/models/YoutubeCredentialStorage';
import log, {logError} from '../../log';
import uploadTiktok from '@TiagoSeverino/tiktok-uploader';
import uploadYoutube from '@TiagoSeverino/youtube-uploader';
import {getYoutubeChannelName} from '..';

export default async () => {
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

	const videosForYoutube = (await ESportsVideoData.find()).filter(
		(videoData) => !videoData.platforms?.youtube?.id
	);

	if (videosForYoutube.length > 0) {
		const youtubeCredentials = await YoutubeCredentialStorage.findOne();
		if (!youtubeCredentials)
			return logError('No youtube credentials found');

		for (const videoData of videosForYoutube) {
			try {
				const {path, title, description, tags, game} = videoData;

				const channelName = getYoutubeChannelName(game);

				const url = await uploadYoutube(
					{
						path,
						title,
						description: `${description}

Created by Tiago Severino
Github - https://github.com/TiagoSeverino
Linkedin - https://www.linkedin.com/in/tiagoseverino/`,
						tags,
						channelName,
					},
					require('../../../../yt-auth/cookies.json')
				);

				if (!url) continue;

				const id = url.split('/').pop();

				if (!id) return log(`ID Not found for youtube: ${url}`);

				videoData.platforms = {
					...videoData.platforms,
					youtube: {
						id,
					},
				};

				videoData
					.save()
					.then(() =>
						log(`${videoData.title} - https://youtu.be/${id}`)
					);
			} catch (e) {
				logError(`Failed to upload to youtube: ${e}`);
			}
		}
	}
};
