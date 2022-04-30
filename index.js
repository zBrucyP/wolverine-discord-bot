require('dotenv').config()
const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { COMMANDS } = require('./src/utils/constants');
const { CommandValidator } = require('./src/commands/commandValidator');
const { generatePingResponse } = require('./src/commands/pingCommand');
const { generateLastSeenResponse } = require('./src/commands/lastSeenCommand');
const { generateTimeSinceResponse } = require('./src/commands/timeSinceCommand');
const { UserDB } = require('./src/db/dynamo');

// Discordjs setup
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });
const rest = new REST({ version: '9' }).setToken(process.env.bot_token);
client.login(process.env.bot_token);
const userDB = new UserDB();

const commandValidator = new CommandValidator(Object.values(COMMANDS));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand() || !commandValidator.isValid(interaction.commandName)) return;

  switch (interaction.commandName) {
    case COMMANDS.PING: {
        await interaction.reply(generatePingResponse());
        return;
    }
    case COMMANDS.LAST_SEEN: {
        const username = getUsernameFromInteraction(interaction);
        const response = await generateLastSeenResponse(username);
        await interaction.reply(response);
        return;
    }
    case COMMANDS.TIME_SINCE: {
        const username = getUsernameFromInteraction(interaction);
        const timeUnit = interaction.options.getString('timeunit');
        const response = await generateTimeSinceResponse(username, timeUnit);
        await interaction.reply(response);
        return;
    }
  }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.member.user.bot) return;

    // if user joined a channel
    if (newState.channelId) {
        const user = await rest.get(Routes.user(newState.id));
        const result = await userDB.insertUser(user);
    }
});

function getUsernameFromInteraction(interaction) {
    return interaction?.options?.getString('username');
}