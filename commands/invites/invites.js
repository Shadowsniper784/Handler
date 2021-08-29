module.exports = {
	description: 'Get a member\'s invites',
	minArgs: 0,
	category: 'Moderation',
	guildOnly: true,
	maxArgs: 1,
	expectedArgs: '[@member]',
	callback: async ({ message, instance }) => {
    let invites = await instance.Util.invites(message.guild)
    let reqUser = message.mentions.users.first() || message.author
   // console.log(invites)
    let amount = invites[reqUser.tag] || 0
    if(reqUser.username == 'Shadowsniper784') amount = '\u221E'
    const e = instance.translate('INVITES', message.author.id)
    .replace(/\{user\}/gi, reqUser.tag)
    .replace(/\{amount\}/gi, amount)
    message.send(e)
    //instance.translate('FIELD', message.author.id)
	}
}