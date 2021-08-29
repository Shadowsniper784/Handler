function getCommands(commands, filter, prefix) {
    const data = []
    data.push('Here\'s a list of all my commands:');
    data.push(commands.filter(filter).map(command => command.name).join(', '));
    data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
    return data.join('')
}
const {
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Formatters
} = require('discord.js');
function door(message,instance,length,args,author) {
  const data = [];
            const {
                commands
            } = instance.CommandHandler
            const prefix = instance.getPrefix(message.guild)
            if (!length) {
                const row = new MessageActionRow();
                const row2 = new MessageActionRow();
                const row3 = new MessageActionRow();

                let i = 0
                const embed = new MessageEmbed()
                    .setTitle('Help')
                    .setAuthor(author.username, author.displayAvatarURL());
                instance.CommandHandler.categories.forEach(category => {
                    if (i <= 4) {
                        row.addComponents(new MessageButton()
                            .setCustomId(category)
                            .setLabel(category)
                            .setStyle('PRIMARY'))
                    } else if (i <= 8) {
                        row2.addComponents(new MessageButton()
                            .setCustomId(category)
                            .setLabel(category)
                            .setStyle('PRIMARY'))

                    } else if (i <= 12) {
                        row3.addComponents(new MessageButton()
                            .setCustomId(category)
                            .setLabel(category)
                            .setStyle('PRIMARY'))

                    }
                    //  console.log(category)
                    embed.addField(category, `\`${prefix}help ${category}\``, true)
                    i++
                })
                 row3.addComponents(new MessageButton()
                            .setCustomId('close')
                            .setLabel('close')
                            .setStyle('PRIMARY'))
                return message.reply({
                        embeds: [embed],
                        components: [row, row2, row3],
                        ephemeral: true
                    })
                    .then((m) => {
                     
                     if(!m) m=message
                     m.edit =  m.edit == undefined ? message.editReply : m.edit
                        
                        const filter = i => true
                        const collector = message.channel.createMessageComponentCollector({
                            filter,
                            time: 45000
                        });
                        collector.on('collect', async i => {
                            if (i.user.id != author.id) return await i.deferUpdate()
                            if (instance.CommandHandler.categories.has(i.customId)) {
                              console.log(i)
                               
                                const arr = []
                                commands.filter(e => e.category.toLowerCase() == i.customId).forEach(cmd => {
                                    arr.push({
                                        name: cmd.name,
                                        value: cmd.syntax.replace(/{PREFIX}/gi, prefix),
                                        inline: true
                                    })
                                })
                                const embed2 = new MessageEmbed()
                                    .setTitle('Help On ' + i.customId)
                                    .addFields(arr);
                                await i.update({
                                    embeds: [embed2]
                                });

                            }
                            else if(i.customId=='close')   m.edit({
                                embeds: [{
                                    title: `Help`,
                                    description: `This help menu has been closed or expired!`,
                                    author: {
                                        name: author.username,
                                        icon_url: author.displayAvatarURL()
                                    }
                                }],
                                components: []
                            })
                        })

                        collector.on('end', collected => {
                        
                            m.edit({
                                embeds: [{
                                    title: `Help`,
                                    description: `This help menu has expired!`,
                                    author: {
                                        name: author.username,
                                        icon_url: author.displayAvatarURL()
                                    }
                                }],
                                components: []
                            })
                            //console.log(`Collected ${collected.size} items`)
                        });
                    })
                    .catch(error => {
                        console.error(`Could not send help to ${author.tag}.\n`, error);
                    });
            }
            if (length) {
                if (instance.CommandHandler.categories.has(args.toLowerCase())) {
                    return message.reply(getCommands(commands, command => command.category.toLowerCase() == args.toLowerCase(), prefix), {
                            split: true
                        })
                        .then((m) => {
                            console.log('Done')

                        })
                        .catch(error => {
                            console.error(`Could not send help to ${author.tag}.\n`, error);
                        });
                } else {
                    const data = []
                    const name = args[0].toLowerCase();
                    const command =
            commands.find(cmd=>cmd.name==name) ||
            commands.find(
                cmd => cmd.aliases && cmd.aliases.includes(name)
            );
            console.log(commands)

                    if (!command) {
                        return message.reply('that\'s not a valid command!');
                    }

                    data.push(`**Name:** ${command.name}`);

                    if (command.aliases[0]) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
                    if (command.description) data.push(`**Description:** ${command.description}`);
                    if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

                    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

                    message.reply(data.join('\n'), {
                        split: true
                    });
                }
            }



}
module.exports = {
    cooldown: '6',
    aliases: ['commands', 'cmds'],
    slash: 'both',
    testOnly: true,
    description: 'get help on commands',
    options: [{
        name: 'query',
        type: 3,
        description: 'The category or command to get help on',
        required:false
    }],
    expectedArgs: '[command|category]',
    maxArgs: 1,
    callback: ({
        client,
        message,
        args,
        interaction,
        instance,
        text
    }) => {
        if (message && message.channel) {
          
          door(message,instance,args.length,args[0],message.author)
        }
        else door(interaction,instance,args[0] != undefined,args[0] ? args[0] : null ,interaction.user)
    }
};