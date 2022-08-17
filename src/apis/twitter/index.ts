import {TwitterApi} from 'twitter-api-v2';

const twitterClient = new TwitterApi(process.env.TWITTER_TOKEN!).readOnly.v2;

export const getTwitterThread = async (tweetId: string) => {
	const tweet = (
		await twitterClient.tweets([tweetId], {
			'tweet.fields': ['public_metrics'],
		})
	).data.at(0);

	const quotes = (
		await twitterClient.quotes(tweetId, {
			'tweet.fields': ['public_metrics'],
		})
	).data.data;

	quotes.sort(
		(a, b) =>
			(b.public_metrics?.like_count || 0) -
			(a.public_metrics?.like_count || 0)
	);

	return {tweet, quotes};
};
