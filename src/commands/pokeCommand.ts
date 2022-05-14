import { BaseCommandInteraction } from 'discord.js';
import Command from './command';
import { customTimeout, getTwoRandomItemsFromList, getUsernameFromInteraction } from '../utils/utils';
import { DEFAULT_POKE_WAIT } from '../utils/constants';
import DiscordAPI from '../data/discordApi';
import UserDB from '../data/dynamo';
import DiscordClientWrapper from '../data/discordClient';

export default class PokeCommand implements Command {
  async execute(interaction: BaseCommandInteraction): Promise<string> {
    const guildId = interaction.guildId;
    const username = getUsernameFromInteraction(interaction);
    const user = await UserDB.getInstance().fetchUser(username);
    const userVoiceState = await DiscordClientWrapper.getInstance().getGuildMemberVoiceState(guildId, user.id.S);
    
    if (!userVoiceState?.channelId) {
        await interaction.reply(`I can't 🍆 someone who isn't here!`);
        return;
    }
    
    const allVoiceChannels = await DiscordAPI.getInstance().getVoiceChannelsFromGuildId(guildId); //await DiscordClientWrapper.getInstance().getGuildVoiceChannels(guildId);
    const twoRandomChannels = getTwoRandomItemsFromList(allVoiceChannels);

    await interaction.reply(`Commencing poke operation on ${username} in 10 seconds... 🏁`);
    await customTimeout(DEFAULT_POKE_WAIT);

    const timesToMove = 8;
    let moved = 0;
    let firstChannel = true;
    while (moved <= timesToMove) {
        await userVoiceState.setChannel(firstChannel ? twoRandomChannels[0].id : twoRandomChannels[1].id);
        firstChannel = !firstChannel;
        await customTimeout(.2);
        moved++;
    }

    await interaction.followUp('🍆 🍆 complete.');

    return await `a`;
  }
}
