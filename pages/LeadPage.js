class LeadPage{
    constructor(page){
    this.page = page;
    this.newButton = page.locator('a[title="New"]:visible');
   this.SalutationDropdown = page.getByRole('combobox',{name:'Salutation'});
    this.FirstNameInput = page.getByPlaceholder('First Name');
    this.LastNameInput = page.getByPlaceholder('Last Name');
    this.CompanyInput = page.locator('input[name="Company"]');
    this.SaveButton = page.getByRole('button',{name:'Save',exact: true});
    }
    async gotoLead() {
    await this.page.goto('https://resourceful-bear-8jaoks-dev-ed.trailblaze.my.salesforce.com/lightning/o/Lead/list',{waitUntil: 'domcontentloaded'});
  }
  async createLead(Salutation,FirstName,LastName,Company){
    await this.newButton.click();
    await this.SalutationDropdown.click();
    await this.page.getByRole('option',{name:Salutation}).click();
    await this.FirstNameInput.fill(FirstName);
    await this.LastNameInput.fill(LastName);
    await this.CompanyInput.fill(Company);
    await this.SaveButton.click();
  }
  
}
module.exports = { LeadPage };