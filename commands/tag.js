const tags = {
  ad: '**All Anarchists**\n-Free Kits\n-Duping\n-Base building\n-Pvping\n\nYou name it we have it! Join below:\nhttps://discord.gg/FhcJW8NbG8',
  no: 'no'
}
const choices = []
Object.keys(tags).forEach(item=>{
  choices.push({
    name: item,
    value: item
  })
})
module.exports = {
  minArgs: 1,
  category: 'Utility',
  description: 'Find a tag to get info on something',
  slash: true,
  testOnly: true,
  options: [{
    name: 'tag',
    description: 'Tag to get info on',
    type: 3,
    required: true,
    choices
    }],
  callback: ({ message, text, interaction }) => {
    console.log(text)
    const tag = tags[text.toLowerCase()]
    if(message) {
    if(!tag) return message.reply('I could not find that tag!')
    message.channel.send(tag)
    } else {
      if(!tag) return 'I could not find that tag!'
      return tag
    }
  }
}