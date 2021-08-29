const { MessageEmbed } = require('discord.js')
module.exports = {
  description: 'Get a indepth count of members in the current guild',
  guildOnly: true,
  aliases: ['members'],
  callback: async ({ message, args, instance })=> {
        const { guild } = message
    const members = await guild.members.fetch()
    const bots = members.filter(m=>m.user.bot)
    const users = members.filter(m=>!m.user.bot)
    if(args[0] && args[0] == 'bots') {
      const e = instance.translate('BOTS_LIST', message.author.id).replace(/\{list\}/gi, Array.from(bots.map(member=>`${member.user.tag}: ${member.presence ? member.presence.status : instance.translate('UNKNOWN', message.author.id)}`)).join('\n'))
      const embed = new MessageEmbed() 
      .setTitle(instance.translate('BOTS_GUILD',message.author.id))
      .setDescription(e)
      message.sendData({embeds:[embed]})
    } else {

    const embed = new MessageEmbed()
    .setTitle(`Member count for ${guild.name}`)
    .setDescription(`**Total:** ${guild.memberCount}\n**Bots:** ${bots.size}\n**Users:** ${users.size}`)
    .setColor(instance.colour);
    message.sendData({embeds:[embed]})
    }
  }
}