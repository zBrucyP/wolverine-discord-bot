const AWS_REGION = `us-east-2`;

const TIME_CONSTANTS = {
  SECONDS: 'Seconds',
  MINUTES: 'Minutes',
  HOURS: 'Hours',
  DAYS: 'Days',
  MONTHS: 'Months',
};

const DEFAULT_TIME_UNIT = TIME_CONSTANTS.DAYS;

const COMMANDS = {
  PING: 'ping',
  LAST_SEEN: 'lastseen',
  TIME_SINCE: 'timesince',
  POKE: 'poke',
  CHILL: 'chill'
};

const getUserNotSeenMessage = (username) => `I've never seen ${username} before in my life! 🤷🏽‍♂️`;
const getNoDateForUserMessage = (username) =>
  `I saw ${username}... but I can't remember when I saw them... 👵`;
const BAD_USERNAME_MESSAGE = `AAAAHH! I couldn't find the username! 💥💥💥 `;

const userAlreadyConnectedMessage1 = (username) =>
  `Pardon me sir or madam, perhaps you should clean your glasses. I see ${username} here now... 🤓🤓`;
const userAlreadyConnectedMessage2 = (username) =>
  `You right now not realizing ${username} is already connected \n https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Pikachu_artwork_for_Pok%C3%A9mon_Red_and_Blue.webp/220px-Pikachu_artwork_for_Pok%C3%A9mon_Red_and_Blue.webp.png`;
const userAlreadyConnectedMessage3 = (username) =>
  `Uh oh, looks like we got a 👵. Here dear, ${username} is right there...`;
const getRandomUserAlreadyConnectedMessage = (username) => {
  const alreadyConnectedMessages = [
    userAlreadyConnectedMessage1(username),
    userAlreadyConnectedMessage2(username),
    userAlreadyConnectedMessage3(username),
  ];
  return alreadyConnectedMessages[Math.floor(Math.random() * alreadyConnectedMessages.length)];
};

const CHANNEL_TYPES = {
  VOICE: 2,
};

const DEFAULT_POKE_WAIT = 10;
const DEFAULT_POKE_TIMES_TO_MOVE = 8;

export {
  AWS_REGION,
  BAD_USERNAME_MESSAGE,
  CHANNEL_TYPES,
  COMMANDS,
  DEFAULT_POKE_TIMES_TO_MOVE,
  DEFAULT_POKE_WAIT,
  DEFAULT_TIME_UNIT,
  TIME_CONSTANTS,
  getNoDateForUserMessage,
  getRandomUserAlreadyConnectedMessage,
  getUserNotSeenMessage,
};
