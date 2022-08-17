import uploadYoutube, {
	authenticateWithOAuthCredentials,
	VideoData,
} from '../google/youtube';

export default async (videoData: VideoData, credentials: any) => {
	await authenticateWithOAuthCredentials(credentials);

	return await uploadYoutube(videoData);
};
