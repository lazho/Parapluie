module.exports = {
	name: 'roll',
    description: 'Roll dice given a dice expression (e.g. 2d20).',
    usage: '[dice expression]',
	executeAsync: async function(message, args) {
        if (!args.length) {
            message.reply('No dice expression given!');
        }
        else if (args.length > 1) {
            message.reply('Too many arguments.');
        }
        else {
            let repeat = '';
            let size = '';

            if (args[0].includes('d')) {
                const values = args[0].split('d');
                if (values.length == 1) {
                    size = values[0];
                }
                else if (values.length == 2) {
                    repeat = values[0];
                    size = values[1];
                }
            }

            if (size == '' || isNaN(size) || (repeat != '' && isNaN(repeat))) {
                message.reply('Invalid dice expression. Example: 2d20 for rolling 2 20-sided dice.');
            }
            else {
                if (repeat == '') {
                    repeat = 1;
                }
                size = Number(size);

                let sum = 0;

                // because why not?
                if (Math.abs(repeat) > 1000000 || Math.abs(size) > 1000000) {
                    sum = 42;
                }
                else {
                    for (let i = 0; i < Math.abs(repeat); i++) {
                        sum = sum + Math.ceil(Math.random() * Math.abs(size));
                    }
                }
                    
                if ((repeat < 0 || size < 0) && !(repeat < 0 && size < 0)) {
                    sum = -sum;
                }

                message.reply(`You rolled ${sum}.`);
            }
        }
	},
};