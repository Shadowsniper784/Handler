const getUri = query =>
	`https://handler.shadowsniper784.repl.co/commands/${encodeURIComponent(query)}`;

module.exports = {
  callback: ({ message, args }) => {
    const axios = require('axios');
    const uri = getUri(args[0])
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
}