const crypto = require('crypto');

class SalesforceApiClient {
  constructor(request) {
    this.request = request;
    this.accessToken = null;
    this.instanceUrl = null;
    this.apiVersion = 'v60.0';
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

  async authenticate() {
    const clientId = process.env.SF_CLIENT_ID;
    const username = process.env.SF_USERNAME;
    const privateKey = process.env.SF_JWT_PRIVATE_KEY;

    const assertion = this.createJwtAssertion(clientId, username, privateKey);
    const response = await this.request.post('https://login.salesforce.com/services/oauth2/token', {
      form: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      },
    });

    const data = await response.json();
    if (!response.ok() || !data.access_token) {
      throw new Error(`API OAuth failed: ${JSON.stringify(data)}`);
    }

    this.accessToken = data.access_token;
    this.instanceUrl = data.instance_url;
  }

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createLead(leadData) {
    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects/Lead`;
    const response = await this.request.post(url, {
      headers: this.getAuthHeaders(),
      data: leadData,
    });
    const body = await response.json();
    if (!response.ok() || !body.success) {
      throw new Error(`Create Lead API failed: ${JSON.stringify(body)}`);
    }
    return body.id;
  }

  async getLead(leadId) {
    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects/Lead/${leadId}`;
    const response = await this.request.get(url, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok()) {
      throw new Error(`Get Lead API failed with status ${response.status()}`);
    }
    return await response.json();
  }

  async deleteLead(leadId) {
    const url = `${this.instanceUrl}/services/data/${this.apiVersion}/sobjects/Lead/${leadId}`;
    const response = await this.request.delete(url, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok()) {
      throw new Error(`Delete Lead API failed with status ${response.status()}`);
    }
  }
}

module.exports = { SalesforceApiClient };