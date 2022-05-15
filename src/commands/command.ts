export default interface Command {
  execute(...args): Promise<string>;
}
