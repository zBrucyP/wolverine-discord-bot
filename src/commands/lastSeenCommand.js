const { UserDB } = require("../db/dynamo");
const { getUserNotSeenMessage, BAD_USERNAME_MESSAGE, getNoDateForUserMessage } = require("../utils/constants");
const { getFormattedDateFromEpoch } = require("../utils/utils");

const userDB = new UserDB();

const generateLastSeenResponse = async (username) => {
    if (!username) return BAD_USERNAME_MESSAGE;
    const user = await userDB.fetchUser(username);
    if (!user) return getUserNotSeenMessage(username);
    const lastSeenEpoch = user?.lastSeen?.S;
    if (!lastSeenEpoch) return getNoDateForUserMessage(username);

    console.log(`lastseen: ${username} on ${lastSeenEpoch}`);
    return `Ah, I saw ${username} on ${getFormattedDateFromEpoch(lastSeenEpoch)}!`
}

module.exports = {
    generateLastSeenResponse
}