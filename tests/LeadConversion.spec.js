const leadData = require('../test-data/leads.json');
const { test, expect } = require('@playwright/test');
const { SalesforceLoginPage } = require('../pages/SalesforceLoginPage');
const { LeadPage } = require('../pages/LeadPage');

test('Convert a Lead in salesforce', async ({ page }) => {
  const data = leadData[0];
  const loginPage = new SalesforceLoginPage(page);
  const leadPage = new LeadPage(page);

  await loginPage.login(process.env.SF_USERNAME, process.env.SF_PASSWORD,'/lightning/o/Lead/new');

  const uniqueId = Date.now();
  await leadPage.gotoLead();
  await leadPage.createLead(data.salutation, data.firstName, `${data.lastNamePrefix}_${uniqueId}`, `${data.companyPrefix}_${uniqueId}`);
  await leadPage.convertLead();

  await expect(page.getByText(/Your lead has been converted/i).first()).toBeVisible({ timeout: 30000 });
});