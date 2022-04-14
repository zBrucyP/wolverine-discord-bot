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

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
  if (interaction.commandName === 'lastseen') {
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

    const lastSeenEpoch = user?.lastSeen?.S;
    if (!lastSeenEpoch) {
        await interaction.reply(`I found ${username}, but I have no date for them!`);
        return;
    }
    const lastSeenDate = new Date(0);
    lastSeenDate.setUTCMilliseconds(lastSeenEpoch);
    lastSeenFormattedString = lastSeenDate.toLocaleDateString();
    await interaction.reply(`Ah, I saw them on ${lastSeenFormattedString}!`);
    return;
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