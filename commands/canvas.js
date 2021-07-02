const Canvas = require('canvas');
Canvas.registerFont('/home/runner/Handler/fonts/OpenSans-Regular.ttf', { family: 'Open Sans' })
class Level {
	constructor(client) {
		this.client = client;
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
		this.canvas = canvas;
		this.ctx = ctx;
	}
	getLength(xp, max) {
		return (xp / max) * 675;
	}
	drawBar(xp, max) {
		const ctx = this.ctx;
		const percent = this.getLength(xp, max);
		ctx.fillStyle = 'green';
		ctx.fillRect(25, 25, percent, 25);
	}
	setBackground(colour) {
		this.ctx.fillStyle = colour || 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
	toBuffer() {
		return this.canvas.toBuffer();
	}
	addName(username) {
	  this.ctx.font = this.applyText(username);
	this.ctx.fillStyle = '#826394';
	this.ctx.fillText(username, this.canvas.width / 2.5, this.canvas.height / 1.8);
	}
	applyText(text) {
	  const { canvas } = this
		const context = canvas.getContext('2d');

		// Declare a base size of the font
		let fontSize = 70;

		do {
			// Assign the font to the context and decrement it so it can be measured again
			context.font = `${(fontSize -= 10)}px Open Sans Regular`;
			// Compare pixel width of the text to the canvas minus the approximate avatar size
		} while (context.measureText(text).width > canvas.width - 300);

		// Return the result to use in the actual canvas
		return context.font;
	}
}
module.exports = {
	cooldown: '0',
	callback: ({ message, args, client }) => {
		const Discord = require('discord.js');
		const r = new Level(client);
		r.setBackground('orange');
		r.drawBar(100, 1203);
		r.addName(message.author.username)
		// Use the helpful Attachment class structure to process the file for you
		const attachment = new Discord.MessageAttachment(
			r.toBuffer(),
			'text-image.png'
		);
		message.channel.send(attachment);
	}
};
