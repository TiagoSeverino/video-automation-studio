import {OAuth2Client} from 'google-auth-library';
import {google} from 'googleapis';

const youtube = google.youtube({version: 'v3'});
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');

interface Credentials {
	access_token: string;
	refresh_token: string;
	scope: string;
	token_type: string;
	expiry_date: number;
}

export const categoryIds = {
	Gaming: '20',
};

export default async function uploadYoutube(
	videoData: VideoData,
	credentials?: Credentials
) {
	if (credentials) await authenticateWithOAuthCredentials(credentials);

	const videoInformation = await uploadVideo(videoData);

	videoData.thumbnail &&
		(await uploadThumbnail(videoInformation.id!, videoData.thumbnail));

	return videoInformation;
}

const createOAuthClient = () => {
	const OAuthClient = new OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		process.env.GOOGLE_REDIRECT_URI
	);

	return OAuthClient;
};

export const requestYoutubeConsentUrl = () =>
	createOAuthClient().generateAuthUrl({
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

export const authenticateWithOAuthToken = async (token: string) => {
	const OAuthClient = await createOAuthClient();

	const credentials = await requestGoogleForAccessTokens(OAuthClient, token);
	await setGlobalGoogleAuthentication(OAuthClient);

	return credentials;
};

export const authenticateWithOAuthCredentials = async (
	credentials: Credentials
) => {
	const OAuthClient = createOAuthClient();
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
			body: fs.createReadStream(path),
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
			body: fs.createReadStream(thumnailPath),
		},
	};

	await youtube.thumbnails.set(requestParameters);
};
