module.exports = {
  minArgs: 1,
  callback: ({ message, instance, args }) => {
    instance.CommandHandler.reloadCommand(args[0], message)
  }
}