module.exports = (client) => {
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
}