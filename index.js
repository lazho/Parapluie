const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');
const { token } = require('./secret.json');

client.once('ready', () => {
    console.log('Parapluie is ready!');
});

client.on('message', message => {
    if (message.content.startsWith(`${prefix}beep`)) {
        message.channel.send('`boop`');
    }
});

client.login(token);