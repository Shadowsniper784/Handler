const axios = require('axios');
const getUri = query =>
	`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;
module.exports = {
	name: 'docs',
	commands: ['documentation', 'd'],
	category: 'Utility',
	slash: false,
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<query>',
	testOnly: false,
	description: 'Information about discord.js!',
	callback: ({ message, args }) => {
		const uri = getUri(args)
		axios
			.get(uri)
			.then(embed => {
				const { data } = embed;

				if (data && !data.error) {
					message.channel.send({ embed: data });
				} else {
					message.channel.send('Could not find that documentation');
				}
			})
			.catch(err => {
				console.error(err);
			});
	}
};