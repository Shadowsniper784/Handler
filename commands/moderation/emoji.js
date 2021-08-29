module.exports = {
  name: 'emoji',
	description: 'Get an emoji image',
	minArgs: 1,
	category: 'Utility',
	maxArgs: 1,
	expectedArgs: '<custom emoji>',
  callback: ({ message, args,instance }) => {
    const id = args[0].replace(/<:[a-z0-9_-]+:/gi, '').replace(/>/gi, '')
    if(id != args[0]) return message.channel.send(`https://cdn.discordapp.com/emojis/${id}.png`)
    message.channel.send(instance.translate('UNKNOWN_EMOJI', message.author.id))
  }
}