// libs
const fs = require('fs');
const Discord = require('discord.js');

// configs
const config = require('./config.json');
const secret = require('./secret.json');

const client = new Discord.Client();

// commands setup
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));
for (const index in commandFiles) {
	const command = require(`./commands/${commandFiles[index]}`);
	client.commands.set(command.name, command);
}

// cooldown setup
client.cooldowns = {
	// global cooldown: stores each user's last attempt at a command.
	global: new Discord.Collection(),
	// command-specific cooldowns: same as global but specific to each command.
	specific: new Discord.Collection(),
};

client.once('ready', () => {
	console.log('Parapluie is ready!');
});

// message listener
client.on('message', async message => {
	// ignore messages that do not start with prefix, and messages by bots.
	if (!message.content.startsWith(config.commands.prefix) || message.author.bot) return;

	// split into commands and args.
	const args = message.content.slice(config.commands.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	const now = Date.now();

	// check global cooldown for command author
	// NOTE: command does not have to exist for global cooldown to trigger to prevent spam
	if (client.cooldowns.global.has(message.author.id)) {
		const expiration = client.cooldowns.global.get(message.author.id) + config.commands.cooldown;
		if (now < expiration) return;
	}
	else {
		client.cooldowns.global.set(message.author.id, now);
		setTimeout(() => client.cooldowns.global.delete(message.author.id), config.commands.cooldown);
	}

	// check if command exists
	if (!client.commands.has(command)) {
		message.reply(`Unknown command: \`${message}\``);
		return;
	}

	const commandModule = client.commands.get(command);

	// check command-specific cooldown
	if (commandModule.cooldown)	{
		if (!client.cooldowns.specific.has(command)) {
			client.cooldowns.specific.set(command, new Discord.Collection());
		}

		if (client.cooldowns.specific.get(command).has(message.author.id)) {
			const expiration = client.cooldowns.specific.get(command).get(message.author.id) + commandModule.cooldown;
			if (now < expiration) return;
		}
		else {
			client.cooldowns.specific.get(command).set(message.author.id, now);
			setTimeout(() => client.cooldowns.specific.get(command).delete(message.author.id), commandModule.cooldown);
		}
	}

	// execute!
	try {
		await commandModule.executeAsync(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply(`There was an error trying to execute: \`${message}\``);
	}
});

client.login(secret.token);