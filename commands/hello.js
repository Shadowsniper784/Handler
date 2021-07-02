module.exports = {
  category: 'Test',
  callback: ({ message, reply }) => {
    reply(`Hello ${message.author.username}!`)
  }
}