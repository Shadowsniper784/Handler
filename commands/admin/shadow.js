const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'shadowsniper784',
	aliases: ['shadow'],
	category: 'Fallen Commands',
	description: 'Info on my creator',
	callback: ({ message, args, instance }) => {
		let embed = new MessageEmbed()
			.setTitle('Shadowsniper784')
			.setDescription(
			 instance.translate('SHADOW',message.author.id)
			)
			.setColor(instance.defaultColour)
			.setTimestamp();
		  message.sendData({embeds:[embed.toJSON()]})
	}
};