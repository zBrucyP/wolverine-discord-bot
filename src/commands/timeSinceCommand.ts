import UserDB from "../data/dynamo";
import { convertEpochToUnit } from "../utils/utils";
import { DEFAULT_TIME_UNIT, BAD_USERNAME_MESSAGE, getUserNotSeenMessage, getNoDateForUserMessage, getRandomUserAlreadyConnectedMessage } from '../utils/constants';
import DiscordClientWrapper from "../data/discordClient";

const userDB = UserDB.getInstance();
const discordClient = DiscordClientWrapper.getInstance();

export default async function generateTimeSinceResponse(guildId, username, timeUnit) {
    if (!username) return BAD_USERNAME_MESSAGE;
    const user = await userDB.fetchUser(username);
    if (!user) return getUserNotSeenMessage(username);
    const lastSeenEpoch = user?.lastSeen?.S;
    if (!lastSeenEpoch) return getNoDateForUserMessage(username);

    // check if user is currently connected to a channel
    const userVoiceStatus = await discordClient.getGuildMemberVoiceState(guildId, user.id.S);
    if(userVoiceStatus) {
        return getRandomUserAlreadyConnectedMessage(username);
    }
    
    timeUnit = timeUnit ? timeUnit : DEFAULT_TIME_UNIT;
    const millisecondsSince = Date.now() - Number(lastSeenEpoch);
    console.log(`timesince: ${username} ${millisecondsSince}`);
    return `Phew! I haven't seen ${username} in ${convertEpochToUnit(millisecondsSince, timeUnit)} ${timeUnit}... 😓`;
}