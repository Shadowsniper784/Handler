const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'carthe123',
	aliases: ['car', 'carthe'],
	category: 'Fallen Commands',
	description: 'Info on the realm creator',
	callback: ({ message, args, instance }) => {
		let embed = new MessageEmbed()
			.setTitle('Carthe123')
			.setDescription(
				instance.translate('CARTHE',message.author.id)
			)
			.setColor(instance.defaultColour)
			.setTimestamp();
		   message.sendData({embeds:[embed.toJSON()]})
	}
};