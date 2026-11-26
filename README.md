# Salesforce CRM End-to-End Test Automation Framework (Playwright + JavaScript)

![Playwright Tests](https://github.com/anusubanithyanandam-svg/salesforce-playwright-automation/actions/workflows/playwright.yml/badge.svg)

An enterprise-grade end-to-end test automation framework built with **Playwright** and **JavaScript** using the **Page Object Model (POM)** design pattern. It automates critical Salesforce Lightning CRM workflows—including JWT Bearer OAuth2 authentication, data-driven Lead creation, negative form validation, Lead-to-Account/Contact/Opportunity conversion, and REST API + UI hybrid testing with automated test data cleanup.

---

## Key Architecture & Features

* **Page Object Model (POM):** Clean separation between UI locators/actions (`pages/`) and test assertions (`tests/`).
* **Passwordless OAuth2 JWT Authentication:** Uses RS256 signed JWT Bearer assertions (`SalesforceLoginPage.js`) and Salesforce `frontdoor.jsp` session injection to bypass interactive MFA/CAPTCHA challenges in CI/CD.
* **Data-Driven & Negative Validation Testing:** Externalized JSON test datasets (`test-data/leads.json`) driving multiple positive Lead creation scenarios alongside required-field negative validation checks.
* **API + UI Hybrid Testing & Auto-Cleanup:** Custom `SalesforceApiClient` (`utils/SalesforceApiClient.js`) leveraging Playwright's `request` fixture to create records via Salesforce REST API (`v60.0`), verify backend fields, validate Lightning UI rendering, and automatically delete test records in a `finally` block.
* **CI/CD Integration:** Automated GitHub Actions workflow (`playwright.yml`) executing the full suite on push/pull requests with HTML report and failure screenshot artifacts.

---

## Project Structure

```text
salesforce-playwright-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI pipeline
├── pages/
│   ├── SalesforceLoginPage.js      # JWT OAuth2 authentication & Lightning session setup
│   └── LeadPage.js                 # Lead creation, conversion, and validation actions
├── test-data/
│   └── leads.json                  # Externalized test data for data-driven execution
├── tests/
│   ├── SalesforceLoginPage.spec.js # Authentication smoke test
│   ├── LeadCreation.spec.js        # Data-driven positive & negative Lead tests
│   ├── LeadConversion.spec.js      # End-to-end Lead conversion workflow
│   └── LeadApiHybrid.spec.js       # REST API + UI hybrid test with automated cleanup
├── utils/
│   └── SalesforceApiClient.js      # Reusable Salesforce REST API client (POST/GET/DELETE)
├── playwright.config.js            # Playwright runner, timeouts, and reporter config
└── package.json                    # Project dependencies