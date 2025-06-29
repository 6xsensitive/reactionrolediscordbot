module.exports = (client) => {
  console.log(`Signed in as${client.user.tag}`);

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
