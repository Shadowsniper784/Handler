const messages = ["Larry was founded in Fallen anarchy", "Larry is a white llama", "Larry was the most hated and threatened llama on both servers", "Larry is well known on multiple servers","Larry is king 👑", "The first larry ever born was killed by carthe aka lag clear"]
const spanish = ["Larry fue fundado en Fallen anarchy", "Larry es una llama blanca", "Larry era la llama más odiada y amenazada en ambos servidores", "Larry es bien conocido en varios servidores", "Larry es el rey 👑", " El primer larry nacido fue asesinado por carthe, también conocido como lag clear "]
module.exports = {
  name: 'larry',
  aliases: ['larrymeter'],
  callback: ({ message, args, instance }) => {
    const Util = instance.Util
    const language = instance.isSpanish(message.author.id)
  //  if(language) message.send(`${spanish[Math.round(Util.rand(0, spanish.length))-1]}`)
   // else message.send(`${messages[Math.round(Util.rand(0, messages.length))-1]}`)
return
  }
}