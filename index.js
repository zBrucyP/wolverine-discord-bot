require('dotenv').config()
const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { insertUser, fetchUser } = require("./src/db/dynamo");
const { COMMANDS } = require('./src/utils/constants');
const { CommandValidator } = require('./src/commands/commandValidator');
const { generatePingResponse } = require('./src/commands/pingCommand');
const { generateLastSeenResponse } = require('./src/commands/lastSeenCommand');
const { generateTimeSinceResponse } = require('./src/commands/timeSinceCommand');

// Discordjs setup
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });
const rest = new REST({ version: '9' }).setToken(process.env.bot_token);
client.login(process.env.bot_token);

const commandValidator = new CommandValidator(Object.values(COMMANDS)); // TODO: pass commands as arr of strings

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
        const user = await getUserFromInteraction(interaction);
        if (!user) {
            await interaction.reply(`I've never seen 'em before in my life!`);
            return;
        }

        await interaction.reply(generateLastSeenResponse(user));
        return;
    }
    case COMMANDS.TIME_SINCE: {
        const user = await getUserFromInteraction(interaction);
        if (!user) {
            await interaction.reply(`I've never seen ${username} before in my life!`);
            return;
        }

        let timeUnit = interaction.options.getString('timeunit');
        await interaction.reply(generateTimeSinceResponse(user, timeUnit));
        return;
    }
  }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.member.user.bot) return;

    // if user joined a channel
    if (newState.channelId) {
        const user = await rest.get(Routes.user(newState.id));
        const result = await insertUser(user);
    }
});

async function getUserFromInteraction(interaction) {
    const username = interaction?.options?.getString('username');
    if (!username) return null;
  
    return await fetchUser(username);
}