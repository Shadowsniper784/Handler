const messageSchema = require('$schemas/reaction-role-schema.js')
module.exports ={
  callback: async ({
    message
  }) => {
    console.log(await messageSchema.findOne({channelId:"838727770334822410"}))
  }
}