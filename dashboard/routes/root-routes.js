const express = require('express');
const router = express.Router();
function run(instance) {
const commands = instance.getCommands()


router.get('/', (req, res) => res.render('index'));

router.get('/commands', (req, res) => res.render('commands', {
  subtitle: 'Commands',
  categories: [
    { name: 'Moderation', icon: 'fas fa-gavel' },
    { name: 'Test', icon: 'fas fa-coins' }, 
    { name: 'General', icon: 'fas fa-star' },
    { name: 'Utility', icon: 'fas fa-music' }
  ],
  commands: Array.from(commands.values()),
  commandsString: JSON.stringify(Array.from(commands.values()))
}));
}
module.exports = router;
module.exports.run = run