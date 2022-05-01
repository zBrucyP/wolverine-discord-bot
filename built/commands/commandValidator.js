"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandValidator {
    constructor(commands) {
        const commandSet = new Set();
        for (const command of commands) {
            commandSet.add(command);
        }
        this.acceptableCommandSet = commandSet;
    }
    isValid(command) {
        return this.acceptableCommandSet.has(command);
    }
}
exports.default = CommandValidator;
