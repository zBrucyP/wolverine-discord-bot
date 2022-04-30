const { Client, Intents } = require('discord.js');

class DiscordClient {
    constructor() {
        this.client = new Client(
            {
                intents: [
                    Intents.FLAGS.GUILDS, 
                    Intents.FLAGS.GUILD_VOICE_STATES, 
                    Intents.FLAGS.GUILD_MESSAGES
                ] 
            });

        if (DiscordClient.instance) {
            return DiscordClient.instance;
        }
        
        DiscordClient.instance = this;
    }

    // returns voice data on user. returns null if user not connected to a voice channel
    getGuildMemberVoiceState(guildId, userId) {
        const guild = this.client.guilds.cache.get(guildId);
        return guild.voiceStates.cache.get(userId);
    }

    getClient() {
        return this.client;
    }
}

module.exports = {
    DiscordClient
}