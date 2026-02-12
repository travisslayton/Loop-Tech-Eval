const { BasePage } = require('./BasePage');

/**
 * LoginPage - Handles login functionality
 * Extends BasePage for common functionality
 */
class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    
    // Define locators
    this.emailInput = page.locator('input[type="text"], input[name="username"], input#username');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.goto('/');
  }

  /**
   * Perform login with credentials
   * @param {string} email - User email/username
   * @param {string} password - User password
   */
  async login(email, password) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
    
    // Wait for dashboard to be visible
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify login was successful
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    // Check if we're on the dashboard by looking for project elements
    const projectsHeader = this.page.locator('text="Projects"');
    return await this.isVisible(projectsHeader);
  }
}

module.exports = { LoginPage };
