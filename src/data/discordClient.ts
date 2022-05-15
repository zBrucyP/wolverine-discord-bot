import { Client, Guild, Intents, VoiceState } from 'discord.js';

export default class DiscordClientWrapper {
  private static instance: DiscordClientWrapper;
  private client: Client;

  private constructor() {
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
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

  // returns voice data on user.
  public async getGuildMemberVoiceState(guildId: string, userId: string): Promise<VoiceState> {
    const guild: Guild = this.client.guilds.cache.get(guildId);
    await guild.fetch(); // hopefully update voicestate cache. Running fetch after guild cache retrieval to avoid fetching multiple guilds unnecessarily
    return guild.voiceStates.cache.get(userId);
  }
}
