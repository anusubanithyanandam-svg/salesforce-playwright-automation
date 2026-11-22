const{defineConfig} = require('@playwright/test');
module.exports = defineConfig({
      testDir:'./tests',
      use:{ 
        baseURL:'https://login.salesforce.com',
        screenshot:'only-on-failure',
      }
});