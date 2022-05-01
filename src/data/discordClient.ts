import { Client, Intents, VoiceState } from 'discord.js';

export default class DiscordClientWrapper {
  private static instance: DiscordClientWrapper;
  private client: Client;

  private constructor() {
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    });
  }

  public static getInstance(): DiscordClientWrapper {
    if (!DiscordClientWrapper.instance) {
      DiscordClientWrapper.instance = new DiscordClientWrapper();
    }
    return DiscordClientWrapper.instance;
  }

  public getClient(): Client {
    return this.client;
  }

  // returns voice data on user. returns null if user not connected to a voice channel
  public getGuildMemberVoiceState(guildId: string, userId: string): VoiceState {
    const guild = this.client.guilds.cache.get(guildId);
    return guild.voiceStates.cache.get(userId);
  }
}
