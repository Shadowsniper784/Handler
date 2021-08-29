module.exports = {
  name: 'purge',
  aliases: ['clear'],
	userPermissions: 'MANAGE_MESSAGES',
	botPermissions: 'MANAGE_MESSAGES',
	description: 'Bulk delete messages',
	guildOnly: true,
	minArgs: 1,
	category: 'Moderation',
	maxArgs: 1,
	expectedArgs: '<amount>',
  callback: ({ message, args }) => {
    message.channel.bulkDelete(args[0])
    message.delete()
    //Unable to instance.translate (no message)
  }
}