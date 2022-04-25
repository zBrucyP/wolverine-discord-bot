const acceptableCommands = [
    'ping',
    'lastseen',
    'timesince'
];

const TIME_CONSTANTS = {
    SECONDS: 'Seconds',
    MINUTES: 'Minutes',
    HOURS: 'Hours',
    DAYS: 'Days',
    MONTHS: 'Months'
}

module.exports = {
    acceptableCommands,
    TIME_CONSTANTS
}