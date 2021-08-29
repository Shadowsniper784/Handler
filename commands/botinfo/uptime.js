const { MessageEmbed } = require('discord.js');
module.exports = {
	description: 'Get the current uptime of the bot',
	category: 'Bot Info',
	callback: async ({ message, instance, client }) => {
		const uptime = instance.Util.parseMilliseconds(client.uptime);
		const embed = new MessageEmbed()
			.setTitle('Uptime')
			.setTimestamp(instance.Util.formatDate(Date.now(), false))
			.setColor(instance.defaultColour)
			.setDescription(`${instance.translate('UPTIME',message.author.id)}\n**${uptime}**`);
		message.sendData({embeds:[embed]});
	}
};
