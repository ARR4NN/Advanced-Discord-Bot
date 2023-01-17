const discord = require('discord.js')
const { status, statusType } = require("../util/config")
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log("Using template created by ARR4NN. https://github.com/ARR4NN")
        console.log(`[Ready Event] Bot ${client.user.username} is now ready!`);
        client.user.setActivity(status, { type: statusType });

    },
};