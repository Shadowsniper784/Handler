require('better-module-alias')(__dirname)
//console.log = console.trace
// the start() shortcut returns an instance of PrettyError ...
pe = require('pretty-error').start();
// ... which we can then use to customize like this:
pe.appendStyle({
   // this is a simple selector to the element that says 'Error'
   'pretty-error > header > title > kind': {
      // which we can hide:
      display: 'block'
   },

   // the 'colon' after 'Error':
   'pretty-error > header > colon': {
      // we hide that too:
      display: 'none'
   },

   // our error message
   'pretty-error > header > message': {
      color: 'bright-white',//txt color

      // we can use black, red, green, yellow, blue, magenta, cyan, white,
      // grey, bright-red, bright-green, bright-yellow, bright-blue,
      // bright-magenta, bright-cyan, and bright-white

      background: 'cyan',

      // it understands paddings too!
      padding: '0 1' // top/bottom left/right
   },

   // each trace item ...
   'pretty-error > trace > item': {
      // ... can have a margin ...
      marginLeft: 2,

      // ... and a bullet character!
      bullet: '"<grey>o</grey>"'

      // Notes on bullets:
      //
      // The string inside the quotation mark gets used as the character
      // to show for the bullet point.
      //
      // You can set its color/background color using tags.
      //
      // This example sets the background color to white, and the text color
      // to cyan, the character will be a hyphen with a space character
      // on each side:
      // example: '"<bg-white><cyan> - </cyan></bg-white>"'
      //
      // Note that we should use a margin of 3, since the bullet will be
      // 3 characters long.
   },

   'pretty-error > trace > item > header > pointer > file': {
      color: 'bright-cyan'
   },

   'pretty-error > trace > item > header > pointer > colon': {
      color: 'cyan'
   },

   'pretty-error > trace > item > header > pointer > line': {
      color: 'bright-cyan'
   },

   'pretty-error > trace > item > header > what': {
      color: 'bright-white'
   },

   'pretty-error > trace > item > footer > addr': {
      display: 'none'
   }
});
process.env.FONTCONFIG_PATH='./fonts';
let CommandCount
const Discord = require('discord.js'); //Get discord wrapper
global.Discord = Discord
//console.log(Discord)
const Shadow = require('$src/index.js'); //Get the handler
const Util = require('$src/Util')
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION'],presence:{	activities: [{ name: 'DM me for modmail, s/help', type: 'WATCHING' }],status: 'dnd'},intents:['GUILDS','GUILD_MESSAGES', 'DIRECT_MESSAGES','GUILD_MEMBERS','GUILD_MESSAGE_REACTIONS','GUILD_PRESENCES']}); //Creates a discord bot client
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
const { cmds, music } = require('./startup')
cmds(client)
music(client)
const GiveawaysManager = require('./giveaways/Manager.js') // Init discord giveaways
console.log(GiveawaysManager.constructor)
client.giveawaysManager = new GiveawaysManager(
	client,
	{
		storage: './giveaways.json',
		updateCountdownEvery: 3000,
		default: {
			botsCanWin: false,
			embedColor: '#FF0000',
			reaction: '🎉'
		}
	}
);
client.on('ready', async () => {
	//When the discord bot is ready, after setup
		const player = fs.readdirSync('./player').filter(file => file.endsWith('.js'));

for (const file of player) {
    const event = require(`./player/${file}`);
    client.player.on(file.split(".")[0], event.bind(null, client));
};
		await client.application?.fetch()
		//console.log(client.api.toString())
	shadow = new Shadow(client, {
		//Sets the variable shadow to a new class
		logger: false,
		testServers: ['838554125397524560'],//H was just a place holder, this would be an array containing all the test server ids
		showWarns: true, //If true the handler will print warnings to the console
		botOwners: ['659742263399940147','826551659576033332'], //Sets the bot owner id
		logMessages: true,
	//	disabledDefaultCommands: ['help'],
		mongoPath: process.env.MONGOOSE
	}); //Ends the class options
	shadow.client = {
		//This just sets shadow client to something shorter for when we console log it
		username: client.user.username, //Bot username
		id: client.user.id //Bot user id
	}
	CommandCount = shadow.CommandHandler.commands.size
	//console.log('on')
	//console.log(testeee5)
});
client.on('debug', (params) => {
  if(params.includes('Heartbeat')) return
  console.log(params)
  })
//client.on('interactionCreate', console.log)

client.login(client.token); //Login to the bot with the token so discord knows which bot we are using
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
app.disable('x-powered-by')
console.log(process.cwd())
//app.set('docs', __dirname + '/docs');
//app.use(express.static(__dirname))
app.get('/', (req, res) => {
  res.send(`<p>hi</p><script>console.log('e')</script>`)
})
app.post('/vote', (req, res, next) => {
    var header = req.headers['authorization'];
    if (header != "") return res.json({
      "error": true,
      "status": 403
    })
    const embed = new Discord.MessageEmbed()
    if (req.body.action == 'upvote') {
      embed.setTitle(req.body.username + ' has upvoted Luki at discord.boats')
    } else {
      embed.setTitle(req.body.username + ' has downvoted Luki at discord.boats')
    }
    console.log(embed)
  //  client.guilds.get('339085367770611713').channels.get('421337224198619136').send(embed)
  })
app.get('/commands/:command', (req, res) => {
  const commandInput = req.params.command || 'help'
  const commandFound = shadow.CommandHandler.getCommand(commandInput)
  if(commandFound) res.json(Util.genEmbed(commandFound))
  else res.send('No')
})
app.listen();
""