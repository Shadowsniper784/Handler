module.exports = {
  name: 'slowmode',
  aliases: ['slow'],
  description: 'Sets the slowmode of a channel',
  guildOnly: true,
  minArgs: 1,
  maxArgs: 2,
  expectedArgs: '<time> [channel]',
  userPermissions: 'MANAGE_CHANNELS',
  botPermissions: 'MANAGE_CHANNELS',
  category: 'Moderation',
  callback: ({ message, client, args, instance }) => {
  const time = args[0]
  const channel = message.mentions.channels.first() || message.channel
  channel.setRateLimitPerUser(time)
  const e = instance.translate('SLOWMODE_SET',message.author.id)
  .replace(/\{time\}/gi,time)
  .replace(/\{channel\}/gi,channel)
  message.channel.send(e)
  }
}