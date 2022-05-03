import DiscordClient from '../data/discordClient';
import UserDB from '../data/dynamo';
import {
  getUserNotSeenMessage,
  BAD_USERNAME_MESSAGE,
  getNoDateForUserMessage,
  getRandomUserAlreadyConnectedMessage,
} from '../utils/constants';
import { getFormattedDateFromEpoch } from '../utils/utils';

const userDB = UserDB.getInstance();
const discordClient = DiscordClient.getInstance();

export default async function generateLastSeenResponse(username, guildId): Promise<string> {
  if (!username) return BAD_USERNAME_MESSAGE;
  const user = await userDB.fetchUser(username);
  if (!user) return getUserNotSeenMessage(username);
  const lastSeenEpoch = user?.lastSeen?.S;
  if (!lastSeenEpoch) return getNoDateForUserMessage(username);

  // check if user is currently connected to a channel
  const userVoiceStatus = await discordClient.getGuildMemberVoiceState(guildId, user.id.S);
  console.log(`${username} has a voice status channel id of ${userVoiceStatus?.channelId}`);
  if (userVoiceStatus) {
    return getRandomUserAlreadyConnectedMessage(username);
  }

  console.log(`lastseen: ${username} on ${lastSeenEpoch}`);
  return `Ah, I saw ${username} on ${getFormattedDateFromEpoch(lastSeenEpoch)}!`;
}
