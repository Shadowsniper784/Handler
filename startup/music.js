module.exports = (client) => {
  const { Player } = require('discord-player')
  client.player = new Player(client)
  client.emotes = {
        off: ':x:',
        error: ':warning:',
        queue: ':bar_chart:',
        music: ':musical_note:',
        success: ':white_check_mark:',
    }

    client.discord= {
        token: 'TOKEN',
        prefix: 'PREFIX',
        activity: 'ACTIVITY',
    }

    client.filters= ['8D', 'gate', 'haas', 'phaser', 'treble', 'tremolo', 'vibrato', 'reverse', 'karaoke', 'flanger', 'mcompand', 'pulsator', 'subboost', 'bassboost', 'vaporwave', 'nightcore', 'normalizer', 'surrounding']
}