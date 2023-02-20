import {CommandInteraction, InteractionResponse} from 'discord.js';
import Command from './command';

export default class PingCommand implements Command {
  async execute(interaction: CommandInteraction): Promise<string | InteractionResponse | void> {
    return interaction.reply('Pong! 😉');
  }
}
