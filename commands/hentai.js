const Discord = require("discord.js");
const NSFW = require("discord-nsfw");
const nsfw = new NSFW();

module.exports = {
  nsfw:true,
  callback: async ({ message, args, instance })=> {
    const image = 'https://nekobot.xyz/api/image?type=hentai'
const embed = new Discord.MessageEmbed()
    .setTitle(`Hentai Image`)
    .setColor("GREEN")
    .setImage(image);
message.channel.send({embeds:[embeds]});
  }
}
