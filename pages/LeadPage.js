class LeadPage {
  constructor(page) {
    this.page = page;
    this.newButton = page.getByRole('button', { name: 'New', exact: true }).first();
    this.SalutationDropdown = page.locator('button[aria-label^="Salutation"]');
    this.FirstNameInput = page.locator('input[name="firstName"]');
    this.LastNameInput = page.locator('input[name="lastName"]');
    this.CompanyInput = page.locator('input[name="Company"]');
    this.SaveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

 async gotoLead() {
    await this.page.goto(
      'https://resourceful-bear-8jaoks-dev-ed.trailblaze.my.salesforce.com/lightning/o/Lead/new',
      { waitUntil: 'domcontentloaded' }
    );
    await this.LastNameInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async createLead(Salutation, FirstName, LastName, Company) {
    await this.SalutationDropdown.click();
    await this.page.getByRole('option', { name: Salutation }).click();
    await this.FirstNameInput.fill(FirstName);
    await this.LastNameInput.fill(LastName);
    await this.CompanyInput.fill(Company);
    await this.SaveButton.click();
  }
}

module.exports = { LeadPage };