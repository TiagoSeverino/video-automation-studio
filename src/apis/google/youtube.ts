import {createReadStream} from 'fs';
import {OAuth2Client} from 'google-auth-library';
import {google} from 'googleapis';

const youtube = google.youtube({version: 'v3'});
const OAuth2 = google.auth.OAuth2;

export const categoryIds = {
	Gaming: '20',
};

export default async function uploadYoutube(
	videoData: VideoData,
	oauthToken: YoutubeOAuthToken,
	credentials: YoutubeCredential
): Promise<string> {
	await authenticateWithOAuthCredentials(oauthToken, credentials);

	const videoInformation = await uploadVideo(videoData);

	videoData.thumbnail &&
		(await uploadThumbnail(videoInformation.id!, videoData.thumbnail));

	if (!videoInformation.id) throw new Error('Error uploading to youtube');

	return videoInformation.id;
}

const createOAuthClient = (oauthToken: YoutubeOAuthToken) => {
	const OAuthClient = new OAuth2(
		oauthToken.client_id,
		oauthToken.client_secret,
		process.env.GOOGLE_REDIRECT_URI
	);

	return OAuthClient;
};

export const requestYoutubeConsentUrl = (oauthToken: YoutubeOAuthToken) =>
	createOAuthClient(oauthToken).generateAuthUrl({
		scope: ['https://www.googleapis.com/auth/youtube'],
	});

const requestGoogleForAccessTokens = async (
	OAuthClient: OAuth2Client,
	authorizationToken: string
) => {
	return new Promise((resolve, reject) => {
		OAuthClient.getToken(authorizationToken, (error, tokens) => {
			if (error) return reject(error);

			OAuthClient.setCredentials(tokens!);
			resolve(tokens);
		});
	});
};

const setGlobalGoogleAuthentication = (OAuthClient: OAuth2Client) => {
	google.options({
		auth: OAuthClient,
	});
};

export const authenticateWithOAuthToken = async (
	oauthToken: YoutubeOAuthToken,
	accessToken: string
) => {
	const OAuthClient = await createOAuthClient(oauthToken);

	const credentials = await requestGoogleForAccessTokens(
		OAuthClient,
		accessToken
	);
	await setGlobalGoogleAuthentication(OAuthClient);

	return credentials;
};

export const authenticateWithOAuthCredentials = async (
	oauthToken: YoutubeOAuthToken,
	credentials: YoutubeCredential
) => {
	const OAuthClient = createOAuthClient(oauthToken);
	OAuthClient.setCredentials(credentials);
	await setGlobalGoogleAuthentication(OAuthClient);
};

const uploadVideo = async ({
	path,
	title,
	description,
	tags,
	categoryId,
}: VideoData) => {
	const requestParameters = {
		part: ['snippet', 'status'],
		requestBody: {
			snippet: {
				title,
				description,
				tags,
				categoryId,
				defaultLanguage: 'en',
				defaultAudioLanguage: 'en',
			},
			status: {
				privacyStatus: 'public',
			},
		},
		media: {
			body: createReadStream(path),
		},
	};
	const youtubeResponse = await youtube.videos.insert(requestParameters);

	return youtubeResponse.data;
};

const uploadThumbnail = async (videoId: string, thumnailPath: string) => {
	const requestParameters = {
		videoId: videoId,
		media: {
			mimeType: 'image/jpeg',
			body: createReadStream(thumnailPath),
		},
	};

	await youtube.thumbnails.set(requestParameters);
};
