class LeadPage {
  constructor(page) {
    this.page = page;
    this.newButton = page.getByRole('button', { name: 'New', exact: true }).first();
    this.SalutationDropdown = page.getByRole('combobox', { name: 'Salutation' });
    this.FirstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.LastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.CompanyInput = page.getByRole('textbox', { name: 'Company' });
    this.SaveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.convertButton = page.getByRole('button',{name: 'Convert' , exact:true}).first();
    this.confirmConvertButton = page.getByRole('button',{name: 'Convert',exact:true}).last();
  }
async gotoLead() {
  await this.page.locator('.slds-icon-waffle').click();
  await this.page.getByPlaceholder('Search apps and items...').fill('Leads');
  await this.page.locator('a[data-label="Leads"], one-app-launcher-menu-item a').filter({ hasText: /^Leads$/ }).first().click();  await this.newButton.waitFor({ state: 'visible', timeout: 30000 });
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
    await this.page.locator('.toastMessage').waitFor({state: 'visible',timeout:15000});
  }

  async convertLead(){
    await this.convertButton.waitFor({state: 'visible',timeout: 30000});
    await this.convertButton.click();
    await this.confirmConvertButton.waitFor({state: 'visible',timeout:30000});
    await this.confirmConvertButton.click();

  }
}

module.exports = { LeadPage };