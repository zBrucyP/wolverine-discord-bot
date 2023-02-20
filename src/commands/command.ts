import {CommandInteraction, InteractionResponse} from "discord.js";

export default interface Command {
  execute(interaction: CommandInteraction): Promise<string | InteractionResponse | void>;
}
