module.exports = {
	name: 'kick',
	userPermissions: 'KICK_MEMBERS',
	botPermissions: 'KICK_MEMBERS',
	description: 'Kick a member',
	minArgs: 1,
	category: 'Moderation',
	maxArgs: -1,
	expectedArgs: '<@member> [reason]',
  callback: ({ message, args }) => {
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]).user
    args.shift()
    const reason = args.join ? args.join(' ') : 'Kick command'
    if(!user) return message.channel.send(instance.translate('UNKNOWN_USER', message.author.id))
    else {
      user.kick(reason)
        const e=instance.translate('KICKED',message.author.id)
         .replace(/\{user\}/gi, user.tag)
         .replace(/\{guild\}/gi, message.guild.name)
         .replace(/\{reason\}/gi, (reason == 'Kick command' ? '' : ` for ${reason}`))
      message.send(e)
    }
  }
}