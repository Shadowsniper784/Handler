const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'aggro',
	aliases: ['aggroclone', 'clone'],
	category: 'Fallen Commands',
	description: 'Info on the Aggro Clone',
	callback: ({ message, args, instance }) => {
	  const des = instance.translate('AGGRO',message.author.id)
		let embed = new MessageEmbed()
			.setTitle('Aggro Clone')
			.setDescription(
				des
			)
			.setColor(instance.defaultColour)
			.setTimestamp();
		   message.sendData({embeds:[embed.toJSON()]})
	}
};