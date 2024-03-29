import {CommandInteraction, InteractionResponse, VoiceChannel} from 'discord.js';
import Command from './command';
import {createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel} from "@discordjs/voice";
import DiscordAPI from "../data/discordApi";
import {getRandomItemFromList, getUsernameFromInteraction} from "../utils/utils";
import DiscordClientWrapper from "../data/discordClient";
import ytdl from 'ytdl-core';
import UserDB from "../data/dynamo";

const chillUrls = [
    'https://youtu.be/MFy-XOpSVkE?t=4',
    'https://www.youtube.com/watch?v=S-Xm7s9eGxU&ab_channel=DistantMirrors',
    'https://www.youtube.com/watch?v=MiKuhfDjims&ab_channel=SpongeSheet',
    'https://www.youtube.com/watch?v=1n05vO7bHk0&ab_channel=dragonballmusic',
    'https://www.youtube.com/watch?v=oWqAf4eex14&ab_channel=MikeFitzer',
    'https://www.youtube.com/watch?v=mHBHHEoJ_WA&ab_channel=PatrickLify'
];

export default class ChillCommand implements Command {
    async execute(interaction: CommandInteraction): Promise<string | InteractionResponse | void> {
        const guildId = interaction.guildId;
        let connection = getVoiceConnection(guildId);

        if (!connection) {
            const username = getUsernameFromInteraction(interaction);
            const user = await UserDB.getInstance().fetchUser(username);
            if (!user) return await interaction.reply(`Hey ${interaction.user.username}, maybe you should chill 💁‍`);
            const userVoiceState = await DiscordClientWrapper.getInstance().getGuildMemberVoiceState(guildId, user.id.S);
            if (!userVoiceState?.channelId) return await interaction.reply(`Let me just chill the air for you ${interaction.user.username} 🙄`);

            const voiceChannels = await DiscordAPI.getInstance().getVoiceChannelsFromGuildId(guildId);
            const chillChannel = getRandomItemFromList(voiceChannels);
            const guild = DiscordClientWrapper.getInstance().getClient().guilds.cache.get(guildId);

            connection = joinVoiceChannel({
                channelId: chillChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator
            });

            const randomUrl = getRandomItemFromList(chillUrls);
            const stream = ytdl(randomUrl, {filter: 'audioonly', begin: '3s'});
            const player = createAudioPlayer();
            const resource = createAudioResource(stream);
            const subscription = connection.subscribe(player);
            player.play(resource);

            const originalChannelId = userVoiceState.channel.id;
            await userVoiceState.setChannel(chillChannel.id);
            await interaction.reply(`🕊️ Starting a tranquilizing operation on ${username} 😌`);

            setTimeout(() => {
                subscription.unsubscribe();
                connection.destroy();
                userVoiceState.setChannel(originalChannelId).catch(err => console.error('could not move user back', err));
            }, 15_000);
        }
        else {
            await interaction.reply(`One moment please ✋`)
        }
    }
}
