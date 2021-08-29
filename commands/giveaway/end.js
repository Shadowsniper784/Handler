module.exports = {
  name: 'end',
  description: 'Ends a giveaway',
  category: 'Giveaway',
  callback: ({ message, args, client }) => {
    const ms = require('ms')
       // If the member doesn't have enough permissions
    if(!message.member.permissions.has('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.send(':x: You need to have the manage messages permissions to reroll giveaways.');
    }

    // If no message ID or giveaway name is specified
   let giveaway
   if(args[0]) giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) || client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    else if(message.reference){
      giveaway = client.giveawaysManager.giveaways.find((g) => g.messageID === message.reference.messageId)
      console.log(message.reference)
    } else if(!args[0] && !message.reference){
        return message.send(':x: You have to specify a valid message ID!');
    }
    // try to found the giveaway with prize then with ID

    // Search with gi    // Search with giveaway ID
    
    // If no giveaway was found
    if(!giveaway){
        return message.send('Unable to find a giveaway for `'+ args.join(' ') + '`.');
    }

    // Edit the giveaway
    client.giveawaysManager.edit(giveaway.messageID, {
        setEndTimestamp: Date.now()
    })
    // Success message
    .then(() => {
        // Success message
        message.send('Giveaway will end in less than '+(client.giveawaysManager.options.updateCountdownEvery/1000)+' seconds...');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)){
            message.send('This giveaway is already ended!');
        } else {
            console.error(e);
            message.send('An error occured...');
        }
    });


  }
}