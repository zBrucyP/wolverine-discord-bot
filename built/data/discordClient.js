"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class DiscordClientWrapper {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES
            ]
        });
    }
    // returns voice data on user. returns null if user not connected to a voice channel
    getGuildMemberVoiceState(guildId, userId) {
        const guild = this.client.guilds.cache.get(guildId);
        return guild.voiceStates.cache.get(userId);
    }
    static getInstance() {
        if (!DiscordClientWrapper.instance) {
            DiscordClientWrapper.instance = new DiscordClientWrapper();
        }
        return DiscordClientWrapper.instance;
    }
    getClient() {
        return this.client;
    }
}
exports.default = DiscordClientWrapper;
