module.exports = {
  slash: true,
  name: 'sub',
  description: 'Sub commands test',
  options: [{
    name: 'test',
    description: "Test 1",
    type: 1, // 1 is type SUB_COMMAND
  },
  {
    name:'larry',
    description: 'Try it',
    type: 1
  }],
  testOnly: true,
  callback: async ({ interaction, subcommand, instance })=> {
   // console.dir(interaction)
    instance.client = {}
        console.dir(instance.CommandHandler.commands.get('larry').callback)

    switch (subcommand.name) {
      case 'test': 
        interaction.reply('Hi')
        break
      case 'try':
        interaction.reply('Bye')
        break
      case 'larry': 
        interaction.reply(await instance.CommandHandler.execute('larry', interaction))
        break
    }
  }
}