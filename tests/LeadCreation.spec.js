const{test,expect} = require('@playwright/test');
const{SalesforceLoginPage} = require('../pages/SalesforceLoginPage/');
const{LeadPage} = require('../pages/LeadPage/');
test('Create a New Lead in Salesforce',async({page}) =>{
    const loginPage = new SalesforceLoginPage(page);
    const leadPage = new LeadPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.SF_USERNAME,process.env.SF_PASSWORD);
    await leadPage.gotoLead();
    const LastName = 'TestLead_' + Date.now();
    await leadPage.createLead('Ms.','Anu',LastName,'TechCrop');
    await expect(page.getByText(LastName)).toBeVisible();



});