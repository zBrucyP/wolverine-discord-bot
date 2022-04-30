const AWS_REGION = `us-east-2`;

const TIME_CONSTANTS = {
    SECONDS: 'Seconds',
    MINUTES: 'Minutes',
    HOURS: 'Hours',
    DAYS: 'Days',
    MONTHS: 'Months'
}

const DEFAULT_TIME_UNIT = TIME_CONSTANTS.DAYS;

const COMMANDS = {
    PING: 'ping',
    LAST_SEEN: 'lastseen',
    TIME_SINCE: 'timesince'
}

const getUserNotSeenMessage = (username) => `I've never seen ${username} before in my life! 🤷🏽‍♂️`;
const getNoDateForUserMessage = (username) => `I saw ${username}... but I can't remember when I saw them... 👵`;
const BAD_USERNAME_MESSAGE = `AAAAHH! I couldn't find the username! 💥💥💥 `;

module.exports = {
    AWS_REGION,
    BAD_USERNAME_MESSAGE,
    COMMANDS,
    DEFAULT_TIME_UNIT,
    TIME_CONSTANTS,
    getUserNotSeenMessage,
    getNoDateForUserMessage
}