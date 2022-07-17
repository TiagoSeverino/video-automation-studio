import Discord from 'discord.js';

const client = new Discord.Client();

client.on('ready', () => {
	client.user?.setActivity('Hello World');
	console.log(`Logged in as ${client.user?.username}!`);
});

client.login(process.env.DISCORD_TOKEN);

export default client;
