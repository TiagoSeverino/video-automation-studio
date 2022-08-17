import {google} from 'googleapis';

const customSearch = google.customsearch('v1');

export const searchImages = async (query: string, num = 2) => {
	const response = await customSearch.cse.list({
		auth: process.env.GOOGLE_SEARCH_API_KEY,
		cx: process.env.GOOGLE_SEARCH_API_ENGINE_ID,
		q: query,
		searchType: 'image',
		num,
	});

	if (!response.data.items) return [];

	return response.data.items.map((item) => {
		return item.link;
	});
};
