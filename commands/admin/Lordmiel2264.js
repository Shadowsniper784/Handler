
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'lordmiel2264',
	aliases: ['lordmiel', 'lord'],
	category: 'Fallen Commands',
	description: 'Info on the Aggro Clone',
	callback: ({ message, args, instance }) => {
		let embed = new MessageEmbed()
			.setTitle('Lordmiel2264')
			.setDescription(
				instance.translate('LORD',message.author.id)
			)
			.setColor(instance.defaultColour)
			.setTimestamp();
		   message.sendData({embeds:[embed.toJSON()]})
	}
};