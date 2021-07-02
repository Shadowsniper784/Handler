module.exports = {
  name: 'larry',
  aliases: ['larrymeter'],
  callback: ({ message, args, instance }) => {
    const Util = instance.Util 
    message.channel.send(`You like Larry ${Math.round(Util.rand(1, 99))}%!`)
  }
}