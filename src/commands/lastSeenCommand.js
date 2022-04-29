const { getFormattedDateFromEpoch } = require("../utils/utils");

const generateLastSeenResponse = (user) => {
    const lastSeenEpoch = user?.lastSeen?.S;
    const username = user?.username?.S;
    if (!lastSeenEpoch || !username) return getErrorMessageResponse(username, lastSeenEpoch);

    console.log(`lastseen: ${username} on ${lastSeenEpoch}`);
    return `Ah, I saw ${username} on ${getFormattedDateFromEpoch(lastSeenEpoch)}!`
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
    generateLastSeenResponse
}