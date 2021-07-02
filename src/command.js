const getAllFiles = require('./getallfiles');
const handlerName = 'Shadow Commands';
const chalk = require('chalk');
const Discord = require('discord.js');
//let template = require('./cmd');
const permissionList = require('./permissions')
function l(text) {
	console.log(chalk.hex('#32cd32').bold(text));
}
const Errors = {
	testOnly: function(message) {
		return message.channel.send('You have to be in a test server to use this!');
	},
	ownerOnly: function(message) {
		return message.channel.send('You have to be the bot owner to use this!');
	},
	guildOnly: function(message) {
		return message.channel.send('You have to be in a guild to use this!');
	},
	nsfw: function(message) {
		return message.channel.send(
			'You have to be in a nsfw channel to use this!'
		);
	},
	args: function(message) {
		return message.channel.send('You did not specify the correct arguments');
	},
	permissions: function(message, perm) {
		return message.channel.send(`You need ${perm} to use this command!`);
	}
};
const path = require('path');
class Command {
	#client;
	commands = new Discord.Collection();
	constructor(client, instance) {
		this.#client = client;
		var file, fileName;
		for ([file, fileName] of getAllFiles(path.join(__dirname, 'commands'))) {
			if (instance.disabledDefaultCommands.includes(fileName)) {
				continue;
			}
			this.registerCommand(client, instance, file, fileName);
		}
		for (const [file, fileName] of getAllFiles(instance.commandsDir)) {
			this.registerCommand(client, instance, file, fileName);
		}
		client.on('message', async message => {
		  if(instance.logMessages) console.log(`${message.guild ? message.guild.name + ':': ''}${message.channel.name}:${message.author.tag}: ${message.content}`)
			const guilds = require('../data/guilds');
			const savedGuild = await guilds.get(message.guild);
			const prefix = savedGuild.general.prefix;

			const channelIsBlacklisted = savedGuild.general.blacklistedChannelIds.includes(
				message.channel.id
			);
			if (channelIsBlacklisted) return;

			if (!message.content.startsWith(prefix)) return;
			if (instance.ignoreBots && message.author.bot) {
				return;
			}

			if (!message.content)
				console.warn('Message: %o, does not have any content', message);
			const args = message.content
				.slice(prefix.length)
				.trim()
				.split(' ');
			this.runCommand(args, message, instance);
		});
	}
	runCommand(args, message, instance) {
		const { testServers, botOwners } = instance;
		const client = this.#client;
		const content = message.content;
		const authorId = message.author.id;
		const commandName = args.shift().toLowerCase();
		const command =
			this.commands.get(commandName) ||
			this.commands.find(
				cmd => cmd.aliases && cmd.aliases.includes(commandName)
			);

		if (!command) return;
		const {
			category,
			minArgs = 0, //
			maxArgs = -1, //
			expectedArgs,
			description,
			permissions, //
			cooldown = '',
			nsfw = false,
			ownerOnly = false, //
			hidden = false,
			guildOnly = false, //
			testOnly = false, //
			slash = false //
		} = command;
		if (slash === true) return;
		if (
			(testOnly === true && !message.guild) ||
			(testOnly === true && !testServers.includes(message.guild.id))
		)
			return Errors.testOnly(message); //testOnly
		if (ownerOnly === true && !botOwners.includes(authorId))
			return Errors.ownerOnly(message); //ownerOnly
		if (guildOnly && !message.guild) return Errors.guildOnly(message); //guildOnly
		if (nsfw && !message.channel.nsfw) return Errors.nsfw(message); //Nsfw
		if (
			(minArgs !== undefined && args.length < minArgs) ||
			(maxArgs !== undefined && maxArgs !== -1 && args.length > maxArgs)
		)
			return Errors.args(message); //Min and max args
		if (
			(!message.guild && permissions) ||
			(permissions && message.member.permissions.has(permissions))
		)
			return Errors.permissions(message, permissions);

		function reply(content) {
			const fetch = require('node-fetch');
			const url = `https://discord.com/api/v8/channels/${
				message.channel.id
			}/messages`;
			var payload = {
				content,
				tts: false,
				message_reference: {
					message_id: message.id
				}
			};
			fetch(url, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					Authorization: `${client.user.bot ? 'Bot ' : ''}${client.token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}).catch(() => {});
		}
		try {
			command.callback({
				message,
				args,
				instance,
				client,
				reply,
				text: args.join ? args.join(' ') : ''
			});
		} catch (e) {
			//  console.log(e)

			var error = `Type: ${e.name} \nIssue: ${e.message} \nAt: ${
				e.fileName
			}\nLine number: ${e.lime}`;
			var msg = instance.botOwners.includes(message.author.id) ? error : '';
			instance.emit('commandError', command, e);
			console.error(e);

			message.channel.send('An error has occured\n' + msg);
		}
	}
	registerCommand(client, instance, file, fileName) {
		let configuration = require(file);

		// person is using 'export default' so we import the default instead
		if (configuration.default && Object.keys(configuration).length === 1) {
			configuration = configuration.default;
		}

		const {
			name = fileName,
			category,
			commands,
			aliases,
			init,
			callback,
			execute,
			run,
			error,
			description,
			requiredPermissions,
			permissions,
			testOnly = false,
			slash = false,
			expectedArgs,
			minArgs
		} = configuration;

		let callbackCounter = 0;
		if (callback) ++callbackCounter;
		if (execute) ++callbackCounter;
		if (run) ++callbackCounter;

		if (callbackCounter > 1) {
			throw new Error(
				'Commands can have "callback", "execute", or "run" functions, but not multiple.'
			);
		}
		configuration.category = configuration.category || 'General';
		let names = commands || aliases || [];

		if (!name && (!names || names.length === 0)) {
			throw new Error(
				`Command located at "${file}" does not have a name, commands array, or aliases array set. Please set at lease one property to specify the command name.`
			);
		}
		configuration.name = name;
		if (typeof names === 'string') {
			names = [names];
		}

		if (typeof name !== 'string') {
			throw new Error(
				`Command located at "${file}" does not have a string as a name.`
			);
		}

		if (name && !names.includes(name.toLowerCase())) {
			names.unshift(name.toLowerCase());
		}

		if (requiredPermissions || permissions) {
			for (const perm of requiredPermissions || permissions) {
				if (!permissionList.includes(perm)) {
					throw new Error(
						`Command located at "${file}" has an invalid permission node: "${perm}". Permissions must be all upper case and be one of the following: "${[
							...permissionList
						].join('", "')}"`
					);
				}
			}
		}

		const missing = [];

		if (!category) {
			missing.push('Category');
		}

		if (!description) {
			missing.push('Description');
		}

		if (missing.length && instance.showWarns) {
			console.warn(
				`${handlerName} > Command "${
					names[0]
				}" does not have the following properties: ${missing}.`
			);
		}

    if (permissions) {
      for (const perm of permissions) {
        if (!permissionList.includes(perm)) {
          throw new Error(
            `Command located at "${file}" has an invalid permission node: "${perm}". Permissions must be all upper case and be one of the following: "${[
              ...permissionList,
            ].join('", "')}"`
          );
        }
      }
    }
		if (testOnly && !instance.testServers.length) {
			console.warn(
				`${handlerName} > Command "${
					names[0]
				}" has "testOnly" set to true, but no test servers are defined.`
			);
		}

		if (slash !== undefined && typeof slash !== 'boolean' && slash !== 'both') {
			throw new Error(
				`${handlerName} > Command "${name}" has a "slash" property that is not boolean "true" or string "both".`
			);
		}

		const hasCallback = callback || execute || run;

		if (hasCallback) {
			if (init) {
				init(client, instance);
			}

			for (const name of names) {
				// Ensure the alias is lower case because we read as lower case later on
				this.commands.set(name.toLowerCase(), configuration);
			}
		}
	}
	getCommand(name) {
		return this.commands.find(cmd => name.toLowerCase() === cmd.name) || null;
	}
}
module.exports = Command;
