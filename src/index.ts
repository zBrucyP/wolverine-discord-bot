import ChillCommand from "./commands/chillCommand";

require('dotenv').config();
import { COMMANDS } from './utils/constants';
import CommandValidator from './commands/commandValidator';
import generateLastSeenResponse from './commands/lastSeenCommand';
import generateTimeSinceResponse from './commands/timeSinceCommand';
import UserDB from './data/dynamo';
import DiscordAPI from './data/discordApi';
import DiscordClientWrapper from './data/discordClient';
import { Interaction, VoiceState } from 'discord.js';
import Command from './commands/command';
import PingCommand from './commands/pingCommand';
import PokeCommand from './commands/pokeCommand';
import { getUsernameFromInteraction } from './utils/utils';

// Discordjs setup
const clientWrapper = DiscordClientWrapper.getInstance();
clientWrapper.getClient().login(process.env.bot_token);
const discordApi = DiscordAPI.getInstance();
const userDB = UserDB.getInstance();

const commandValidator = new CommandValidator(Object.values(COMMANDS));

clientWrapper.getClient().on('ready', () => {
  console.log(`Logged in as ${clientWrapper.getClient().user.tag}!`);
});

clientWrapper.getClient().on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand() || !commandValidator.isValid(interaction.commandName)) return;

  let command: Command;

  switch (interaction.commandName) {
    case COMMANDS.PING: {
      command = new PingCommand();
      await command.execute(interaction);
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
      const timeUnit = interaction.options.get('timeunit').value;
      const response = await generateTimeSinceResponse(guildId, username, timeUnit);
      await interaction.reply(response);
      return;
    }
    case COMMANDS.POKE: {
      command = new PokeCommand();
      await command.execute(interaction);
      return;
    }
    case COMMANDS.CHILL: {
      command = new ChillCommand();
      await command.execute(interaction);
    }
  }
});

clientWrapper
  .getClient()
  .on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
    if (oldState.member.user.bot) return;

    const channelId = newState.channelId; // if joining, has the id of the channel. If disconnecting from channels, is null

    console.log(
      `User ${newState.id} ${channelId ? 'joined' : 'left'} channel ${
        channelId ? channelId : ''
      } in ${newState.guild.name}`
    );
    const user = await discordApi.getUserFromId(newState.id); // id on new state refers to the user id
    await userDB.insertUser(user);
    return;
  });


