import YoutubeCredential from '../database/models/YoutubeCredential';

export default async (): Promise<YoutubeCredential | undefined> => {
	const credential = await YoutubeCredential.findOne();

	if (!credential) {
		log('No credential found, insert into DB');
		return undefined;
	}

	return credential;
};
