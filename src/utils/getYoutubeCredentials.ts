import YoutubeCredentials from '../database/models/YoutubeCredentials';

export default async (): Promise<YoutubeCredentials | undefined> => {
	const credentials = await YoutubeCredentials.findOne();

	if (!credentials) {
		log('No credentials found, insert into DB');
		return undefined;
	}

	return credentials;
};
