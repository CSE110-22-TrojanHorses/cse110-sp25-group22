module.exports = {
  launch: {
    headless: false,
    slowMo: 50
  },
  server: {
    command: 'npm run start',
    port: 9999,
    launchTimeout: 20000,
    debug: true
  }
};