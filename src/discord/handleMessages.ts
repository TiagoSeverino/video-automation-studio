import {Message} from 'discord.js';
import {getSubtitles} from 'youtube-captions-scraper';

import downloader from '../apis/downloader';
import {getTwitterThread} from '../apis/twitter';
import client from './discord';
import getYoutubeID from '../utils/getYoutubeID';
import {getQuote} from '../apis/quotes';
import {searchImages} from '../apis/google/search';
import {logError} from '../apis/log';
import ESportsVideoData from '../database/models/ESportsVideoData';
import MatchResult from '../database/models/MatchResult';
import {availableESports} from '../utils/availableESports';

interface MessageHandler {
	[cmd: string]: (args: string[], message: Message) => Promise<any> | any;
}

interface CommandDescription {
	[cmd: string]: [string, string[]];
}

const waitReply = async (msg: Message) =>
	(
		await msg.channel.awaitMessages((m) => m.author.id === msg.author.id, {
			max: 1,
			time: 120000,
			errors: ['time'],
		})
	).first()!.content;

const handleQuestion = async (
	msg: Message,
	query: string,
	deleteQuestion?: boolean
) => {
	const options = ['✅', '❌'];

	const question = await msg.reply(query);

	options.map((option) => question.react(option));

	const reaction = await question.awaitReactions(
		(reaction, user) => {
			return (
				user.id === msg.author.id &&
				options.includes(reaction.emoji.name)
			);
		},
		{max: 1, time: 120000, errors: ['time']}
	);

	deleteQuestion && (await question.delete());

	return reaction.first()!.emoji.name === options[0];
};

const promptVideoData = async (msg: Message) => {
	msg.reply('Enter video title:');
	const title = await waitReply(msg);

	msg.reply('Enter video description:');
	const description = await waitReply(msg);

	msg.reply('Enter video tags (separated by spaces):');
	const tags = await (await waitReply(msg)).split(' ');

	return {title, description, tags};
};

const userMessageDescription = {
	download: ['Downloads a video and reupload', ['<url>']],
} as CommandDescription;

const handleUserMessage = {
	help: (_, msg) => {
		const message = Object.getOwnPropertyNames(userMessageDescription)
			.map((cmd: string) => {
				const [description, args] = userMessageDescription[cmd];

				return `!${cmd} ${args.join(' ')} - ${description}`;
			})
			.join('\n');

		msg.reply(message);
	},
	download: async ([url], msg) => {
		const pathAsync = downloader(url);

		const videoData = await promptVideoData(msg);

		const path = (await pathAsync) as string;

		await handleYoutubeUpload(msg, {
			path,
			...videoData,
			categoryId: YoutubeCategoryIds.Gaming,
		});
	},
	tt: async ([url], msg) => {
		const tweetId = url.split('/').pop();

		if (!tweetId) return msg.reply('Invalid tweet url. Try again.');

		const {tweet, quotes} = await getTwitterThread(tweetId);

		if (!tweet) return msg.reply('Invalid tweet url. Try again.');

		msg.reply(tweet.text);
	},
	ebook: async ([url], msg) => {
		const videoID = getYoutubeID(url);

		if (!videoID) return msg.reply('Invalid video URL');

		//const path = await downloader(url, videoID);

		const subtitles = (await getSubtitles({
			videoID,
		})) as {
			start: Number;
			dur: Number;
			text: String;
		}[];

		const message = subtitles.map((subtitle) => subtitle.text).join(' ');

		console.log(message);
	},
	quote: async (_, msg) => {
		const quote = await getQuote();

		searchImages(`${quote.author} ${quote.tags.join(' ')}`, 1).then(
			(images) => {
				images.map((img) => img && msg.reply(img));
			}
		);

		msg.reply(`${quote.author} - ${quote.content}`);

		console.log(quote);
	},
	remaining: async (_, msg) => {
		const reply = [];
		const videosForTiktok = (await ESportsVideoData.find()).filter(
			(videoData) => !videoData.platforms?.tiktok?.id
		);

		const videosForYoutube = (await ESportsVideoData.find()).filter(
			(videoData) => !videoData.platforms?.youtube?.id
		);

		if (videosForTiktok.length > 0)
			reply.push(`${videosForTiktok.length} videos for tiktok`);

		if (videosForYoutube.length > 0)
			reply.push(`${videosForYoutube.length} videos for youtube`);

		await Promise.all(
			availableESports.map(async (game) => {
				const remainingRender = (await MatchResult.find({game})).filter(
					(m) => !m.videoId
				);

				if (remainingRender.length === 0) return;

				reply.push(
					`${remainingRender.length} matches to render for ${game}`
				);
			})
		);

		if (reply.length === 0) msg.reply('No remaining renders/uploads');
		else msg.reply(reply);
	},
} as MessageHandler;

client.on('message', async (msg) => {
	if (!msg.content.startsWith('!')) return;
	if (!msg.guild) return;
	if (msg.author.bot) return;
	if (!msg.member) return;

	const [cmd, ...args] = msg.content.substring(1).split(' ');

	if (Object.getOwnPropertyNames(handleUserMessage).includes(cmd)) {
		try {
			await handleUserMessage[cmd](args, msg);
		} catch (err) {
			logError(err);
			msg.reply('Error');
		}
	}
});
