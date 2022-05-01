"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamo_1 = require("../data/dynamo");
const utils_1 = require("../utils/utils");
const constants_1 = require("../utils/constants");
const discordClient_1 = require("../data/discordClient");
const userDB = dynamo_1.default.getInstance();
const discordClient = discordClient_1.default.getInstance();
function generateTimeSinceResponse(guildId, username, timeUnit) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!username)
            return constants_1.BAD_USERNAME_MESSAGE;
        const user = yield userDB.fetchUser(username);
        if (!user)
            return (0, constants_1.getUserNotSeenMessage)(username);
        const lastSeenEpoch = (_a = user === null || user === void 0 ? void 0 : user.lastSeen) === null || _a === void 0 ? void 0 : _a.S;
        if (!lastSeenEpoch)
            return (0, constants_1.getNoDateForUserMessage)(username);
        // check if user is currently connected to a channel
        const userVoiceStatus = yield discordClient.getGuildMemberVoiceState(guildId, user.id.S);
        if (userVoiceStatus) {
            return (0, constants_1.getRandomUserAlreadyConnectedMessage)(username);
        }
        timeUnit = timeUnit ? timeUnit : constants_1.DEFAULT_TIME_UNIT;
        const millisecondsSince = Date.now() - Number(lastSeenEpoch);
        console.log(`timesince: ${username} ${millisecondsSince}`);
        return `Phew! I haven't seen ${username} in ${(0, utils_1.convertEpochToUnit)(millisecondsSince, timeUnit)} ${timeUnit}... 😓`;
    });
}
exports.default = generateTimeSinceResponse;
