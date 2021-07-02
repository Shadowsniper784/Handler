const Discord = require('discord.js');
const MessageEmbed = require('./embed');
const Util = {
	getMethodsAndProperties: function(obj, filter) {
		let properties = new Set();
		let currentObj = obj;
		do {
			Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
		} while ((currentObj = Object.getPrototypeOf(currentObj)));
		const value = [...properties.keys()];
		if (filter) value.filter(item => filter(item));
		return value;
	},
	getProperties: function(obj) {
		return this.getMethodsAndProperties(
			obj,
			item => typeof obj[item] !== 'function'
		);
	},
	getMethods: function(obj) {
		return this.getMethodsAndProperties(
			obj,
			item => typeof obj[item] === 'function'
		);
	},
	ign: function(message) {
		const username = message.content;
		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setTitle('Your username has been registered!!!')
			.setDescription(
				`Your username has been registered as\n${this.bold(
					username
				)}.\nWe hope to see you on the realm soon!`
			)
			.setFooter('To Add/Change your name, just send it to this channel.')
			.setTimestamp()
			.setThumbnail(
				'https://cdn.mee6.xyz/guild-images/775532319695306803/4dfb242b6ba6c9e3647d58f936f58c04b792025115a816e23e687b774adc6956.png'
			);
		return embed.toJSON();
	},
	isIgn: function(channel) {
		const name = channel.name ? channel.name.toLowerCase() : '';
		return name.includes('ign') || name.includes('in-game-name');
	},
	bold: function(text) {
		return '**' + text + '**';
	},
	extractArray: function(element) {
		let elements = [];
		const extract = element => {
			if (Array.isArray(element)) {
				element.forEach(item => {
					extract(item);
				});
			} else {
				elements.push(element);
			}
		};
		extract(element);
		return elements;
	},
	reply: function(content, message) {
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
				Authorization: `${message.client.user.bot ? 'Bot ' : ''}${
					message.client.token
				}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		}).catch(() => {});
	},
	formatDate: function(date, year) {
		date = new Date(date);
		let format = `${Util.getDayName(
			date.getDay()
		)} ${date.getDate()}${Util.getNumberSuffix(date.getDate())} ${Util.getMonth(
			date.getMonth(),
			true
		)}`;
		if (year) format += ` ${date.getFullYear()}`;
		return format;
	},
	getMonth: function(monthNum, long) {
		if (typeof monthNum != 'number') throw new Error('Month is not a number');
		const shortMonths = [
			'Jan',
			'Feb',
			'March',
			'April',
			'May',
			'June',
			'July',
			'Aug',
			'Sept',
			'Oct',
			'Nov',
			'Dec'
		];
		const longMonths = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		return long == 'true' ? longMonths[monthNum] : shortMonths[monthNum];
	},
	getDayName: function(day) {
		if (typeof day != 'number') throw new Error('Provided day is not a number');
		const days = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		return days[day];
	},
	getNumberSuffix: function(value) {
		value = value.toString();
		if (value.endsWith('1')) return 'st';
		if (value.endsWith('2')) return 'nd';
		if (value.endsWith('3')) return 'rd';
		return 'th';
	},
	parseMilliseconds: function(milliseconds) {
		if (typeof milliseconds !== 'number') {
			throw new TypeError('Expected a number');
		}
		let txt = '';
		const add = (val, name) => {
			if (txt === '') {
				if (Number(val) > 0) txt += `${val} ${name}${val == 1 ? '' : 's'}`;
			} else {
				if (Number(val) > 0) txt += ` ${val}${name}${val == 1 ? '' : 's'}`;
			}
		};
		const obj = {
			days: Math.trunc(milliseconds / 86400000),
			hours: Math.trunc(milliseconds / 3600000) % 24,
			minutes: Math.trunc(milliseconds / 60000) % 60,
			seconds: Math.trunc(milliseconds / 1000) % 60,
			milliseconds: Math.trunc(milliseconds) % 1000,
			microseconds: Math.trunc(milliseconds * 1000) % 1000,
			nanoseconds: Math.trunc(milliseconds * 1e6) % 1000
		};
		add(obj.days, 'day');
		add(obj.hours, 'hour');
		add(obj.minutes, 'minute');
		add(obj.seconds, 'second');
		return txt;
	},
	embed: MessageEmbed,
	rand: function(min, max, inclusive = true) {
		const amount = inclusive ? 1 : 0;
		return Math.random() * (max - min + amount) + min;
	},
	genEmbed: function(command) {
		const embed = {
			title: command.name,
			type: 'rich',
			description: command.description,
			color: 2266867,
			fields: [
			  {
			    name: 'Category',
			    value: command.category
			  },
			  {
			    name: 'Expected Args',
			    value: command.syntax
			  }
			  ]
		}
		/*	thumbnail: this.thumbnail,
			image: this.image,
			author: this.author
				? {
						name: this.author.name,
						url: this.author.url,
						icon_url: this.author.iconURL
				  }
				: null,
			footer: this.footer
				? {
						text: this.footer.text,
						icon_url: this.footer.iconURL
				  }
				: null
		};
		*/
		return embed
	}
};
module.exports = Util;
