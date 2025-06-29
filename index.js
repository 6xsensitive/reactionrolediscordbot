const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();
client.setups = new Map();
client.prefix = ',';

fs.readdirSync('./commands').forEach(file => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

fs.readdirSync('./events').forEach(file => {
  const event = require(`./events/${file}`);
  const eventName = file.split('.')[0];
  client.on(eventName, (...args) => event(client, ...args));
});

client.login(require('./config.json').token);