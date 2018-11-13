module.exports = {
	name: 'beep',
	description: 'Check if bot is awake.',
	executeAsync: async function(message) {
		message.channel.send('`boop`');
	},
};