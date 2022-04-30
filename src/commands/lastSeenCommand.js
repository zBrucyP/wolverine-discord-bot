const { DiscordClient } = require("../data/discordClient");
const { UserDB } = require("../data/dynamo");
const { getUserNotSeenMessage, BAD_USERNAME_MESSAGE, getNoDateForUserMessage, getRandomUserAlreadyConnectedMessage } = require("../utils/constants");
const { getFormattedDateFromEpoch } = require("../utils/utils");

const userDB = new UserDB();
const discordClient = new DiscordClient();

const generateLastSeenResponse = async (username, guildId) => {
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

    console.log(`lastseen: ${username} on ${lastSeenEpoch}`);
    return `Ah, I saw ${username} on ${getFormattedDateFromEpoch(lastSeenEpoch)}!`
}



module.exports = {
    generateLastSeenResponse
}