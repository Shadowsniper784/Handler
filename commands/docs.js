const axios = require('axios');
function doThing(send, uri) {
		axios
			.get(uri)
			.then(embed => {
				const { data } = embed;

				if (data && !data.error) {
					send(data);
				} else {
					send('Could not find that documentation');
				}
			})
			.catch(err => {
				console.error(err);
			});
}
const getUri = query =>
	`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;
module.exports = {
	name: 'docs',
	commands: ['documentation', 'd'],
	category: 'Utility',
	slash: "both",
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<query>',
	options: [{
	  name: 'query',
	  description: 'The thing to search in discord.js docs for',
	  required: true,
	  type: 3
	  }],
	testOnly: true,
	description: 'Information about discord.js!',
	callback: ({ message, text, interaction }) => {
	  console.log(text)
		if(message && message.channel && message.send) doThing(message.send, getUri(text))
		else if(interaction && interaction.reply) doThing(interaction.reply,getUri(text))
		else console.error('Message and interaction do not exist')
	}
};