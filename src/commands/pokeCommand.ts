import { InteractionResponse, Message} from 'discord.js';
import Command from './command';
import { customTimeout, getTwoRandomItemsFromList, getUsernameFromInteraction } from '../utils/utils';
import { DEFAULT_POKE_TIMES_TO_MOVE, DEFAULT_POKE_WAIT } from '../utils/constants';
import DiscordAPI from '../data/discordApi';
import UserDB from '../data/dynamo';
import DiscordClientWrapper from '../data/discordClient';

export default class PokeCommand implements Command {
  async execute(interaction): Promise<string | InteractionResponse | void> {
    const guildId = interaction.guildId;
    const username = getUsernameFromInteraction(interaction);
    const user = await UserDB.getInstance().fetchUser(username);

    if (!user) return await interaction.reply(`Silly ${interaction.user.username}, pokes are for people that exist! 🐰`);

    // can't poke if user isn't in channel
    const userVoiceState = await DiscordClientWrapper.getInstance().getGuildMemberVoiceState(guildId, user.id.S);
    if (!userVoiceState?.channelId) return await interaction.reply(`I can't 🍆 someone who isn't here!`);

    await interaction.reply(`Commencing poke operation on ${username} in ${DEFAULT_POKE_WAIT} seconds... 🏁`);

    const filter = (m: Message) => m.author?.username.toUpperCase() === username.toUpperCase();
    const stopPokeMessageCollector = interaction.channel.createMessageCollector({filter, time: 9_500});
    stopPokeMessageCollector.on('collect', async (m) => {
        stopPokeMessageCollector.stop(`cancelled`);
        await interaction.followUp(`${username} has convinced me to stand down. 😏 😙 😉`);
        return;
    });

    stopPokeMessageCollector.on('end', async (collected, reason) => {
        if (reason === 'time') {
            const originalChannelId = userVoiceState.channel.id;
            let moved = 0;
            let firstChannel = true;
            const allVoiceChannels = await DiscordAPI.getInstance().getVoiceChannelsFromGuildId(guildId); 
            const twoRandomChannels = getTwoRandomItemsFromList(allVoiceChannels);
            while (moved <= DEFAULT_POKE_TIMES_TO_MOVE) {
                await userVoiceState.setChannel(firstChannel ? twoRandomChannels[0].id : twoRandomChannels[1].id);
                firstChannel = !firstChannel;
                await customTimeout(.2);
                moved++;
            }
            await userVoiceState.setChannel(originalChannelId);
            await interaction.followUp('🍆 🍆 complete.');
        }
    });

    return ``;
  }
}
