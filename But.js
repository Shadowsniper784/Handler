const disbut = require('discord-buttons')(client);//Buttons on messages
const { MessageButton } = require('discord-buttons');//Defines MessageButton using object destructuring this is the same as const MessageButton = require('discord-buttons').MessageButton
client.on('message', async message => {//When the bot receives a message
	if (
		message.content == '!button' &&
		message.author.id === '659742263399940147'
	) {//Checks if the message is !button and the sender has the id of 659742263399940147
		// Use this command only once and only on one channel.
		let button = new MessageButton()//Creates a MessageButton
			.setStyle('red')//Red button
			.setLabel('Advert')//Button text
			.setID('advert');//id of the button for later

		message.channel.send('Click me', { component: button });//Sends a message with the button
	}//Ends if statement
	if (
		message.content == '!urlbutton') {// &&// on one channel.
		let buttons2 = new MessageButton()
			.setStyle('url') // Button Url
			.setLabel('Discord') // Button Name
			.setURL('https://discord.com'); // URL for forwarding
		//    .setDisabled()
		message.channel.send('Message Text.', { component: buttons2 });
	}
});//Ends message event

client.on('clickButton', async button => {//When button is clicked
	button.defer();
	if (button.id === 'advert')//Checks if button id is advert
		button.channel.send(
			'**All Anarchists**\n-Free Kits\n-Duping\n-Base building\n-Pvping\n\nYou name it we have it! Join below:\nhttps://discord.gg/FhcJW8NbG8',
			true
		);//If it is send this message
	else button.channel.send('Done');//If it isn't send this message
});//End clickButton event