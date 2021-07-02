const data = {
  '850081117284466729': {
    channelId: '850087989371338792',
    welcomeMessage: 'Ho'
  }
}
module.exports = (client) => {
  client.on('guildMemberAdd', member => {
    const guild = member.guild
    const { channelId, welcomeMessage } = data[guild.id]
    const channel = guild.channels.cache.get(channelId)
    if(!channel || !welcomeMessage) return
    channel.send(welcomeMessage)
    //member.guild.channels.cache.find(c => c.name==='welcome').send(`Welcome ${member.displayName} to **Fallen Anarchists**!`)
  })
  client.on('guildMemberRemove', member => {
    member.guild.channels.cache.find(c => c.name==='welcome').send(`Goodbye ${member.user.tag}, we will miss you!`)
  })
}