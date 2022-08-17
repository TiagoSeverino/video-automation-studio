import log from '../apis/log';
import YoutubeCredentialStorage from '../database/models/YoutubeCredentialStorage';

export default async (): Promise<YoutubeCredentialStorage | undefined> => {
	const credential = await YoutubeCredentialStorage.findOne();

	if (!credential) {
		log('No credential found, insert into DB');
		return undefined;
	}

	return credential;
};
