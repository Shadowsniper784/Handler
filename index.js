require('module-alias/register')
process.env.FONTCONFIG_PATH='./fonts';
let cmds
const Discord = require('discord.js'); //Get discord wrapper
const Shadow = require('./src/index.js'); //Get the handler
const Util = require('./src/Util')
const client = new Discord.Client(); //Creates a discord bot client
let shadow; //Sets variable shadow to undefined
const path = require('path');
const fs = require('fs')
function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
  return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}
const repl = require('repl');
const replServer = repl.start({
	prompt: 'Shadow Commands > ',
	useColors: true
});
replServer.defineCommand('send', {
	help: 'Send message',
	action(input) {
		if (!input) return console.error('Specify text');
		this.clearBufferedCommand();
		client.channels.cache.find(c => c.name == 'test').send(input);
		this.displayPrompt();
	}
});
replServer.defineCommand('shutdown', {
	help: 'Shuts the bot down',
	action(input) {
		// Set the client user's presence
		client.user
			.setPresence({ status: 'invisible' })
			.then(console.log('Shutdown!'))
			.catch(console.error);
		client.destroy();
	}
});
replServer.defineCommand('info', {
  help: 'Get bot info',
  action(input) {
    console.log(client.user.username)
    console.log(client.user.id)
  }
})

client.on('ready', async () => {
	//When the discord bot is ready, after setup
//	console.clear();
	// Set the client user's presence
	client.user
		.setPresence({
			activity: { name: 's/help', type: 'WATCHING' },
			status: 'dnd'
		})
		.catch(console.error);
	shadow = new Shadow(client, {
		//Sets the variable shadow to a new class
		logger: false,
		dir: 'hu', 
		testServers: ['850081117284466729'],//H was just a place holder, this would be an array containing all the test server ids
		showWarns: false, //If true the handler will print warnings to the console
		botOwners: ['659742263399940147'], //Sets the bot owner id
		logMessages: true
	}); //Ends the class options
	shadow.client = {
		//This just sets shadow client to something shorter for when we console log it
		username: client.user.username, //Bot username
		id: client.user.id //Bot user id
	}
	cmds = shadow.CommandHandler.commands.size
});
client.login(process.env.TOKEN); //Login to the bot with the token so discord knows which bot we are using
module.exports = client;
module.exports.instance = shadow;
const express = require('express');
const app = express();
const router = express.Router();

const options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	index: false,
	maxAge: '1d',
	redirect: false,
	setHeaders: function(res, path, stat) {
		res.set('x-timestamp', Date.now());
	}
};
//app.set('docs', __dirname + '/docs');
//app.use(express.static(__dirname))
app.get('/', (req, res) => {
  res.json(cmds)
})
app.get('/commands/:command', (req, res) => {
  const commandInput = req.params.command || 'help'
  const commandFound = shadow.CommandHandler.getCommand(commandInput)
  if(commandFound) res.json(Util.genEmbed(commandFound))
  else res.send('No')
})
app.listen();
""