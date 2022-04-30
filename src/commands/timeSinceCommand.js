const { UserDB } = require("../db/dynamo");
const { convertEpochToUnit } = require("../utils/utils");
const { DEFAULT_TIME_UNIT, getUserNotSeenMessage, getNoDateForUserMessage } = require('../utils/constants');

const userDB = new UserDB();

const generateTimeSinceResponse = async (username, timeUnit) => {
    if (!username) return BAD_USERNAME_MESSAGE;
    const user = await userDB.fetchUser(username);
    if (!user) return getUserNotSeenMessage(username);
    const lastSeenEpoch = user?.lastSeen?.S;
    if (!lastSeenEpoch) return getNoDateForUserMessage(username);
    
    timeUnit = timeUnit ? timeUnit : DEFAULT_TIME_UNIT;
    const millisecondsSince = Date.now() - lastSeenEpoch;
    console.log(`timesince: ${username} ${millisecondsSince}`);
    return `Phew! I haven't seen ${username} in ${convertEpochToUnit(millisecondsSince, timeUnit)} ${timeUnit}... 😓`;
}

module.exports = {
    generateTimeSinceResponse
}