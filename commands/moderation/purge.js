module.exports = {
  category: 'Moderation',
  callback: ({ message, args }) => {
    message.channel.bulkDelete(args[0])
  }
}