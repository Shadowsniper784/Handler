module.exports = {
	description: 'Get a member\'s invites',
	minArgs: 0,
	category: 'Moderation',
	guildOnly: true,
	maxArgs: 0,
	expectedArgs: '[@member]',
	callback: async ({ message, instance }) => {
    let invites = await instance.Util.invites(message.guild)
    		let array = [];
		for(let [user, value] of Object.entries(invites)) {
			array.push({ name: user, count: value });
		}
	array =	array.sort((a, b) => b.count -a.count);
		const { MessageEmbed } = require('discord.js');
		const embed = new MessageEmbed();
		array.forEach((item, pos) => {
			const number = pos + 1;
				embed.addField(
					`**${number}**:`,
					`**${item.name}** ${instance.translate('HAS',message.author.id)} ${item.count} invite${item.count == 1 ? '' : 's'}!`
				);
		});
		embed.setColor('58ff11');
		embed.setTitle(instance.translate('TOP_INVITERS',message.author.id));
		embed.setTimestamp();
		embed.setFooter(`Command run by ${message.member.displayName}`);
		message.sendData({embeds:[embed]});
	}
}