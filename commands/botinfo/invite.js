const { MessageEmbed } = require('discord.js')
module.exports = {
	description: 'Get the invite link of the bot',
	category: 'Bot Info',
	callback: async ({ message, instance, client }) => {
	  message.send(await client.generateInvite({
	    permissions: ['ADMINISTRATOR'],
	    scopes: ['bot','applications.commands']
	  }))
	  //Unable to instance.translate (no text)
	}
}