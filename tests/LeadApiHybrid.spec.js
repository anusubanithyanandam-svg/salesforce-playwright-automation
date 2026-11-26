const { test, expect } = require('@playwright/test');
const { SalesforceLoginPage } = require('../pages/SalesforceLoginPage');
const { SalesforceApiClient } = require('../utils/SalesforceApiClient');

test('API + UI Hybrid: Create Lead via REST API, Verify in UI, and Cleanup', async ({ page, request }) => {
  const apiClient = new SalesforceApiClient(request);
  const loginPage = new SalesforceLoginPage(page);

  await apiClient.authenticate();

  const uniqueId = Date.now();
  const payload = {
    Salutation: 'Ms.',
    FirstName: 'Anu',
    LastName: `ApiHybrid_${uniqueId}`,
    Company: `HybridCorp_${uniqueId}`,
    Status: 'Open - Not Contacted',
  };

  let leadId;
  try {
    // 1. Create Lead via Salesforce REST API
    leadId = await apiClient.createLead(payload);
    expect(leadId).toBeTruthy();

    // 2. Verify Lead record fields directly from Backend API
    const createdLead = await apiClient.getLead(leadId);
    expect(createdLead.LastName).toBe(payload.LastName);
    expect(createdLead.Company).toBe(payload.Company);

    // 3. Open the exact Lead record in Lightning UI and verify visibility
    await loginPage.login();
    await page.goto(`${apiClient.instanceUrl}/lightning/r/Lead/${leadId}/view`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await expect(page.getByText(payload.LastName).first()).toBeVisible({ timeout: 20000 });
  } finally {
    // 4. Clean up test data via REST API
    if (leadId) {
      await apiClient.deleteLead(leadId);
    }
  }
});