module.exports = {
  minArgs: 1,
  expectedArgs: '<text>',
  callback: ({ instance, message, args, text, client }) => {
    const reply = message.reference
    if(reply && reply.messageId) {
      const msg = message.channel.messages.cache.get(reply.messageId)
      if(!msg.embeds[0] || !msg.embeds[0].author) return message.send('That message doesn\'t have any embeds that I can find!')
      const {author, footer}= msg.embeds[0]
      const id = author.iconURL.match(/\d+/gi)[0]
      console.log(id)
      const user  =client.users.cache.find(user=>(user.username == author.name && user.id == id)||(footer&&user.id==footer))
      if(!user) return message.send(instance.translate('UNKNOWN_USER',message.author.id))
      user.send(text)
      message.send(instance.translate('SENT',message.author.id))
    } else {
      message.send(instance.translate('MUST_REPLY',message.author.id))
    }
  }
}