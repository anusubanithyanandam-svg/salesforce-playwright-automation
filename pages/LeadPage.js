class LeadPage {
  constructor(page) {
    this.page = page;
    this.newButton = page.getByRole('button', { name: 'New', exact: true }).first();
    this.SalutationDropdown = page.locator('button[aria-label^="Salutation"]');
    this.FirstNameInput = page.locator('input[name="firstName"]');
    this.LastNameInput = page.locator('input[name="lastName"]');
    this.CompanyInput = page.locator('input[name="Company"]');
G    this.SaveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

  async gotoLead() {
    const appLauncher = this.page.getByRole('button', { name: 'App Launcher' });
    await appLauncher.waitFor({ state: 'visible', timeout: 30000 });
    await appLauncher.click();

    const searchApps = this.page.getByPlaceholder('Search apps and items...');
    await searchApps.fill('Leads');
    await this.page.getByRole('option', { name: 'Leads', exact: true }).click();
  }

  async createLead(Salutation, FirstName, LastName, Company) {
    await this.newButton.click();
    await this.SalutationDropdown.click();
    await this.page.getByRole('option', { name: Salutation }).click();
    await this.FirstNameInput.fill(FirstName);
    await this.LastNameInput.fill(LastName);
    await this.CompanyInput.fill(Company);
    await this.SaveButton.click();
  }
}

module.exports = { LeadPage };