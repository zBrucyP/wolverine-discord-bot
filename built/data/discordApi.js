"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
class DiscordAPI {
    constructor() {
        this.rest = new rest_1.REST({ version: '9' })
            .setToken(process.env.bot_token);
    }
    static getInstance() {
        if (!DiscordAPI.instance) {
            DiscordAPI.instance = new DiscordAPI();
        }
        return DiscordAPI.instance;
    }
    getUserFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rest.get(v9_1.Routes.user(id));
        });
    }
    getChannelsFromGuildId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rest.get(v9_1.Routes.guildChannels(id));
        });
    }
    // returns all voice channels, excluding a channel named 'AFK'
    // async getVoiceChannelsFromGuildId(id) {
    //     const channels: any[] = await this.rest.get(Routes.guildChannels(id));
    //     const voiceChannels = channels.filter(channel => channel.type === CHANNEL_TYPES.VOICE && channel.name != 'AFK');
    //     return voiceChannels;
    // }
    getGuildMember(guildId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rest.get(v9_1.Routes.guildMember(guildId, userId));
        });
    }
    getGuild(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rest.get(v9_1.Routes.guild(guildId));
        });
    }
}
exports.default = DiscordAPI;
