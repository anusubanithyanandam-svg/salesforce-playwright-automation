const crypto = require('crypto');

class SalesforceLoginPage {
  constructor(page) {
    this.page = page;
  }

  createJwtAssertion(clientId, username, privateKey) {
    const base64Url = (input) =>
      Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = base64Url(
      JSON.stringify({
        iss: clientId,
        sub: username,
        aud: 'https://login.salesforce.com',
        exp: Math.floor(Date.now() / 1000) + 180,
      })
    );

    const unsignedToken = `${header}.${payload}`;
    const signature = crypto
      .createSign('RSA-SHA256')
      .update(unsignedToken)
      .sign(privateKey, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${unsignedToken}.${signature}`;
  }

  async login() {
    const clientId = process.env.SF_CLIENT_ID;
    const username = process.env.SF_USERNAME;
    const privateKey = process.env.SF_JWT_PRIVATE_KEY;

    if (!clientId || !username || !privateKey) {
      throw new Error('Missing SF_CLIENT_ID, SF_USERNAME, or SF_JWT_PRIVATE_KEY environment variables.');
    }

    const assertion = this.createJwtAssertion(clientId, username, privateKey);

    const tokenRes = await this.page.request.post('https://login.salesforce.com/services/oauth2/token', {
      form: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      },
    });

    const data = await tokenRes.json();
    if (!tokenRes.ok() || !data.access_token) {
      throw new Error(`JWT OAuth failed: ${JSON.stringify(data)}`);
    }

    const frontdoorUrl = `${data.instance_url}/secur/frontdoor.jsp?sid=${encodeURIComponent(data.access_token)}&retURL=${encodeURIComponent('/lightning/page/home')}`;
    await this.page.goto(frontdoorUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    try {
      await this.page.locator('.slds-icon-waffle').waitFor({ state: 'visible', timeout: 60000 });
    } catch (err) {
      throw new Error(`Lightning did not load. Current URL: ${this.page.url()} | ${err.message}`);
    }
  }
}

module.exports = { SalesforceLoginPage };