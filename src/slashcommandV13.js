const {
	APIMessage,
	APIMessageContentResolvable,
	Channel,
	Client,
	Guild,
	GuildMember,
	MessageEmbed
} = require('discord.js');
/**
 * @class SlashCommand - Slash command handler
 */
class SlashCommand {
	#client;
	#instance;
	 /** 
 * @constructs ShadowCommand 
 * @param {Object} client - The discord.js client
 * @param {Object} instance - Shadow command instance
 * @param {boolean} listen - If it is listening for INTERACTION_CREATE event
 * @default true
 */
	constructor(client, instance, listen = true) {
		this.#client = client;
		this.#instance = instance;
		

    if (listen) {
      // @ts-ignore
      this.#client.on("interactionCreate", async (interaction) => {
       // console.dir(interaction)
        if (!interaction.isCommand()) return;
        const { member, data, guildId, channelId, commandName, options} = interaction;

        const command = commandName.toLowerCase();
        const guild = this.#client.guilds.cache.get(guildId);
        const args = await this.getArrayFromOptions(guild, options);
        if(guild.channels) {
        const channel = guild.channels.cache.get(channelId);
        this.invokeCommand(interaction, command, args, member, guild, channel);
        }
      });
    }
	}
	async getApp(guildId) {
		const app = await this.#client.applications(this.#client.user.id);
		if (guildId) {
			app.guilds(guildId);
		}
		return app;
	}
	async getCommands(guildId) {
		if(!guildId) return this.client.application?.commands.fetch()
		if(guildId) return this.client.application.commands.fetch(undefined, {guildId})
	}
	async createCommand(name, description, options, guildId) {
	  if(guildId) await this.#client.guilds.cache.get(guildId)?.commands?.create({name,description,options})
		else await this.#client.application?.commands.create({
				name,
				description,
				options
		});
		if(!this.#client.application) throw 'No application'
	}
	async deleteCommand(commandId, guildId) {
		await this.#client.application?.commands.delete(commandId, guildId);
	}
	async getMemberIfExists(value, guild) {
		if (
			value &&
			typeof value === 'string' &&
			value.startsWith('<@!') &&
			value.endsWith('>')
		) {
			let userId = value.substring(2, value.length - 1);
			if (isNaN(userId)) return false;
			value = guild.members.cache.get(userId);
		}
		return value;
	}
	async createAPIMessage(client, interaction, content) {
		const { data, files } = await APIMessage.create(
			// @ts-ignore
			client.channels.resolve(interaction.channelId),
			content
		)
			.resolveData()
			.resolveFiles();

		return { ...data, files };
	}
	async getObjectFromOptions(guild, options) {
    const args = {};
    if (!options) {
      return args;
    }

    for (const { name, value } of options) {
      args[name] = this.getMemberIfExists(value, guild);
    }

    return args;
  }
  async getArrayFromOptions(guild,options) {
    const args= [];
    
    if (!options) {
      return args;
    }

    for (const { value } of options) {
      args.push(await this.getMemberIfExists(value, guild));
    }

    return args;
  }
	async invokeCommand(
		interaction,
		commandName,
		options,
		member,
		guild,
		channel
	) {
		const command = this.#instance.CommandHandler.getCommand(commandName);

		if (!command || !command.callback) {
			return false;
		}
		let interactionResponse = {
		  id: interaction.id
		}
		const sendContent = this.sendContent
		const createAPIMessage = this.createAPIMessage
		const client = this.#client
		let hasReplied = false
		let subcommand = interaction.options.find(obj=>obj.type=='SUB_COMMAND') 
		let cmdresult = await command.callback({
			member,
			guild,
			channel,
			args: options,
			// @ts-ignore
			text: options.join ? options.join(' ') : '',
			client: this.#client,
			instance: this.#instance,
			interaction,
			subcommand: {
			  value: subcommand ? true : false,
			  name: subcommand ? subcommand.name : undefined
			}
		})
			if (!cmdresult) {
			console.error(
				`Shadow commands > Command "${commandName}" did not return any content from it's callback function. This is required as it is a slash command.`
			);
			return false;
		}
		let result= cmdresult.result
		if (!result) {
			console.error(
				`Shadow commands > Command "${commandName}" did not return any content from it's callback function. This is required as it is a slash command.`
			);
			return false;
		}
		if(!hasReplied) {
		  await sendContent(createAPIMessage, client, interaction, result, cmdresult)
		  hasReplied = true
		}
		return true;
	}
	send(interaction, result, options) {
	  
	}
	async sendContent(createAPIMessage, client, interaction, result, options={}) {
	  let data = {
			content: result
		};

		// Handle embeds
		if (typeof result === 'object') {
		  const embedResult = result.embed ? result.embed : embed
			const embed = new MessageEmbed(embedResult);
			data = {embeds:[embed]}
		}
		data.ephemeral = options.userOnly ? true : false
		// @ts-ignore
		interaction.reply(data)
	}
}
module.exports = SlashCommand