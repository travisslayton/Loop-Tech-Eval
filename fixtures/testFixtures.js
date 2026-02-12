const { test: playwrightTest, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const testData = require('../testData.json');

/**
 * Custom Test Fixtures
 * Extends Playwright's test object with authenticated page and page objects
 * This is a senior-level pattern for reusable test setup
 */
const test = playwrightTest.extend({
  /**
   * Authenticated page - automatically logs in before each test
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    
    // Navigate and login
    await loginPage.navigate();
    await loginPage.login(
      testData.loginCredentials.email,
      testData.loginCredentials.password
    );
    
    // Verify login was successful
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
    
    // Provide the authenticated page to the test
    await use(page);
  },

  /**
   * Dashboard page object - pre-initialized and ready to use
   */
  dashboardPage: async ({ authenticatedPage }, use) => {
    const dashboardPage = new DashboardPage(authenticatedPage);
    await use(dashboardPage);
  },
});

module.exports = { test, expect };
