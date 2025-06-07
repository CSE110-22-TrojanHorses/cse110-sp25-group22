// get environment varable
const ci = Boolean(process.env.CI || false);

const baseOptions = {
    launch: {
    headless: false,
    slowMo: 100 // Show browser locally
      // Optional: slows down Puppeteer so you can see steps
      //     // Optional: opens DevTools for debugging
  },
    server: {
        command: 'npm run start',
        port: 9999
      }
}

const ciPipelineOptions = {
    launch: {
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true,
        args: [
          '--ignore-certificate-errors',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
              ],
    },
    server: baseOptions.server,
}

module.exports = ci ? ciPipelineOptions : baseOptions;