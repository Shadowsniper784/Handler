const path = require('path');
const fs = require('fs')
const { Dirent } = fs;

/**
 * @param {string} dir - The directory to get all files from
 * @returns {Array.<{filePath: String, fileName: String}>} files - an array of all the files 
 * @example 
 */ 


const getAllFiles = dir => {
	const files = fs.readdirSync(dir, {
		withFileTypes: true
	});
	let jsFiles = [];
	for (const file of files) {
		if (file.isDirectory()) {
			jsFiles = [...jsFiles, ...getAllFiles(`${dir}/${file.name}`)];
		} else if (
			(file.name.endsWith('.js') || file.name.endsWith('.ts')) &&
			!file.name.startsWith('!')
		) {
			let fileName = file.name.replace(/\\/g, '/').split('/');
			fileName = fileName[fileName.length - 1];
			fileName = fileName.split('.')[0].toLowerCase();

			jsFiles.push([`${dir}/${file.name}`, fileName]);
		}
	}

	return jsFiles;
};
module.exports = getAllFiles;