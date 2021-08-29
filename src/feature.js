const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const getAllFiles = require('$src/getallfiles');
const Discord = require('discord.js');

/**
 * @constructor
 * @param {object} client - The discord.js client
 * @param {object} instance - The Shadow Commands "this"
 * @param {string} dir - The listeners directory
 * @returns {Collection} this.features - {'fileName' => file default export}
 */

class Feature {
	features = new Discord.Collection();
	constructor(client, instance, dir) {
		for (const [file, fileName] of getAllFiles(
			path.join(__dirname, 'features')
		)) {
			this.registerFeature(require(file), fileName, instance, true);
			//Default features
		}

		if (!dir) {
			return;
		}

		if (!fs.existsSync(dir)) {
			throw new Error(`Listeners directory "${dir}" doesn't exist!`);
		}
		const amount = getAllFiles(dir);
		for (const [file, fileName] of amount) {
			this.registerFeature(require(file), fileName, instance, false);
		}
	if(instance.logAmount)	console.log(
			`Shadow Commands > Loaded ${amount.length} event${
				amount.length === 1 ? '' : 's'
			}`
		);
	}
	registerFeature(file, fileName, instance, builtIn) {
		/**
		 * @name registerFeature
		 * @param {function} file - the file which is require(filepath)
		 * @param {string} fileName - the name of the file provided
		 * @param {object} instance - the instance of Shadow Commanda
		 * @param {boolean} builtIn - if true then the file is provided by the handler otherwise if false it is provided by the user
		 */
		const featureFunction = file;
		const name = fileName;
		if (typeof featureFunction !== 'function') {
			return console.error(
				chalk.red.underline(
					`Error: Feature ${fileName} does not export a function`
				)
			);
		}
		this.features.set(name.toLowerCase(), file);
		featureFunction(instance.client, instance); //Fire function of feature. Example: module.exports = (client, instance) => {}
	}
}
module.exports = Feature;
