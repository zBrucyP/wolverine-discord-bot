const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { CHANNEL_TYPES } = require('../utils/constants');

class DiscordAPI {
    constructor() {
        this.rest = new REST({ version: '9' })
            .setToken(process.env.bot_token);

        if (DiscordAPI.instance) {
            return DiscordAPI.instance;
        }
        
        DiscordAPI.instance = this;
    }

    async getUserFromId(id) {
        return await this.rest.get(Routes.user(id));
    }

    async getChannelsFromGuildId(id) {
        return await this.rest.get(Routes.guildChannels(id));
    }

    // returns all voice channels, excluding a channel named 'AFK'
    async getVoiceChannelsFromGuildId(id) {
        const channels = await this.rest.get(Routes.guildChannels(id));
        const voiceChannels = channels.filter(channel => channel.type === CHANNEL_TYPES.VOICE && channel.name != 'AFK');
        return voiceChannels;
    }

    async getGuildMember(guildId, userId) {
        return await this.rest.get(Routes.guildMember(guildId, userId));
    }

    async getGuild(guildId) {
        return await this.rest.get(Routes.guild(guildId));
    }
}

module.exports = {
    DiscordAPI
}