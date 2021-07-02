/**
 * @constructor
 * @param {object} client - the discord.js client
 * @param {object} instance - the instance of Shadow Commands
 * @param {string} instance.commandsDir - the command dir to search through to get all commands
 * @returns {Collection} this.commands - All the commands mapped as {'name' => command}
 *
 *
 */

const getAllFiles = require('./getallfiles');
const path = require('path');
const Discord = require('discord.js');
const permissionList = require('./permissions');
class Command {
	commands = new Discord.Collection();
	#client;
	#instance;
	#cooldowns = new Discord.Collection();
	constructor(client, instance) {
		this.#client = client;
		this.#instance = instance;
		for (const [file, fileName] of getAllFiles(
			path.join(__dirname, 'commands')
		)) {
			this.registerCommand(file, fileName);
		}
		for (const [file, fileName] of getAllFiles(instance.commandsDir)) {
			this.registerCommand(file, fileName);
		}
		client.on('message', message => {
			this.runCommand(message, 's/');
		});
	}
	async reloadCommand(cmd, message) {
		const commandName = cmd.toLowerCase();
		const command = this.getCommand(commandName)

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`!`)
		}
		delete require.cache[require.resolve(`${command.path}`)];
		try {
		  const filePath = command.path
		  const fileName = path.parse(filePath).name
			const name = await this.registerCommand(filePath, fileName)
			return message.channel.send(`Command \`${name}\` was reloaded!`)
		} catch (error) {
			console.error(error);
			return message.channel.send(`There was an error while reloading a command \`${
				command.name
			}\`:\n\`${error.message}\``)
		}
	}
	runCommand(message, prefix) {
	  if(!message.content.startsWith(prefix)) return
		const args = message.content
			.slice(prefix.length)
			.trim()
			.split(' ');
		const commandName = args.shift().toLowerCase();
		const command =
			this.commands.get(commandName) ||
			this.commands.find(
				cmd => cmd.aliases && cmd.aliases.includes(commandName)
			);
		const instance = this.#instance;
		instance.CommandHandler = this;
		const client = this.#client;
		if (!command) return;
		const {
			slash,
			testOnly,
			guildOnly,
			minArgs,
			maxArgs,
			nsfw,
			ownerOnly,
			userPermissions,
			botPermissions,
			name,
			description,
			category,
			cooldown,
			hidden,
			aliases
		} = command;
		const { guild, channel, author } = message;
		if (slash === true) return;
		if (testOnly && (!guild || !instance.testServers.includes(guild.id)))
			return;
		if (guildOnly && !guild) return;
		if (
			(minArgs != 0 && minArgs > args.length) ||
			(maxArgs != -1 && maxArgs < args.length)
		)
			return this.args(prefix, message, command);
		if (nsfw && !channel.nsfw) return this.nsfw(message, command);
		if (ownerOnly && !instance.botOwners.includes(message.author.id))
			return this.ownerOnly(message, command);
		if (
			userPermissions != '' &&
			(!message.member ||
				!message.member.permissions.has(userPermissions) ||
				!instance.botOwners.includes(message.member.user.id))
		)
			return this.userPermissions(message, command);
		if (
			botPermissions != '' &&
			(!guild || !guild.me.permissions.has(botPermissions))
		)
			return this.botPermissions(message, command);
		if (!this.doCooldowns(message, command)) return;
		const callbacks = 'callback' || 'execute' || 'run';
		
	
		try {
			command[callbacks]({
				message,
				args,
				text: args.join ? args.join(' ') : '',
				instance,
				client: this.#client,
				reply: message.reply
			});
		} catch(e) {
			message.reply(
				'this command could not execute due to an error, the developers have been contacted'
			);
			console.log(e);
		}
	}
	async registerCommand(file, fileName) {
		var command = require(file);
		let {
			name = fileName,
			description = '',
			category = 'General',
			minArgs = 0,
			maxArgs = -1,
			expectedArgs = '',
			cooldown = '3',
			testOnly = false,
			ownerOnly = false,
			nsfw = false,
			guildOnly = false,
			hidden = false,
			slash = false,
			userPermissions,
			permissions,
			botPermissions,
			init,
			aliases = []
		} = command;
		const instance = this.#instance
		const isTypeOf = (typeName, val, type) => {
			if (!type) type = 'string';
			if (typeof val !== type)
				throw new Error(
					`Command ${file} does not have a ${type} as ${typeName}`
				);
		};
		const has = thing => {
			if (!this.#instance[thing]) return false;
			else return true;
		};
		const cmd = command;
		isTypeOf('name', name);
		isTypeOf('description', description);
		isTypeOf('category', category);
		isTypeOf('minArgs', minArgs, 'number');
		isTypeOf('maxArgs', maxArgs, 'number');
		isTypeOf('expectedArgs', expectedArgs);
		if (maxArgs != -1 && minArgs > maxArgs)
			throw new Error(`Command ${file} has a minArgs higher then max args!`);
		isTypeOf('testOnly', testOnly, 'boolean');
		if (testOnly && !has('testServers'))
			throw new Error(
				`Command ${file} is testOnly but no test servers have been specified!`
			);
		isTypeOf('ownerOnly', ownerOnly, 'boolean');
		if (ownerOnly && !has('botOwners'))
			throw new Error(
				`Command ${file} is ownerOnly but no bot owners have been specified!`
			);
		isTypeOf('nsfw', nsfw, 'boolean');
		isTypeOf('guildOnly', guildOnly, 'boolean');
		isTypeOf('hidden', hidden, 'boolean');
		if (slash !== undefined && typeof slash !== "boolean" && slash !== "both") {
      throw new Error(
        `Shadow Commands > Command "${name}" has a "slash" property that is not boolean "true" or string "both".`
      );
    }

    if (slash) {
      if (!description) {
        throw new Error(
          `Shadow Commands > A description is required for command "${name}" because it is a slash command.`
        );
      }

      if (minArgs !== undefined && !cmd.options) {
        throw new Error(
          `Shadow Commands > Command "${name}" has "minArgs" property defined without "expectedArgs" property or "options" property as a slash command.`
        );
      }

      const slashCommands = instance.SlashCommands;
      let options = [];

      if (expectedArgs) {
        const split = expectedArgs
          .substring(1, expectedArgs.length - 1)
          .split(/[>\]] [<\[]/);

        for (let a = 0; a < split.length; ++a) {
          const item = split[a];

          options.push({
            name: item.replace(/ /g, "-"),
            description: item,
            type: 3,
            required: a < minArgs,
          });
        }
      }
      if(cmd.options) {
        options= cmd.options 
      }

      if (testOnly) {
        for (const id of instance.testServers) {
          await slashCommands.createCommand(name, description, options, id);
        }
      } else {
        await slashCommands.createCommand(name, description, options);
      }
    }
		if (init) isTypeOf('init', init, 'function');
		if (typeof aliases == 'string') aliases = [aliases];
		if (typeof aliases != typeof [])
			throw new Error(`Aliases of command ${name} is not a string or array!`);
		const callbacks = 'callback' || 'execute' || 'run';
		if (typeof command[callbacks] === 'undefined')
			throw new Error(
				`Command ${name} does not have "run", "execute" or "callback"`
			);
		userPermissions = userPermissions || permissions;
		userPermissions =
			typeof userPermissions == 'string'
				? [userPermissions]
				: typeof userPermissions == 'object'
					? userPermissions
					: [];
		botPermissions =
			typeof botPermissions == 'string'
				? [botPermissions]
				: typeof botPermissions == 'object'
					? botPermissions
					: [];
		if(userPermissions) this.getPerm(userPermissions, file)
		if(botPermissions) this.getPerm(botPermissions, file)
		command = {
			name: name,
			description: description,
			category: category,
			minArgs: minArgs,
			maxArgs: maxArgs,
			expectedArgs: expectedArgs,
			cooldown: cooldown,
			testOnly: testOnly,
			ownerOnly: ownerOnly,
			nsfw: nsfw,
			guildOnly: guildOnly,
			hidden: hidden,
			slash: slash,
			userPermissions: userPermissions,
			botPermissions: botPermissions,
			aliases: aliases,
			path: file
		};
		function getExpected(expected) {
		  const k = ""
		}
		command.syntax = this.#instance.defaultPrefix + command.name + ' ' + command.expectedArgs
		command[callbacks] = cmd[callbacks];
		this.commands.set(name.toLowerCase(), command);
		return command.name
	}
	doCooldowns(message, cmd) {
		const cooldowns = this.#cooldowns;
		if (!cooldowns.has(cmd.name)) {
			cooldowns.set(cmd.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(cmd.name);
		const cooldownAmount = (cmd.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				message.reply(
					`please wait ${timeLeft.toFixed(
						1
					)} more second(s) before reusing the \`${cmd.name}\` command.`
				);
				return false;
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		return true;
	}
	getPerm(permission, file) {
	 // console.log(permission)
		for (const perm of permission) {
			if (!permissionList.includes(perm)) {
				throw new Error(
					`Command located at "${file}" has an invalid permission node: "${perm}". Permissions must be all upper case and be one of the following: "${[
						...permissionList
					].join('", "')}"`
				);
			}
		}
	}
	args(prefix, message, command) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.expectedArgs) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${
				command.expectedArgs
			}\``;
		}

		return message.channel.send(reply);
	}
	nsfw(message, command) {
		return message.reply(
			`you need to be in a NSFW channel to use the command ${command.name}`
		);
	}
	ownerOnly(message, command) {
		return message.reply('this command can only be used by the bot owner!');
	}
	userPermissions(message, command) {
		return message.reply(
			`you need the permission ${command.userPermissions} to use this command!`
		);
	}
	botPermissions(message, command) {
		return message.reply(
			`the bot needs the permission ${
				command.botPermissions
			} to execute this command!`
		);
	}
	getCommand(commandName) {
	  commandName = commandName.toLowerCase();
		const command =
			this.commands.get(commandName) ||
			this.commands.find(
				cmd => cmd.aliases && cmd.aliases.includes(commandName)
			);
			return command
	}
}
module.exports = Command;
