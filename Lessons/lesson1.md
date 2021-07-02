# Welcome!
In todays lesson we will learn the following things:
* Variables
* Functions
* Making your first command!
## Variables
To start with, there is 3 was to create a variable:
- const
- let
- var

const is one that is set throughout the script and if you try to change it, it will throw an error. Set it up like this:
const VARNAME = VALUE

let and var are basically the same, they can both be changed throughout the script. Set them up like this 
let VARNAME = VAR OR  
var VARNAME = VAR  
To change them in a script do this:  
VARNAME = NEWVAR

## Functions
Functions can be used in **ALOT** of ways but to keep things simple we will just learn about one,
```js
function hello() {
  return console.log('hi')
}
hello()

```
So, hello is the name of the function, the second hello is calling the function,
essentially, functions will not be run until called. They can be called multiple times by just doing hello() more and more times. Of course ot doesn't have to be hello it can be a name of any valid function. They are used to cut down on the amount of code and to stop you having to write them out again. Think of it as you copy and pasting the same code. When you fire a function the script "copys and pastes" the code and runs it. You can also have "paramaters" like this:
```js
function withParamaters(text) {//this defines PARAMATERS
  return console.log(text)
}
withParamaters('hello')//This passes in ARGUEMENTS
```
Now im sure you've noticed this new word "return" and this basically sends something back and stops the rest of the function executing. It is useful for maths equations with js and also with if statements to stop the rest of the function running if something is true.

## Making your first command!
As this repl has a command handler, making commands is a **lot** easier. 
1. Make a file in commands with a name that will be easy to know what is inside and the file name MUST end in .js this specifies the language of the file
2. Use this template, NOTE: you don't need to specify all of these, just the ones you need, if you don't need it just delete the line
```js
module.exports = {
  	name: '' || fileName,
		description: '' || '',
		category: '' || '',
		aliases: ['', ''] || [],
		expectedArgs: '' || '',
		minArgs: NUMBER || 0,
		maxArgs: NUMBER, -1 for unlimited || -1,
		testOnly: true/false || false,
		guildOnly: true/false || false,
		ownerOnly: true/false || false,
		nsfw: true/false || false,
		hidden: true/false || false,
		userPerms: 'valid permission' || '',
		botPerms: 'valid permission' || '',
		cooldown: '1s 1m 1h 1d' || ''
		callback: ({ message, args, reply, instance, client )} => {//Just specify the ones you need!
		//COMMAND CODE HERE!
		}
	}
```
	
the || specifies what the default will be set to if you dont specify it in the command file! 
#	THE END!