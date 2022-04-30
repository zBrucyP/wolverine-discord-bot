const { UserDB } = require("../data/dynamo");
const { convertEpochToUnit } = require("../utils/utils");
const { DEFAULT_TIME_UNIT, getUserNotSeenMessage, getNoDateForUserMessage, getRandomUserAlreadyConnectedMessage } = require('../utils/constants');
const { DiscordClient } = require("../data/discordClient");

const userDB = new UserDB();
const discordClient = new DiscordClient();

const generateTimeSinceResponse = async (guildId, username, timeUnit) => {
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
    const millisecondsSince = Date.now() - lastSeenEpoch;
    console.log(`timesince: ${username} ${millisecondsSince}`);
    return `Phew! I haven't seen ${username} in ${convertEpochToUnit(millisecondsSince, timeUnit)} ${timeUnit}... 😓`;
}

module.exports = {
    generateTimeSinceResponse
}