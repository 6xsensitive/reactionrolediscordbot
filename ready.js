module.exports = (client) => {
  console.log(`${client.user.tag} is online!`);

  client.user.setPresence({
    status: 'online',
    activities: [
      {
        name: 'made by 6xsensitive (https://guns.lol/6xsensitive)',
        type: 4
      }
    ]
  });
};