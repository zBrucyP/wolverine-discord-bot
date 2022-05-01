"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotSeenMessage = exports.getRandomUserAlreadyConnectedMessage = exports.getNoDateForUserMessage = exports.TIME_CONSTANTS = exports.DEFAULT_TIME_UNIT = exports.COMMANDS = exports.CHANNEL_TYPES = exports.BAD_USERNAME_MESSAGE = exports.AWS_REGION = void 0;
const AWS_REGION = `us-east-2`;
exports.AWS_REGION = AWS_REGION;
const TIME_CONSTANTS = {
    SECONDS: 'Seconds',
    MINUTES: 'Minutes',
    HOURS: 'Hours',
    DAYS: 'Days',
    MONTHS: 'Months'
};
exports.TIME_CONSTANTS = TIME_CONSTANTS;
const DEFAULT_TIME_UNIT = TIME_CONSTANTS.DAYS;
exports.DEFAULT_TIME_UNIT = DEFAULT_TIME_UNIT;
const COMMANDS = {
    PING: 'ping',
    LAST_SEEN: 'lastseen',
    TIME_SINCE: 'timesince'
};
exports.COMMANDS = COMMANDS;
const getUserNotSeenMessage = (username) => `I've never seen ${username} before in my life! 🤷🏽‍♂️`;
exports.getUserNotSeenMessage = getUserNotSeenMessage;
const getNoDateForUserMessage = (username) => `I saw ${username}... but I can't remember when I saw them... 👵`;
exports.getNoDateForUserMessage = getNoDateForUserMessage;
const BAD_USERNAME_MESSAGE = `AAAAHH! I couldn't find the username! 💥💥💥 `;
exports.BAD_USERNAME_MESSAGE = BAD_USERNAME_MESSAGE;
const userAlreadyConnectedMessage1 = (username) => `Pardon me sir or madam, perhaps you should clean your glasses. I see ${username} here now... 🤓🤓`;
const userAlreadyConnectedMessage2 = (username) => `You right now not realizing ${(username)} is already connected \n https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Pikachu_artwork_for_Pok%C3%A9mon_Red_and_Blue.webp/220px-Pikachu_artwork_for_Pok%C3%A9mon_Red_and_Blue.webp.png`;
const userAlreadyConnectedMessage3 = (username) => `Uh oh, looks like we got a 👵. Here dear, ${username} is right there...`;
const getRandomUserAlreadyConnectedMessage = (username) => {
    const alreadyConnectedMessages = [userAlreadyConnectedMessage1(username), userAlreadyConnectedMessage2(username), userAlreadyConnectedMessage3(username)];
    return alreadyConnectedMessages[Math.floor(Math.random() * alreadyConnectedMessages.length)];
};
exports.getRandomUserAlreadyConnectedMessage = getRandomUserAlreadyConnectedMessage;
const CHANNEL_TYPES = {
    VOICE: 2
};
exports.CHANNEL_TYPES = CHANNEL_TYPES;
