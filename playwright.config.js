const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  reporter: 'html',
  workers: 1,
  use: {
    baseURL: 'https://resourceful-bear-8jaoks-dev-ed.trailblaze.lightning.force.com',
    screenshot: 'only-on-failure',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
});