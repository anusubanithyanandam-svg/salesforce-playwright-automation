class LeadPage {
 constructor(page) {
    this.page = page;
    this.newButton = page.getByRole('button', { name: 'New', exact: true }).first();
    this.SalutationDropdown = page.getByRole('combobox', { name: 'Salutation' });
    this.FirstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.LastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.CompanyInput = page.getByRole('textbox', { name: 'Company' });
    this.SaveButton = page.getByRole('button', { name: 'Save', exact: true });
  }
async gotoLead() {
  await this.page.locator('.slds-icon-waffle').click();
  await this.page.getByPlaceholder('Search apps and items...').fill('Leads');
  await this.page.getByRole('option', { name: 'Leads', exact: true }).click();
  await this.newButton.waitFor({ state: 'visible', timeout: 30000 });
  await this.newButton.click();
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