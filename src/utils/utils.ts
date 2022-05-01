import { TIME_CONSTANTS } from '../utils/constants';

// formatted as MM/DD/YYYY
function getFormattedDateFromEpoch(epoch) {
    const lastSeenDate = new Date(0);
    lastSeenDate.setUTCMilliseconds(epoch);
    return lastSeenDate.toLocaleDateString();
}

// ex: 5000, SECONDS -> 5
function convertEpochToUnit(epoch, unit) {
    switch (unit) {
        case TIME_CONSTANTS.SECONDS: {
            return Math.floor(epoch / 1000);
        }
        case TIME_CONSTANTS.MINUTES: {
            return Math.floor(epoch / 60000);
        }
        case TIME_CONSTANTS.HOURS: {
            return Math.floor(epoch / 3600000);
        }
        case TIME_CONSTANTS.DAYS: {
            return Math.floor(epoch / 86400000);
        }
        case TIME_CONSTANTS.MONTHS: {
            return 'lol this should not have been an option';
        }
    }
}

export {
    getFormattedDateFromEpoch,
    convertEpochToUnit
}