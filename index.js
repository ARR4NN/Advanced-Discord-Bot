/**
 * Module Imports
 */
require('dotenv').config();
const { TOKEN } = require("./util/config");
const { Client, Collection, ButtonBuilder, ActionRowBuilder, GatewayIntentBits, Partials, ButtonStyle } = require("discord.js");
const { readdirSync } = require("fs");
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));
const client = new Client({
    disableMentions: "everyone",
    restTimeOffset: 0,
    intents: [
        GatewayIntentBits.Guilds,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ],
});
const expiredRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setEmoji("Expired interaction").setStyle(ButtonStyle.Secondary).setCustomId("expired-btn").setDisabled());
client.login(TOKEN);
client.commands = new Collection();
client.btnHandlers = new Map();
try {
    client.addBtnHandler = (message, handler) => {
        client.btnHandlers.set(message.id, handler);
        setTimeout(() => {
            client.btnHandlers.delete(message.id);
            message.edit({
                components: [expiredRow]
            });
        }, 360000);
        // Default: 360000
    }
} catch (err) {
    return
}
/**
 * Event Handling
 */

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}
/**
 * Import all commands
 */
const commandFolders = readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}


process.on("unhandledRejection", async (error) => {
    if (error.code == 50013) {
        console.log("[ERROR] [UnhandledRejection] I don't have the correct permissions.")
    } else {
        console.log(error);
    }
})
process.on("unhandledException", async (error) => {
    console.log(error);
})
