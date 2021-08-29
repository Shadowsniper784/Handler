const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'fieldmarshalcream',
  aliases: ['field', 'fieldmarshal'],
  category: 'Fallen Commands',
  description: 'Info on the realm founder',
  callback: ({ message, args, instance }) => {
    let embed = new MessageEmbed()
    .setTitle('FieldMarshalCream')
    .setDescription(instance.translate('FIELD', message.author.id))
    .setColor(instance.defaultColour)
    .setTimestamp();
       message.sendData({embeds:[embed.toJSON()]})
  }
}