module.exports = { 
	name: 'nick',
	description: 'Nickname member',
	expectedArgs: '<user> [text]',
  botPetmissions: 'MANAGE_NICKNAMES',
  minArgs: 1,
  
	callback: ({ message, args, text }) => {
	  let user = message.mentions.users.first()
	  if(!user) user= message.author
	  if((user.id === message.author.id && !message.member.permissions.has('CHANGE_NICKNAME')) || (!message.member.permissions.has('MANAGE_NICKNAMES') && !user.id === message.author.id)) return message.send('You don\'t have the required perms to use that!')
	  const member = message.guild.members.cache.get(user.id)
	  if(user.id != message.author.id) args.shift()
    if(args.join(' ').length > 32) return message.send('A discord nickname must be under 32 characters!')
	  member.setNickname(args.join(' ') || user.username)
	  message.send(`Sucessfully set ${user == message.author ? 'your' : user.username+"'s "} nickname to ${args.join(' ') || user.username}`)
	}
}