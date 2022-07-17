import {Message} from 'discord.js';
import {renderMatchResult} from '../renderer';
import {getMatches} from '../utils/csgo';
import client from './discord';

interface MessageHandler {
	[cmd: string]: (args: string[], message: Message) => Promise<void> | void;
}

interface CommandDescription {
	[cmd: string]: [string, string[]];
}

const userMessageDescription = {
	render: ['Renders a video from a list of matches', ['<days (Default: 1)>']],
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
	render: async ([daysStr], msg) => {
		const days = daysStr ? parseInt(daysStr) - 1 : 0;

		if (isNaN(days)) return msg.reply('Invalid days');

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		try {
			const matches = await getMatches(startDate, new Date());

			msg.reply(`Rendering ${matches.length} matches`);

			const paths = await renderMatchResult(matches);

			paths.map((path) =>
				msg.reply(path, {files: [`${path}.mp4`, `${path}.txt`]})
			);
		} catch {
			msg.reply('Error getting matches');
		}
	},
} as MessageHandler;

client.on('message', async (msg) => {
	if (!msg.content.startsWith('!')) return;
	if (!msg.guild) return;
	if (msg.author.bot) return;
	if (!msg.member) return;

	const [cmd, ...args] = msg.content.substring(1).split(' ');

	if (Object.getOwnPropertyNames(handleUserMessage).includes(cmd)) {
		await handleUserMessage[cmd](args, msg);
	}
});
