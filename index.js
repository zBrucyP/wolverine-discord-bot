require('dotenv').config()
const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamoClient = new DynamoDBClient({ 
    region: "us-east-2",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });
const rest = new REST({ version: '9' }).setToken(process.env.bot_token);
client.login(process.env.bot_token);

const acceptableCommands = [
    'ping',
    'lastseen',
    'timesince'
];

const TIME_CONSTANTS = {
    SECONDS: 'Seconds',
    MINUTES: 'Minutes',
    HOURS: 'Hours',
    DAYS: 'Days',
    MONTHS: 'Months'
}

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

function convertEpochToUnit(epoch, unit) {
    switch (unit) {
        case TIME_CONSTANTS.SECONDS: {
            return Math.floor(epoch / 1000);
        }
        case TIME_CONSTANTS.MINUTES: {
            return Math.floor(epoch / 60000);
        }
        case TIME_CONSTANTS.HOURS: {
            return Math.floor(epoch / 3600000);
        }
        case TIME_CONSTANTS.DAYS: {
            return Math.floor(epoch / 86400000);
        }
        case TIME_CONSTANTS.MONTHS: {
            return 'lol this should not have been an option';
        }
    }
}


client.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.member.user.bot) return;

    // if user joined a channel
    if (newState.channelId) {
        const user = await rest.get(Routes.user(newState.id));
        const result = await insertUser(user);
    }
});

function getFormattedDateFromEpoch(epoch) {
    const lastSeenDate = new Date(0);
    lastSeenDate.setUTCMilliseconds(epoch);
    lastSeenFormattedString = lastSeenDate.toLocaleDateString();
}

async function insertUser(user) {
    const params = {
        TableName: 'wolverine-user-table',
        Item: {
            'username': {S: `${user.username}`.toUpperCase()},
            'id': {S: user.id},
            'lastSeen': {S: Date.now().toString()}
        }
    };
    const command = new PutItemCommand(params);

    try {
        const data = await dynamoClient.send(command);
    } catch (error) {
        console.warn(`Failed to insert user in table: ${error}`);
        return false;
    }
    return true;
}

async function fetchUser(username) {
    const params = {
        TableName: 'wolverine-user-table',
        Key: {
            username: {S: username.toUpperCase()}
        }
    };
    const command = new GetItemCommand(params);

    try {
        const res = await dynamoClient.send(command);
        const user = res?.Item;
        return user ? user : null;
    } catch (error) {
        console.warn(`Failed to fetch data on user ${error}`);
    }
}