const implementjs = require('implement-js');
const implement = implementjs.default;
const { Interface, type } = implementjs;
module.exports = (command, fileName) => {
	const config = {
		name: command.name || fileName,
		description: command.description || '',
		category: command.category || '',
		aliases: command.aliases || [],
		expectedArgs: command.expectedArgs || '',
		minArgs: command.minArgs || 0,
		maxArgs: command.maxArgs || -1,
		testOnly: command.testOnly || false,
		guildOnly: command.guildOnly || false,
		ownerOnly: command.ownerOnly || false,
		nsfw: command.nsfw || false,
		hidden: command.hidden || false,
		userPerms: command.userPerms || '',
		botPerms: command.botPerms || '',
		cooldown: command.cooldown || ''
	};
	if(config.maxArgs != -1 && config.minArgs > config.maxArgs) throw new Error(`Command ${config.name} has minArgs higher then maxArgs!`)
};
