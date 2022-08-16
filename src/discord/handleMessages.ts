import {Message} from 'discord.js';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import {getSubtitles} from 'youtube-captions-scraper';

import downloader from '../downloader';
import {renderMatchResult} from '../renderer';
import {getTwitterThread} from '../twitter';
import {dateToString} from '../utils/date';
import {availableGames, getMatches, getTags, getTitle} from '../esports';
import uploadYoutube, {
	authenticateWithOAuthCredentials,
	authenticateWithOAuthToken,
	categoryIds,
	requestYoutubeConsentUrl,
	VideoData,
} from '../google/youtube';
import client from './discord';
import getChunks from '../utils/getChunks';
import getYoutubeID from '../utils/getYoutubeID';

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

const handleYoutubeLogin = async (msg: Message) => {
	if (!existsSync(`${msg.author.id}.youtube.json`)) {
		const youtubeConsentUrl = requestYoutubeConsentUrl();
		await msg.reply(`Login to Youtube: ${youtubeConsentUrl}`);

		const youtubeToken = await waitReply(msg);

		const credentials = await authenticateWithOAuthToken(youtubeToken);
		writeFileSync(
			`${msg.author.id}.youtube.json`,
			JSON.stringify(credentials)
		);
	} else {
		const credentials = JSON.parse(
			readFileSync(`${msg.author.id}.youtube.json`, 'utf8')
		);
		await authenticateWithOAuthCredentials(credentials);
	}
};

const handleYoutubeUpload = async (msg: Message, videoData: VideoData) => {
	const canUploadYoutube = await handleQuestion(
		msg,
		'Upload to Youtube?',
		true
	);

	if (!canUploadYoutube) return false;

	await handleYoutubeLogin(msg);

	const mainMsg = await msg.reply('Uploading to youtube');
	const youtubeResponse = await uploadYoutube(videoData);
	await mainMsg.edit(`https://youtu.be/${youtubeResponse.id}`);
};

const generateEsportVideo = async (msg: Message, game: ESportsVideo) => {
	const mainMsg = await msg.reply('Fetching matches');

	const matches = await getMatches(game);

	if (matches.length === 0) return mainMsg.edit('No matches found!');

	mainMsg.edit(`Rendering ${matches.length} matches`);

	await Promise.all(
		getChunks(matches, 5).map(async (chunk) => {
			const path = await renderMatchResult(chunk);

			const videoData = {
				title: `${getTitle(game)} ${dateToString(new Date(), false)}`,
				description: readFileSync(`${path}.txt`, 'utf8'),
				tags: [
					...new Set(
						[
							...getTags(game),
							...chunk.map((m) => m.team1.name),
							...chunk.map((m) => m.team2.name),
							...chunk.map((m) => m.tournament || ''),
						].filter((t) => t.length > 0)
					),
				],
				path: `${path}.mp4`,
				categoryId: categoryIds.Gaming,
			};

			await handleYoutubeUpload(msg, videoData);
		})
	);

	await mainMsg.delete();
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
			categoryId: categoryIds.Gaming,
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
} as MessageHandler;

availableGames.map((game) => {
	handleUserMessage[game] = async (_, msg) =>
		await generateEsportVideo(msg, game);
	userMessageDescription[game] = [
		`Generates video with daily ${game} results`,
		[],
	];
});

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
			console.error(err);
			msg.reply('Error');
		}
	}
});
