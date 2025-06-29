module.exports = async (client, message) => {
  if (!message.content.startsWith(client.prefix) || message.author.bot) return;

  const args = message.content.slice(client.prefix.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();

  const command = client.commands.get(cmdName) ||
                  [...client.commands.values()].find(cmd => cmd.alias === cmdName);

  if (command) command.execute(client, message, args);
};