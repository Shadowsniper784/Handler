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
      this.#client.ws.on("INTERACTION_CREATE", async (interaction) => {
        const { member, data, guild_id, channel_id } = interaction;
        const { name, options } = data;

        const command = name.toLowerCase();
        const guild = this.#client.guilds.cache.get(guild_id);
        const args = await this.getArrayFromOptions(guild, options);
        console.log(args)
        if(guild.channels) {
        const channel = guild.channels.cache.get(channel_id);
        this.invokeCommand(interaction, command, args, member, guild, channel);
        }
      });
    }
	}
	getApp(guildId) {
		const app = this.#client.api.applications(this.#client.user.id);
		if (guildId) {
			app.guilds(guildId);
		}
		return app;
	}
	getCommands(guildId) {
		return getApp(guildId).commands.get();
	}
	async createCommand(name, description, options, guildId) {
		await this.getApp(guildId).commands.post({
			data: {
				name,
				description,
				options
			}
		});
	}
	async deleteCommand(commandId, guildId) {
		await this.getApp(guildId).commands.delete(commandId);
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
	async createAPIMessage(interaction, content) {
		const { data, files } = await APIMessage.create(
			// @ts-ignore
			this.#client.channels.resolve(interaction.channel_id),
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

		let result = await command.callback({
			member,
			guild,
			channel,
			args: options,
			// @ts-ignore
			text: options.join ? options.join(' ') : '',
			client: this.#client,
			instance: this.#instance,
			interaction
		});

		if (!result) {
			console.error(
				`Shadow commands > Command "${commandName}" did not return any content from it's callback function. This is required as it is a slash command.`
			);
			return false;
		}

		let data = {
			content: result
		};

		// Handle embeds
		if (typeof result === 'object') {
			const embed = new MessageEmbed(result);
			data = await this.createAPIMessage(interaction, embed);
		}

		// @ts-ignore
		this.#client.api
			// @ts-ignore
			.interactions(interaction.id, interaction.token)
			.callback.post({
				data: {
					type: 4,
					data
				}
			});

		return true;
	}
}
module.exports = SlashCommand