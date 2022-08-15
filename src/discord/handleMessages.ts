import {Message} from 'discord.js';
import {existsSync, readFileSync, writeFileSync} from 'fs';

import downloader from '../downloader';
import {renderMatchResult} from '../renderer';
import {getTwitterThread} from '../twitter';
import {dateToString, getMatches} from '../utils/csgo';
import uploadYoutube, {
	authenticateWithOAuthCredentials,
	authenticateWithOAuthToken,
	requestYoutubeConsentUrl,
	VideoData,
} from '../youtube';
import client from './discord';

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

const userMessageDescription = {
	csgo: ['Renders a video from hltv results', ['<days (Default: 1)>']],
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
		});
	},
	tt: async ([url], msg) => {
		const tweetId = url.split('/').pop();

		if (!tweetId) return msg.reply('Invalid tweet url. Try again.');

		const {tweet, quotes} = await getTwitterThread(tweetId);

		if (!tweet) return msg.reply('Invalid tweet url. Try again.');

		msg.reply(tweet.text);
	},
	csgo: async ([daysStr], msg) => {
		const days = daysStr ? parseInt(daysStr) - 1 : 0;

		if (isNaN(days)) return msg.reply('Invalid days');

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		const mainMsg = await msg.reply('Fetching matches');

		const matches = await getMatches(startDate, new Date());

		if (matches.length === 0)
			return mainMsg.edit('No matches found for the given date range');

		mainMsg.edit(`Rendering ${matches.length} matches`);

		const paths = await renderMatchResult(matches);

		mainMsg.edit(`Uploading ${matches.length} matches`);

		await Promise.all(
			paths.map(async (path, k) => {
				const videoData = {
					title: `CSGO Match Results ${dateToString(startDate)}${
						paths.length > 1 ? ` - ${k + 1}/${paths.length}` : ''
					}`,
					description: readFileSync(`${path}.txt`, 'utf8'),
					tags: [
						...new Set(
							[
								'csgo',
								'counter',
								'strike',
								'counterstrike',
								'counter-stike',
								'match',
								'result',
								'hltv',
								...matches.map((m) => m.team1.name),
								...matches.map((m) => m.team2.name),
								...matches.map((m) => m.tournament || ''),
							].filter((t) => t.length > 0)
						),
					],
					path: `${path}.mp4`,
				};

				await handleYoutubeUpload(msg, videoData);
			})
		);

		await mainMsg.delete();
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
			console.error(err);
			msg.reply('Error');
		}
	}
});
