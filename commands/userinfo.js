const { MessageEmbed } = require('discord.js');
module.exports = {
	description: 'Get info on a user',
	maxArgs: 1,
	expectedArgs: '[@user for info]',
	aliases: ['whois'],
	category: 'Utility',
	callback: async ({ message, instance }) => {
		const formatDate = (date, year) => instance.Util.formatDate(date, year ? true : false);
		const user = message.mentions.users.first() || message.author;
		const member = message.guild ? message.guild.members.cache.get(user.id) : undefined
		const embed = new MessageEmbed()
			.setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
			.setTimestamp(formatDate(Date.now()))
			.setColor(instance.getColor(message.guild))
			.addFields([
				{
					name: 'Tag',
					value: user.tag
				},
				{
					name: 'Avatar URL',
					value: `[URL](${user.displayAvatarURL({ dynamic: true })})`
				},
				{
					name: 'User Id',
					value: user.id
				},
				{
					name: 'Joined Discord',
					value: formatDate(user.createdTimestamp, true)
				}
			]);
		if(member) {
		  embed.addFields([
		    {
		      name: 'Joined Server',
		      value: formatDate(member.joinedTimestamp, true)
		    },
		    {
		      name: 'Role Count',
		      value: member.roles.cache.size -1
		    }
		    ])
		}
		message.channel.send(embed);
	}
};
