"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEpochToUnit = exports.getFormattedDateFromEpoch = void 0;
const constants_1 = require("../utils/constants");
// formatted as MM/DD/YYYY
function getFormattedDateFromEpoch(epoch) {
    const lastSeenDate = new Date(0);
    lastSeenDate.setUTCMilliseconds(epoch);
    return lastSeenDate.toLocaleDateString();
}
exports.getFormattedDateFromEpoch = getFormattedDateFromEpoch;
// ex: 5000, SECONDS -> 5
function convertEpochToUnit(epoch, unit) {
    switch (unit) {
        case constants_1.TIME_CONSTANTS.SECONDS: {
            return Math.floor(epoch / 1000);
        }
        case constants_1.TIME_CONSTANTS.MINUTES: {
            return Math.floor(epoch / 60000);
        }
        case constants_1.TIME_CONSTANTS.HOURS: {
            return Math.floor(epoch / 3600000);
        }
        case constants_1.TIME_CONSTANTS.DAYS: {
            return Math.floor(epoch / 86400000);
        }
        case constants_1.TIME_CONSTANTS.MONTHS: {
            return 'lol this should not have been an option';
        }
    }
}
exports.convertEpochToUnit = convertEpochToUnit;
