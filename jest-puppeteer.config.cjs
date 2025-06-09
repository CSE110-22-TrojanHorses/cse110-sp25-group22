// e2e-config.js (or wherever this config is)
const ci = Boolean(process.env.CI || false);

const baseOptions = {
  launch: {
    headless: false
  }
};

const ciPipelineOptions = {
  launch: {
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  }
};

module.exports = ci ? ciPipelineOptions : baseOptions;