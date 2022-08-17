import axios from 'axios';

interface Quotable {
	_id: string;
	content: string;
	author: string;
	tags: string[];
	authorSlug: string;
	length: number;
	dateAdded: string;
	dateModified: string;
}

export const getQuote = async () => {
	const quote = (await axios.get('https://api.quotable.io/random'))
		.data as Quotable;

	return quote;
};
