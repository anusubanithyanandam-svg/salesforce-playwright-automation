const leadData = require('../test-data/leads.json');
const { test, expect } = require('@playwright/test');
const { SalesforceLoginPage } = require('../pages/SalesforceLoginPage');
const { LeadPage } = require('../pages/LeadPage');

for (const data of leadData) {
  test(`Data-Driven: ${data.caseName}`, async ({ page }) => {
    const loginPage = new SalesforceLoginPage(page);
    const leadPage = new LeadPage(page);

    await loginPage.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, '/lightning/o/Lead/new');
    await leadPage.gotoLead();

    const LastName = `${data.lastNamePrefix}_${Date.now()}`;
    const Company = `${data.companyPrefix}_${Date.now()}`;

    await leadPage.createLead(data.salutation, data.firstName, LastName, Company);
    await expect(page.getByText(LastName).first()).toBeVisible({ timeout: 15000 });
  });
}

test('Negative Test: Required field Validation', async ({ page }) => {
  const loginPage = new SalesforceLoginPage(page);
  const leadPage = new LeadPage(page);

  await loginPage.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, '/lightning/o/Lead/new');
  await leadPage.gotoLead();
  await leadPage.submitEmptyLeadForm();

  await expect(leadPage.fieldErrorText).toBeVisible({ timeout: 10000 });
});