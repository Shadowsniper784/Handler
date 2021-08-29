module.exports = {
	name: 'ban',
	userPermissions: 'BAN_MEMBERS',
	botPermissions: 'BAN_MEMBERS',
	description: 'Ban a member',
	guildOnly: true,
	minArgs: 1,
	category: 'Moderation',
	maxArgs: -1,
	expectedArgs: '<@member> [reason]',
  callback: async ({ message, args, instance }) => {
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]).user
    args.shift()
    const reason = args.join ? args.join(' ') : 'Ban command'
    if(!user) return message.send(instance.translate('UNKNOWN_USER',message.author.id))
   const member = await message.guild.members.fetch(user.id)
    if(!member) return message.send(instance.translate('UNKNOWN_USER',message.author.id))

      member.ban({
            reason
          })
    const e=instance.translate('BANNED',message.author.id)
         .replace(/\{user\}/gi, user.tag)
         .replace(/\{guild\}/gi, message.guild.name)
         .replace(/\{reason\}/gi, (reason == 'Ban command' ? '' : ` for ${reason}`))
      message.send(e)
      //Sucessfully banned ${user.tag} from ${message.guild.name}${reason == 'Ban command' ? '' : ` for ${reason}`}`)
    }
}