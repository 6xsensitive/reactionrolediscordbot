module.exports = async (client, reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;

  const setup = client.setups.get(reaction.message.id);
  if (!setup || reaction.emoji.name !== setup.emoji) return;

  const guild = client.guilds.cache.get(setup.guildId);
  const member = await guild.members.fetch(user.id);
  await member.roles.remove(setup.roleId).catch(console.error);
};
