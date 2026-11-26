class LeadPage {
  constructor(page) {
    this.page = page;
    this.newButton = page.getByRole('button', { name: 'New', exact: true }).first();
    this.SalutationDropdown = page.getByRole('combobox', { name: 'Salutation' });
    this.FirstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.LastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.CompanyInput = page.getByRole('textbox', { name: 'Company' });
    this.SaveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.convertButton = page.getByRole('button', { name: 'Convert', exact: true }).first();
    this.confirmConvertButton = page.getByRole('button', { name: 'Convert', exact: true }).last();
    this.fieldErrorText = page.getByText('Complete this field').first();
  }

  async gotoLead() {
    const origin = new URL(this.page.url()).origin;
    await this.page.goto(`${origin}/lightning/o/Lead/list`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.newButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.newButton.click();
    await this.LastNameInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async submitEmptyLeadForm() {
    await this.SaveButton.click();
  }

  async createLead(Salutation, FirstName, LastName, Company) {
    if (Salutation) {
      await this.SalutationDropdown.click();
      await this.page.getByRole('option', { name: Salutation }).click();
    }
    if (FirstName) {
      await this.FirstNameInput.fill(FirstName);
    }
    if (LastName) {
      await this.LastNameInput.fill(LastName);
    }
    if (Company) {
      await this.CompanyInput.fill(Company);
    }
    await this.SaveButton.click();
    await this.page.locator('.toastMessage').waitFor({ state: 'visible', timeout: 15000 });
  }

  async convertLead() {
    await this.convertButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.convertButton.click();

    const modal = this.page.locator('[role="dialog"]').filter({ hasText: 'Convert Lead' });
    await modal.waitFor({ state: 'visible', timeout: 30000 });
    await modal.getByText('Record Owner').waitFor({state: 'visible',timeout: 30000});

    const modalConvertBtn = modal.getByRole('button', { name: 'Convert', exact: true });
    await modalConvertBtn.waitFor({ state: 'visible', timeout: 30000 });
    await modalConvertBtn.click();
  }
}

module.exports = { LeadPage };