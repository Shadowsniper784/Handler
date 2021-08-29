module.exports = {
    name: 'pause',
    aliases: [],
    category: 'Music',
    callback: ({client, message})=> {
        if (!message.member.voice.channel) return message.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.send(`${client.emotes.error} - You are not in the same voice channel !`);

        if (!client.player.getQueue(message)) return message.send(`${client.emotes.error} - No music currently playing !`);

        if (client.player.getQueue(message).paused) return message.send(`${client.emotes.error} - The music is already paused !`);

        const success = client.player.pause(message);

        if (success) message.send(`${client.emotes.success} - Song ${client.player.getQueue(message).playing.title} paused !`);
    },
};