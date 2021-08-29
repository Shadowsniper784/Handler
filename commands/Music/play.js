module.exports = {
    name: 'play',
    aliases: ['p'],
    category: 'Music',
    expectedArgs: '[name/URL]',
    callback: ({client, message, args}) =>{
        if (!message.member.voice.channel) return message.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.send(`${client.emotes.error} - You are not in the same voice channel !`);

        if (!args[0]) return message.send(`${client.emotes.error} - Please indicate the title of a song !`);

        client.player.play(message, args.join(" "), { firstResult: true });
    },
};