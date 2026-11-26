const{test,expect} = require('@playwright/test');
const{SalesforceLoginPage} = require('../pages/SalesforceLoginPage');
const{LeadPage} = require('../pages/LeadPage');
test('Convert a Lead in salesforce',async({page})=>{
     const loginPage = new SalesforceLoginPage(page);
     const leadPage = new LeadPage(page);
     await loginPage.goto();
     await loginPage.login(process.env.SF_USERNAME,process.env.SF_PASSWORD);
     const uniqueId = Date.now();
     await leadPage.gotoLead();
     await leadPage.createLead('Ms.','Anu',`Test${uniqueId}`,`TechCrop${uniqueId}`);
     await leadPage.convertLead();
     await expect(page.getByText(/Your lead has been converted/i).first()).toBeVisible({timeout: 30000});
    });