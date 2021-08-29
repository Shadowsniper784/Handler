module.exports = {
	description: 'Make an advert with formatting',
	category: 'Utility',
	minArgs: 1,
	cooldown: '60',
	expectedArgs: '<advert text>',
	callback: ({ message, args, client, text, instance }) => {
		let channel = message.channel.guild.channels.cache.find(channel =>
			channel.name.toLowerCase().includes('promo')) || message.channel
		const { MessageEmbed } = require('discord.js');
		const embed = new MessageEmbed()
			.setDescription(text)
			.setColor(instance.color)
			.setAuthor(message.member.displayName, message.author.displayAvatarURL())
			.setTimestamp()
			.setFooter('Advertisment');
		channel.send({embeds:[embed]});
		message.send(instance.translate('AD',message.author.id))
	}
};