require('dotenv').config()
import { COMMANDS } from './utils/constants';
import CommandValidator from './commands/commandValidator';
import generatePingResponse from './commands/pingCommand';
import generateLastSeenResponse from './commands/lastSeenCommand';
import generateTimeSinceResponse from './commands/timeSinceCommand';
import UserDB from './data/dynamo';
import DiscordAPI from './data/discordApi';
import DiscordClientWrapper from "./data/discordClient";

// Discordjs setup
const clientWrapper = DiscordClientWrapper.getInstance();
const discordApi = DiscordAPI.getInstance();
clientWrapper.getClient().login(process.env.bot_token);
const userDB = UserDB.getInstance();

const commandValidator = new CommandValidator(Object.values(COMMANDS));

clientWrapper.getClient().on('ready', () => {
  console.log(`Logged in as ${clientWrapper.getClient().user.tag}!`);
});

clientWrapper.getClient().on('interactionCreate', async interaction => {
  if (!interaction.isCommand() || !commandValidator.isValid(interaction.commandName)) return;

  switch (interaction.commandName) {
    case COMMANDS.PING: {
        await interaction.reply(generatePingResponse());
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