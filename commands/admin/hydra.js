const { MessageEmbed } = require('discord.js') 

module.exports = {
  name: 'hydraontopp',
  aliases: ['hyy', 'hydra'],
  category: 'Fallen Commands',
  description: 'Info on Hydra',
  callback: ({ message, args, instance }) => {
    const des = instance.translate('AGGRO',message.author.id)
    let embed = new MessageEmbed()
    .setTitle('! Hyy | HydraOnTopp')
    .setDescription('Hydra is a head admin and the owner of FVA! Hydra has been an admin for a long time!')
    .setColor(instance.defaultColour)
    .setTimestamp();
    message.sendData({embeds:[embed.toJSON()]})
  }
}