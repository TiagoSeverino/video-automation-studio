import axios from 'axios';

const log = (message: string) => {
	console.log(message);

	process.env.WEBHOOK_URL &&
		axios.post(process.env.WEBHOOK_URL, {
			content: message,
		});
};

export const logError = (message: string) => {
	console.error(message);
	log(message);
};

export default log;
