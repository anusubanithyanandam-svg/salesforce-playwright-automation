class SalesforceLoginPage
{
    constructor(page){
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
     this.loginButton = page.locator('#Login');
    }
    async goto(){
    await this.page.goto('/');
    }


    async login(username,password){
    await this.usernameInput.fill(username);
    if(!(await this.passwordInput.isVisible())){
        await this.usernameInput.press('Enter');
    }
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    }
}
 module.exports = {SalesforceLoginPage};
