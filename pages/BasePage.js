/**
 * BasePage - Parent class for all page objects
 * Contains common functionality used across all pages
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigate to a URL
   * @param {string} url - URL to navigate to
   */
  async goto(url = '/') {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Get text content of an element
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    const text = await locator.textContent();
    return text?.trim() || '';
  }

  /**
   * Click an element with retry logic
   * @param {import('@playwright/test').Locator} locator
   */
  async clickElement(locator) {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.click();
    await this.page.waitForTimeout(500); // Small wait for UI update
  }

  /**
   * Fill input field
   * @param {import('@playwright/test').Locator} locator
   * @param {string} text
   */
  async fillInput(locator, text) {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Check if element is visible
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<boolean>}
   */
  async isVisible(locator) {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { BasePage };
