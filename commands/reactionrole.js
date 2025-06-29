const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'reactionrole',
  alias: 'rr',
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      const embed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`${message.member}: You need the **Manage Roles** permission to use this command.`);
      return message.channel.send({ embeds: [embed] });
    }

    const sub = args[0]?.toLowerCase();

    if (sub === 'remove') {
      const link = args[1];
      if (!link) {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setDescription('Usage: `,rr remove <message link>`');
        return message.channel.send({ embeds: [embed] });
      }

      const match = link.match(/channels\/(\d+)\/(\d+)\/(\d+)/);
      if (!match) {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setDescription(`${message.member}: Invalid message link.`);
        return message.channel.send({ embeds: [embed] });
      }

      const [, , , messageId] = match;

      if (!client.setups.has(messageId)) {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setDescription(`${message.member}: That message is not registered as a reaction role setup.`);
        return message.channel.send({ embeds: [embed] });
      }

      client.setups.delete(messageId);

      const embed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`${message.member}: Reaction role setup removed for message ID: \`${messageId}\``);
      return message.channel.send({ embeds: [embed] });
    }

    if (sub === 'add') {
      if (!args[1] || !args[2] || !args[3] || !message.mentions.roles.first()) {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setTitle('Command: Reaction Role')
          .setDescription('Usage: `,rr add <message link> <emoji> <@role>`\nExample: `,rr add https://discord.com/channels/123/456/789 ⭐ @VIP`');
        return message.channel.send({ embeds: [embed] });
      }

      const link = args[1];
      const emoji = args[2];
      const role = message.mentions.roles.first();

      const botMember = message.guild.members.me;
      const missingPerms = [];

      if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) missingPerms.push('Manage Roles');
      if (!botMember.permissions.has(PermissionsBitField.Flags.AddReactions)) missingPerms.push('Add Reactions');

      if (missingPerms.length) {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setDescription(`${message.member}: I need the following permission(s): **${missingPerms.join(', ')}**`);
        return message.channel.send({ embeds: [embed] });
      }

      const match = link.match(/channels\/(\d+)\/(\d+)\/(\d+)/);
      if (!match) {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setDescription(`${message.member}: Invalid message link.`);
        return message.channel.send({ embeds: [embed] });
      }

      const [, guildId, channelId, messageId] = match;
      if (guildId !== message.guild.id) {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setDescription(`${message.member}: The message must be from **this** server.`);
        return message.channel.send({ embeds: [embed] });
      }

      let targetMessage;
      try {
        const channel = await client.channels.fetch(channelId);
        targetMessage = await channel.messages.fetch(messageId);
      } catch {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setDescription(`${message.member}: I couldn't fetch that message.`);
        return message.channel.send({ embeds: [embed] });
      }

      try {
        await targetMessage.react(emoji);
      } catch {
        const embed = new EmbedBuilder()
          .setColor('Grey')
          .setDescription(`${message.member}: Failed to react with that emoji. It might be invalid or restricted.`);
        return message.channel.send({ embeds: [embed] });
      }

      client.setups.set(messageId, {
        guildId: message.guild.id,
        roleId: role.id,
        emoji: emoji
      });

      const embed = new EmbedBuilder()
        .setColor('Grey')
        .setDescription(`${message.member}: Reaction role set: React with ${emoji} on [this message](${link}) to get <@&${role.id}>`);
      return message.channel.send({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor('Grey')
      .setTitle('Reaction Role')
      .setDescription('Usage:\n`• ,rr add <message link> <emoji> <@role>`\n`• ,rr remove <message link>`');
    return message.channel.send({ embeds: [embed] });
  }
};
