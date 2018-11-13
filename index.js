const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const secret = require('./secret.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));
for (const index in commandFiles) {
	const command = require(`./commands/${commandFiles[index]}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Parapluie is ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(config.commands.prefix) || message.author.bot) return;

	const args = message.content.slice(config.commands.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) {
		message.reply(`Unknown command: \`${message}\``);
		return;
	}

	try {
		await client.commands.get(command).executeAsync(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`There was an error trying to execute: \`${message}\``);
	}
});

client.login(secret.token);