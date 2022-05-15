import Command from './command';

export default class PingCommand implements Command {
  async execute(): Promise<string> {
    return 'Pong! 😉';
  }
}
