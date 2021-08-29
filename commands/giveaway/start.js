module.exports = {
	name: 'start',
	description: 'Start a giveaway',
	category: 'Giveaway',
	expectedArgs: '<Channel mention> <Time s/m/h/d> <Winners> <Prize>',
	callback: ({ message, args, client }) => {
	const ms = require('ms'); // npm install ms
	   
    // If the member doesn't have enough permissions
    if(!message.member.permissions.has('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.send(':x: You need to have the manage messages permissions to start giveaways.');
    }

    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.send(':x: You have to mention a valid channel!');
    }

    // Giveaway duration
    let giveawayDuration = args[1]
    // If the duration isn't valid
    console.log('Duration ' + giveawayDuration)
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
       return message.send(':x: You have to specify a valid duration!');
    }

    // Number of winners
    let giveawayNumberWinners = args[2];
    // If the specified number of winners is not a number
    console.log('winners ' + giveawayNumberWinners)
    if(isNaN(giveawayNumberWinners) && !giveawayNumberWinners >= 0){
        return message.send(':x: You have to specify a valid number of winners!');
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(' ');
    console.log('Pirze ' + giveawayPrize)
    // If no prize is specified
    if(!giveawayPrize){
        return message.send(':x: You have to specify a valid prize!');
    }

    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: 1,
        // Who hosts this giveaway
        hostedBy: true ? message.author : null,
        // Messages
        messages: {
            giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: "" +"🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with 🎉 to participate!",
            winMessage: `Congratulations, {winners}! You won **{prize}**!`,
            embedFooter: "Giveaways",
            noWinner: "Giveaway cancelled, no valid participations.",
            hostedBy: "Hosted by: {user}",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });

    message.send(`Giveaway started in ${giveawayChannel}!`);
	}
};
