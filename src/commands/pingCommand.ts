import { BaseCommandInteraction } from 'discord.js';
import Command from './command';

export default class PingCommand implements Command {
  async execute(interaction: BaseCommandInteraction): Promise<string | void> {
    return interaction.reply('Pong! 😉');
  }
}
