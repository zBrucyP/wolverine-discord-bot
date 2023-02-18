import { BaseCommandInteraction } from "discord.js";

export default interface Command {
  execute(interaction: BaseCommandInteraction): Promise<string | void>;
}
