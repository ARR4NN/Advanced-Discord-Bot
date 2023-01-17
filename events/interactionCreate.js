const { Client, Collection, Message, MessageEmbed, Permissions, isMessageContextMenu } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        /**
         * Context Menus
         */
        if (interaction.isUserContextMenuCommand() || interaction.isMessageContextMenu()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (command) command.execute(interaction);
        }

        /**
         * Message Command
         */
        if (interaction.isCommand()) {
            const commandName = interaction.commandName;

            const command =
                interaction.client.commands.get(commandName);

            try {
                command.execute(Client, interaction);
            } catch (error) {
                console.error(error);
                interaction.reply({ ephemeral: true, content: "There was an error! Contact administrators." }).catch(console.error);
            }
        }

    },
};

/*
.isApplicationCommand()
.isAutocomplete()
.isButton()
.isCommand()
.isContextMenu()
.isMessageComponent()
.isMessageContextMenu()
.isModalSubmit()
.isSelectMenu()
.isUserContextMenu()*/
