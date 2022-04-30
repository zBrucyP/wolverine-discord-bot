require('dotenv').config()
const { COMMANDS } = require('./src/utils/constants');
const { CommandValidator } = require('./src/commands/commandValidator');
const { generatePingResponse } = require('./src/commands/pingCommand');
const { generateLastSeenResponse } = require('./src/commands/lastSeenCommand');
const { generateTimeSinceResponse } = require('./src/commands/timeSinceCommand');
const { UserDB } = require('./src/data/dynamo');
const { DiscordAPI } = require('./src/data/discordApi');
const { DiscordClient } = require('./src/data/discordClient');

// Discordjs setup
const clientWrapper = new DiscordClient();
const discordApi = new DiscordAPI();
clientWrapper.getClient().login(process.env.bot_token);
const userDB = new UserDB();

const commandValidator = new CommandValidator(Object.values(COMMANDS));

clientWrapper.getClient().on('ready', () => {
  console.log(`Logged in as ${clientWrapper.getClient().user.tag}!`);
});

clientWrapper.getClient().on('interactionCreate', async interaction => {
  if (!interaction.isCommand() || !commandValidator.isValid(interaction.commandName)) return;

  switch (interaction.commandName) {
    case COMMANDS.PING: {
        await interaction.reply(generatePingResponse());
        clientWrapper.getClient().gu
        return;
    }
    case COMMANDS.LAST_SEEN: {
        const username = getUsernameFromInteraction(interaction);
        const guildId = interaction.guildId;
        const response = await generateLastSeenResponse(username, guildId);
        await interaction.reply(response);
        return;
    }
    case COMMANDS.TIME_SINCE: {
        const username = getUsernameFromInteraction(interaction);
        const guildId = interaction.guildId;
        const timeUnit = interaction.options.getString('timeunit');
        const response = await generateTimeSinceResponse(guildId, username, timeUnit);
        await interaction.reply(response);
        return;
    }
  }
});

clientWrapper.getClient().on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.member.user.bot) return;

    const channelId = newState.channelId; // if joining, has the id of the channel. If disconnecting from channels, is null
    
    console.log(`User ${newState.id} ${channelId ? 'joined' : 'left'} channel ${channelId ? channelId : ''} in ${newState.guild.name}`);
    const user = await discordApi.getUserFromId(newState.id); // id on new state refers to the user id
    const result = await userDB.insertUser(user);
    return;
});

function getUsernameFromInteraction(interaction) {
    return interaction?.options?.getString('username');
}