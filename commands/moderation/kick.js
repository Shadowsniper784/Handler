module.exports = {
  guildOnly: true,
  minArgs: 1,
  expectedArgs: '<mention or id> [reason]',
  userPermissions: 'KICK_MEMBERS',
  callback: ({ message, args }) => {
    const user = message.mentions.users.first() || message.guild.members.fetch(args[0]).user
    args.shift()
    const reason = args.join ? args.join(' ') : 'Kick command'
    if(!user) return message.channel.send('Error: user not found')
    else {
      user.kick(reason)
      message.channel.send(`Sucessfully kicked ${user.tag} from ${message.guild.name}`)
    }
  }
}