import { BaseCommandInteraction, Collector, Message } from 'discord.js';
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

    if (!user) {
        await interaction.reply(`Silly ${interaction.user.username}, pokes are for people that exist! 🐰`);
        return;
    }

    const userVoiceState = await DiscordClientWrapper.getInstance().getGuildMemberVoiceState(guildId, user.id.S);
    
    // can't poke if user isn't in channel
    if (!userVoiceState?.channelId) {
        await interaction.reply(`I can't 🍆 someone who isn't here!`);
        return;
    }
    
    const allVoiceChannels = await DiscordAPI.getInstance().getVoiceChannelsFromGuildId(guildId); 
    const twoRandomChannels = getTwoRandomItemsFromList(allVoiceChannels);

    await interaction.reply(`Commencing poke operation on ${username} in ${DEFAULT_POKE_WAIT} seconds... 🏁`);
    const filter = (m: Message) => m.author?.username.toUpperCase() === username.toUpperCase();
    const stopPokeMessageCollector = interaction.channel.createMessageCollector({filter, time: 9_500});
    stopPokeMessageCollector.on('collect', async (m) => {
        await interaction.followUp(`${username} has convinced me to stand down. 😏 😙 😉`);
        stopPokeMessageCollector.stop(`cancelled`);
        return;
    });

    stopPokeMessageCollector.on('end', async (collected, reason) => {
        if (reason === 'time') {
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
        }
    });

    

    return await ``;
  }
}
