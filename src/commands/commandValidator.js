class CommandValidator {
    acceptableCommandSet;
    
    constructor(commands) {
        const commandSet = new Set();
        for(const command of commands) {
            commandSet.add(command);
        }
        this.acceptableCommandSet = commandSet;
    }

    isValid(command) {
        return this.acceptableCommandSet.has(command);
    }
}

module.exports = {
    CommandValidator
}