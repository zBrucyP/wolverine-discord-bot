const { convertEpochToUnit } = require("../utils/utils");
const { TIME_CONSTANTS } = require('../utils/constants');

const generateTimeSinceResponse = (user, timeUnit) => {
    const lastSeenEpoch = user?.lastSeen?.S;
    const username = user?.username?.S;
    if (!lastSeenEpoch || !username) return getErrorMessageResponse(username, lastSeenEpoch);
    
    timeUnit = timeUnit ? timeUnit : TIME_CONSTANTS.DAYS;
    const millisecondsSince = Date.now() - lastSeenEpoch;
    return `Phew! I haven't seen ${username} in ${convertEpochToUnit(millisecondsSince, timeUnit)} ${timeUnit}...`;
}

const getErrorMessageResponse = (username, date) => {
    if (!username) {
        return `AAAAHH! I couldn't find the username! 💥💥💥 `
    }
    if (!date) {
        return `I see ${username}... but I can't remember when I saw them... 😟`
    }
}

module.exports = {
    generateTimeSinceResponse
}