const{test,expect} = require('@playwright/test');
const{SalesforceLoginPage} = require('../pages/SalesforceLoginPage');
test('Salesforce Login Test',async({page}) => {
const loginPage = new SalesforceLoginPage(page);
await loginPage.goto();
await loginPage.login(process.env.SF_USERNAME,process.env.SF_PASSWORD);
await expect(page).toHaveURL(/lightning/,{ timeout: 30000});
});