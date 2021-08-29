module.exports = {
	name: 'role',
	category: 'Moderation',
	minArgs: 2,
	maxArgs: -1,
	expectedArgs: '<role> <user>',
	description: 'Give a user a role',
	permissions: 'MANAGE_ROLES',
  botPermissions: 'MANAGE_ROLES',
	cooldown: '2',
	ownerOnly: false,
	hidden: true,
	guildOnly: true,
	callback: async ({ message, args, instance }) => {
		const role = message.mentions.roles.first();
		console.log(message.member.roles.highest.position);
		console.log(role.position);
		if (message.author.id == instance.botOwners[0] || message.member.roles.highest.comparePositionTo(role) >= 1) {
			const member = message.mentions.members.first();
			 member.roles.add(role)
         .then(()=>message.reply('done'))
      .catch(console.error)
		} else {
			message.reply("You can't give that role");
		}
	}
};
