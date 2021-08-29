module.exports = {
	name: 'unban',
	userPermissions: 'BAN_MEMBERS',
	botPermissions: 'BAN_MEMBERS',
	description: 'Unban a member',
	guildOnly: true,
	minArgs: 1,
	category: 'Moderation',
	maxArgs: -1,
	expectedArgs: '<userId> [reason]',
	callback: ({ message, args,instance }) => {
	  const user = args[0]
    args.shift()
    if(!parseInt(user)) return message.channel.send(instance.translate('USERID_NOT_NUMBER',message.author.id))
    const reason = args.join ? args.join(' ') : 'Unban command'
    message.guild.members.unban(user, reason)
      .then(user => {
        const e=instance.translate('UNBANNED',message.author.id)
         .replace(/\{user\}/gi, user.tag)
         .replace(/\{guild\}/gi, message.guild.name)
         .replace(/\{reason\}/gi, (reason == 'Unban command' ? '' : ` for ${reason}`))
            message.channel.send(e)
      })
      .catch(e => message.channel.send('Error: ', e.message))
	}
}
