import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { GuildChannel } from 'discord.js';
import { CHANNEL_TYPES } from '../utils/constants';

export default class DiscordAPI {
  private static instance: DiscordAPI;
  private rest: REST;

  private constructor() {
    this.rest = new REST({ version: '9' }).setToken(process.env.bot_token);
  }

  public static getInstance(): DiscordAPI {
    if (!DiscordAPI.instance) {
      DiscordAPI.instance = new DiscordAPI();
    }
    return DiscordAPI.instance;
  }

  public async getUserFromId(id) {
    return await this.rest.get(Routes.user(id));
  }

  async getChannelsFromGuildId(id) {
    return await this.rest.get(Routes.guildChannels(id));
  }

  // returns all voice channels, excluding a channel named 'AFK'
  async getVoiceChannelsFromGuildId(id) {
    const channels: any[] = (await this.rest.get(Routes.guildChannels(id))) as any[]; // discordjs is not clear about returned type, causes conflicts
    const voiceChannels = channels.filter(
      (channel) => channel.type === CHANNEL_TYPES.VOICE && channel.name != 'AFK'
    );
    return voiceChannels;
  }

  async getGuildMember(guildId, userId) {
    return await this.rest.get(Routes.guildMember(guildId, userId));
  }

  async getGuild(guildId) {
    return await this.rest.get(Routes.guild(guildId));
  }
}
