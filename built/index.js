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
require('dotenv').config();
const constants_1 = require("./utils/constants");
const commandValidator_1 = require("./commands/commandValidator");
const pingCommand_1 = require("./commands/pingCommand");
const lastSeenCommand_1 = require("./commands/lastSeenCommand");
const timeSinceCommand_1 = require("./commands/timeSinceCommand");
const dynamo_1 = require("./data/dynamo");
const discordApi_1 = require("./data/discordApi");
const discordClient_1 = require("./data/discordClient");
// Discordjs setup
const clientWrapper = discordClient_1.default.getInstance();
const discordApi = discordApi_1.default.getInstance();
clientWrapper.getClient().login(process.env.bot_token);
const userDB = dynamo_1.default.getInstance();
const commandValidator = new commandValidator_1.default(Object.values(constants_1.COMMANDS));
clientWrapper.getClient().on('ready', () => {
    console.log(`Logged in as ${clientWrapper.getClient().user.tag}!`);
});
clientWrapper.getClient().on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand() || !commandValidator.isValid(interaction.commandName))
        return;
    switch (interaction.commandName) {
        case constants_1.COMMANDS.PING: {
            yield interaction.reply((0, pingCommand_1.default)());
            return;
        }
        case constants_1.COMMANDS.LAST_SEEN: {
            const username = getUsernameFromInteraction(interaction);
            const guildId = interaction.guildId;
            const response = yield (0, lastSeenCommand_1.default)(username, guildId);
            yield interaction.reply(response);
            return;
        }
        case constants_1.COMMANDS.TIME_SINCE: {
            const username = getUsernameFromInteraction(interaction);
            const guildId = interaction.guildId;
            const timeUnit = interaction.options.getString('timeunit');
            const response = yield (0, timeSinceCommand_1.default)(guildId, username, timeUnit);
            yield interaction.reply(response);
            return;
        }
    }
}));
clientWrapper.getClient().on('voiceStateUpdate', (oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
    if (oldState.member.user.bot)
        return;
    const channelId = newState.channelId; // if joining, has the id of the channel. If disconnecting from channels, is null
    console.log(`User ${newState.id} ${channelId ? 'joined' : 'left'} channel ${channelId ? channelId : ''} in ${newState.guild.name}`);
    const user = yield discordApi.getUserFromId(newState.id); // id on new state refers to the user id
    const result = yield userDB.insertUser(user);
    return;
}));
function getUsernameFromInteraction(interaction) {
    var _a;
    return (_a = interaction === null || interaction === void 0 ? void 0 : interaction.options) === null || _a === void 0 ? void 0 : _a.getString('username');
}
