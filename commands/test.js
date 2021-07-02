module.exports = {
  minArgs: 1,
  category: 'Test',
  callback: ({ message, args, client }) => {
    if(args[0] === 'join') client.emit('guildMemberAdd', message.member)
    else if(args[0] === 'leave') client.emit('guildMemberRemove', message.member)
    else return message.reply('Please state `join` or `leave`')
  }
}