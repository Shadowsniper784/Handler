const messageSchema = require('$schemas/reaction-role-schema.js')
const { addToCache } = require('$features/reactionroles.js')

module.exports = {
  category: 'Configuration',
  description: 'Create a reaction role message',
  minArgs: 1,
  expectedArgs: '[Channel tag] <Message text>',
  userPermissions: 'ADMINISTRATOR',
    botPermissions: ['SEND_MESSAGES','VIEW_CHANNEL', 'MANAGE_ROLES','ADD_REACTIONS','MANAGE_MESSAGES'],
  callback: async ({ message, args,instance }) => {
    const { guild, mentions } = message
    const { channels } = mentions
    const targetChannel = channels.first() || message.channel

    if (channels.first()) {
      args.shift()
    }

    const text = args.join(' ')

    const newMessage = await targetChannel.send(text)

    if (guild.me.hasPermission('MANAGE_MESSAGES')) {
      message.delete()
    }

    if (!guild.me.hasPermission('MANAGE_ROLES')) {
      message.send(
        'The bot requires access to manage roles to be able to give or remove roles'
      )
      return
    }

    addToCache(guild.id, newMessage)

    new messageSchema({
      guildId: guild.id,
      channelId: targetChannel.id,
      messageId: newMessage.id,
    })
      .save()
      .catch(() => {
        message
          .send(instance.translate('DATABASE_ERROR',message.author.id))
          .then((message) => {
            if(instance.del != -1) message.delete({
              timeout: 1000 * instance.del,
            })
          })
      })
  },
}