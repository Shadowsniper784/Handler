const { fetchCache, addToCache } = require('$features/reactionroles.js')
const messageSchema = require('$schemas/reaction-role-schema.js')

module.exports = {
  category: 'Configuration',
  description: 'Add a role to a reaction role message',
  minArgs: 3,
  botPermissions: ['SEND_MESSAGES','VIEW_CHANNEL','MANAGE_ROLES','ADD_REACTIONS','MANAGE_MESSAGES'],
  expectedArgs: '<Emoji> <Role name, tag, or ID> <Role display name>',
  userPermissions: 'ADMINISTRATOR',
  callback: async ({ message, args,instance }) => {
    const { guild } = message


    let emoji = args.shift() // 🎮
    let role = args.shift().replace(/-/gi, ' ') // Warzone
    const displayName = args.join(' ') // 'Warzone game nights'

    if (role.startsWith('<@&')) {
      role = role.substring(3, role.length - 1)
      console.log(role)
    }

    const newRole =
      guild.roles.cache.find((r) => {
        return r.name === role || r.id === role
      }) || null

    if (!newRole) {
      const e = instance.translate('UNKNOWN_ROLE',message.author.id)
      .replace(/\{role\}/gi, role)
      message.send(e)
      return
    }

    role = newRole

    if (emoji.includes(':')) {
      const emojiName = emoji.split(':')[1]
      emoji = guild.emojis.cache.find((e) => {
        return e.name === emojiName
      })
    }

    const [fetchedMessage] = fetchCache(guild.id)
    if (!fetchedMessage) {
      message.reply('An error occurred, please try again')
      return
    }

    const newLine = `${emoji} ${displayName}`
    let { content } = fetchedMessage

    if (content.includes(emoji)) {
      const split = content.split('\n')

      for (let a = 0; a < split.length; ++a) {
        if (split[a].includes(emoji)) {
          split[a] = newLine
        }
      }

      content = split.join('\n')
    } else {
      content += `\n${newLine}`
      fetchedMessage.react(emoji)
    }

    fetchedMessage.edit(content)

    const obj = {
      guildId: guild.id,
      channelId: fetchedMessage.channel.id,
      messageId: fetchedMessage.id,
    }

    await messageSchema.findOneAndUpdate(
      obj,
      {
        ...obj,
        $addToSet: {
          roles: {
            emoji,
            roleId: role.id,
          },
        },
      },
      {
        upsert: true,
      }
    )

    addToCache(guild.id, fetchedMessage, emoji, role.id)
  },
}