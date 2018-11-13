const config = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all commands.',
	usage: '[command name]',
	executeAsync: function(message, args) {
		const { commands } = message.client;
		const lines = [''];

		if (!args.length) {
			lines.push(...commands.map(command => `\`${command.name}\`: ${command.description}`));
		}
		else {
			for (const index in args) {
				if (commands.has(args[index])) {
					const command = commands.get(args[index]);
					lines.push(`**Name**: \`${command.name}\``);
					lines.push(`**Description**: ${command.description}`);
					lines.push(`**Usage**: \`${config.commands.prefix}${command.name} ${command.usage || ''}\``);
					if (command.cooldown) {
						lines.push(`**Cooldown**: ${command.cooldown}ms`);
					}
				}
				lines.push('');
			}
		}

		message.reply(lines, { split: true });
	},
};