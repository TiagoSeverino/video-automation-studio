import { Message } from 'discord.js';
import client from './discord';

interface MessageHandler {
	[cmd: string]: (args: string[], message: Message) => Promise<void> | void;
}

interface CommandDescription {
	[cmd: string]: [string, string[]];
}

const userMessageDescription = {
	ping: ['pong!', ['<query>']],
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
	ping: (_, msg) => {
		msg.reply('Pong!');
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
