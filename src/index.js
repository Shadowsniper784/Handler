/**
 * @param {object} client - the discord.js client
 * @param {object} options - the options for the handler
 * @properties {object} options -			
      commandsDir = 'commands', //OR commandDir = 'commands',//Folder with commands, default = "commands"
			featuresDir = 'features',//OR featureDir = 'features',//Folder for events, default = "features"
			showWarns = true, //Show warnings, default = true
			del = -1,//Delete error messages after, default = -1 - dont delete
			defaultLanguage = 'english',//default language for the bot, default = "english"
			ignoreBots = true,//whether to ignore bots running commands, default = true
			testServers = '',//Test servers: array or string
			botOwners = '',//Bot owners: array or string
			defaultPrefix = '!',//default prefix to use, default = "!"
			logger = true,//Log bot stats, default = true
			disabledDefaultCommands = []//default commands to be disabled
 */
let settings = {
  
}
const { EventEmitter } = require('events');
const Feature = require('./feature');
const Command = require('./command');
const Discord = require('discord.js');
const chalk = require('chalk');
function l(text) {
	console.log(chalk.hex('#32cd32').bold(text));
}
class Shadow extends EventEmitter {
	commandsDir = 'commands';
	featuresDir = 'features';
	showWarns = true;
	del = -1;
	defaultLanguage = 'english';
	ignoreBots = false;
	testServers = '';
	botOwners = '';
	defaultPrefix = '!';
	defaultColour = 'RED';
	disabledDefaultCommands = [];
	logMessages = false;
	mongoPath = ''
	get colour() {
		return this.defaultColour;
	}
	constructor(client, options) {
		super();
		this.client = client;
		//this._options = options;
		let {
			commandsDir = 'commands',
			commandDir = 'commands',
			featuresDir = 'features',
			featureDir = 'features',
			showWarns = true,
			del = -1,
			defaultLanguage = 'english',
			ignoreBots = true,
			testServers,
			botOwners,
			defaultPrefix = '!',
			logger = true,
			disabledDefaultCommands = [],
			colour = 'RED',
			logMessages = false,
			mongoPath,
			mongoOptions
		} = options;
		this.featuresDir = featuresDir || featureDir;
		this.commandsDir = commandsDir || commandDir;
		this.defaultColour = colour;
		this.logMessages = logMessages
		if (module && require.main) {
			const { path } = require.main;
			if (path) {
				this.commandsDir = `${path}/${this.commandsDir}`;

				if (this.featuresDir) {
					this.featuresDir = `${path}/${this.featuresDir}`;
				}
			}
		}
		const mongo = require('./mongo')
		if(mongoPath) this.mongoose = mongo(mongoPath, this, mongoOptions)
		this.Util = require('./Util')
		const CommandHandler = require('./basecommand')
		const SlashCommands = require('./slashcommand')
		this.successColour = 'GREEN'
		this.failColour = 'RED'
		this.mongoPath = mongoPath
		this.showWarns = showWarns;
		this.botOwners = typeof botOwners === 'string' ? [botOwners] : botOwners
		this.defaultPrefix = defaultPrefix;
		this.testServers =
			typeof testServers === 'string' ? [testServers] : testServers
		//Create features
		this.SlashCommands = new SlashCommands(client, this)
		this.CommandHandler = new CommandHandler(client, this);
		this.FeatureHandler = new Feature(client, this, this.featuresDir);

		settings = this
		if (logger) {
		  console.table({'help':{name: 'e', val: 'b'},'reload': {name: 'how', val: '2920'}})
			console.log('Bot is ready!');
			l('______________________________________________________');
			l(`Bot Name: ${client.user.username}`);
			l(`Bot Id: ${client.user.id}`);
			l(`Commands: ${this.CommandHandler.commands.size}`);
			l(`Features: ${this.FeatureHandler.features.size}`);
			l('______________________________________________________');
		}
		//require('../dashboard/server.js')(this)
		return this
	}
	getPrefix() {
		return 's/';
	}
	getCommands() {
	  return this.CommandHandler.commands
	}
	getColor(guild) {
	  return 'FF0000'
	} get embed() {
	  return Discord.MessageEmbed
	}
	button(message) {
		let btn = new disbut.MessageButton()
			.setStyle('url')
			.setURL('https://npmjs.com/discord-buttons')
			.setLabel('My First URL Button!')
			.setDisabled();

		message.channel.send(
			'Hey, i am powered by https://npmjs.com/discord-buttons',
			btn
		);
	}
}
module.exports = Shadow;
module.exports.settings = settings