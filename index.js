require('dotenv').config()
const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getFormattedDateFromEpoch, convertEpochToUnit } = require("./src/utils/utils");
const { insertUser, fetchUser } = require("./src/db/dynamo");
const { TIME_CONSTANTS } = require('./src/utils/constants');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });
const rest = new REST({ version: '9' }).setToken(process.env.bot_token);
client.login(process.env.bot_token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const username = interaction.options.getString('username');
  if (!username) {
      await interaction.reply(`You either forgot to tell me who or I can't read that!`);
      return;
  }

  const user = await fetchUser(username);
  if (!user) {
      await interaction.reply(`I've never seen ${username} before in my life!`);
      return;
  }

  switch (interaction.commandName) {
    case 'ping': {
        await interaction.reply('Pong!');
        return;
    }
    case 'lastseen': {
        const lastSeenEpoch = user?.lastSeen?.S;
        if (!lastSeenEpoch) {
            await interaction.reply(`I found ${username}, but I have no date for them!`);
            return;
        }
        console.log(`lastseen: ${username} on ${lastSeenEpoch}`);
        await interaction.reply(`Ah, I saw ${username} on ${getFormattedDateFromEpoch(lastSeenEpoch)}!`);
        return;
    }
    case 'timesince': {
        const lastSeenEpoch = user?.lastSeen?.S;
        if (!lastSeenEpoch) {
            await interaction.reply(`I found ${username}, but I have no date for them!`);
            return;
        }
        let timeUnit = interaction.options.getString('timeunit');
        timeUnit = timeUnit ? timeUnit : TIME_CONSTANTS.DAYS;
        const millisecondsSince = Date.now() - lastSeenEpoch;
        await interaction.reply(`Phew! I haven't seen ${username} in ${convertEpochToUnit(millisecondsSince, timeUnit)} ${timeUnit}...`);
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