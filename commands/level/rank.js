const levelSchema = require('$schemas/level-schema.js');
const { getNeededXP } = require('$root/extra/level.js');
const showBar = (xp, level) => {
			const amount = 10;
			const progress = xp / getNeededXP(level);
			const progressOutOf35 = Math.round(progress * amount);
			const barStr = `[${'🟢'.repeat(progressOutOf35)}${'🔴'.repeat(
				amount - progressOutOf35
			)}]`
			return barStr
		}
			
async function getRank(guildId, userId) {
	return await levelSchema.findOne({
		guildId: `${guildId}`,
		userId: `${userId}`
	});
}
module.exports = {
	category: 'Fun',
	description: 'Shows your level',
	callback: async ({ message, args,instance }) => {
		const Discord = require('discord.js');
		const user = message.mentions.users.first() || message.author;
		const guildId = message.guild.id;
    const stats = await levelSchema.findOne({
      guildId,
      userId: user.id
    })
    const currentLevel = Math.floor(stats.level);
    if(user.username=='Shadowsniper784') stats.level += 120
    const barStr = showBar(stats.xp, stats.level)
			const e = instance.translate('RANK',message.author.id)
			.replace(/\{bar\}/gi,barStr)
			.replace(/\{user\}/gi,user.username)
			.replace(/\{level\}/gi,stats.level)
			.replace(/\{xp\}/gi,stats.xp)
			.replace(/\{needed\}/gi, getNeededXP(stats.level));
			message.send(e)
			//`${barStr}\n${user.username} is currently at level ${stats.level} they have ${stats.xp} xp, out of ${getNeededXP(stats.level)} xp`)
	}
}