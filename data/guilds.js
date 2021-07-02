const SavedGuild = require('./models/guild');
const defaultPrefix = require('../src/index').settings.defaultPrefix
const template = {
  general: {
    prefix: defaultPrefix,
    blacklistedChannelIds: [],
  }
}
module.exports = new class {
  async get(id) {
    return await SavedGuild.findById(id)
      || await new SavedGuild({ _id: id }).save() || template
    } async getPrefix(guild) {
      if(guild) {
        const id = guild.id
    return await SavedGuild.findById(id).general.prefix
      || await new SavedGuild({ _id: id }).save().general.prefix
    } else {
      return defaultPrefix
    }
  }
}