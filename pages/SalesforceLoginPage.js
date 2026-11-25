class SalesforceLoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#Login');
  }

  async goto() {
    await this.page.goto('https://resourceful-bear-8jaoks-dev-ed.trailblaze.my.salesforce.com/');
  }

  async login(username, password) {
    const clientId = process.env.SF_CLIENT_ID;
    const clientSecret = process.env.SF_CLIENT_SECRET;
    const refreshToken = process.env.SF_REFRESH_TOKEN;

    if (clientId && clientSecret && refreshToken) {
    
      const tokenUrl = 'https://resourceful-bear-8jaoks-dev-ed.trailblaze.my.salesforce.com/services/oauth2/token';
      const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        
        
      });

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      const data = await response.json();
      if (!response.ok || !data.access_token) {
        throw new Error(`Salesforce OAuth failed: ${JSON.stringify(data)}`);
      }
     
        this.instance_url = data.instance_url;
      const frontdoorUrl = `${data.instance_url}/secur/frontdoor.jsp?sid=${encodeURIComponent(data.access_token)}&retURL=${encodeURIComponent('/lightning/page/home')}`;
      await this.page.goto(frontdoorUrl, { waitUntil: 'networkidle' });
      await this.page.waitForURL(/lightning/, { timeout: 30000 });
      return;
    }

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { SalesforceLoginPage };