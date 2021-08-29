const { MessageEmbed } = require('discord.js');
module.exports = {
	category: 'Bot Info',
	description: 'A simple ping pong command!',
	callback: ({ message, client, instance }) => {
		let desc = instance.botOwners.includes(message.author.id) ?  `The bot has a ping of ${client.ws.ping} ms` : 'Pong!!';
		const embed = new MessageEmbed()
			.setColor(instance.defaultColour)
			.setTitle(client.user.username)
			.setDescription(desc);
	message.sendData({embeds:[embed]})
}
}