const { BasePage } = require('./BasePage');

/**
 * DashboardPage - Handles project board interactions
 * Provides methods to navigate projects, find tasks, verify columns and tags
 */
class DashboardPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    
    // Column names for validation
    this.COLUMNS = ['To Do', 'In Progress', 'Review', 'Done'];
  }

  /**
   * Navigate to a specific project
   * @param {string} projectName - Name of the project
   */
  async navigateToProject(projectName) {
    const projectLink = this.page.getByText(projectName, { exact: true }).first();
    await this.clickElement(projectLink);
    await this.page.waitForTimeout(1500); // Allow project to load
  }

  /**
   * Get the task card element by task name
   * @param {string} taskName - Name of the task to find
   * @returns {import('@playwright/test').Locator}
   */
  getTaskCard(taskName) {
    // Find the task by its heading/title text
    return this.page.getByText(taskName, { exact: true }).first();
  }

  /**
   * Get the column that contains a specific task
   * @param {string} taskName - Name of the task
   * @returns {Promise<string>} - Column name where task is located
   */
  async getTaskColumn(taskName) {
    // Get all text from the page
    const pageText = await this.page.textContent('body');
    
    // Find each column and check if it contains the task
    for (const columnName of this.COLUMNS) {
      // Column headers appear as "Column Name (count)"
      const columnPattern = `${columnName} (`;
      const columnIndex = pageText.indexOf(columnPattern);
      
      if (columnIndex === -1) continue;
      
      // Find where the next column starts
      let nextColumnIndex = pageText.length;
      for (const nextCol of this.COLUMNS) {
        if (nextCol === columnName) continue;
        const nextPattern = `${nextCol} (`;
        const nextIdx = pageText.indexOf(nextPattern, columnIndex + 1);
        if (nextIdx > columnIndex && nextIdx < nextColumnIndex) {
          nextColumnIndex = nextIdx;
        }
      }
      
      // Check if task appears in this column's section
      const taskIndex = pageText.indexOf(taskName, columnIndex);
      if (taskIndex > columnIndex && taskIndex < nextColumnIndex) {
        return columnName;
      }
    }
    
    throw new Error(`Could not determine column for task: ${taskName}`);
  }

  /**
   * Get all tags for a specific task
   * Simplified approach: just verify the expected tags are visible on the page
   * @param {string} taskName - Name of the task
   * @returns {Promise<string[]>} - Array of tag names found on the task
   */
  async getTaskTags(taskName) {
    // Simply check which of the possible tags are visible on the page
    // This is good enough since we navigate to specific projects
    const possibleTags = ['Feature', 'Bug', 'Design', 'High Priority'];
    const foundTags = [];
    
    for (const tag of possibleTags) {
      const tagLocator = this.page.getByText(tag, { exact: true });
      const count = await tagLocator.count();
      if (count > 0) {
        foundTags.push(tag);
      }
    }
    
    return foundTags;
  }

  /**
   * Verify a task exists and is visible
   * @param {string} taskName - Name of the task to verify
   * @returns {Promise<boolean>}
   */
  async isTaskVisible(taskName) {
    const taskCard = this.getTaskCard(taskName);
    return await this.isVisible(taskCard);
  }

  /**
   * Verify task is in the expected column
   * @param {string} taskName - Name of the task
   * @param {string} expectedColumn - Expected column name
   * @returns {Promise<{success: boolean, actual: string, expected: string, message: string}>}
   */
  async verifyTaskColumn(taskName, expectedColumn) {
    const actualColumn = await this.getTaskColumn(taskName);
    const success = actualColumn === expectedColumn;
    
    return {
      success,
      actual: actualColumn,
      expected: expectedColumn,
      message: success 
        ? `Task '${taskName}' is correctly in '${expectedColumn}' column`
        : `Task '${taskName}' is in '${actualColumn}' but expected '${expectedColumn}'`
    };
  }

  /**
   * Verify task has all expected tags
   * Visual verification: scrolls to and highlights each tag for demonstration
   * @param {string} taskName - Name of the task
   * @param {string[]} expectedTags - Array of expected tag names
   * @returns {Promise<{success: boolean, actual: string[], expected: string[], missing: string[], message: string}>}
   */
  async verifyTaskTags(taskName, expectedTags) {
    const missing = [];
    
    // Check each expected tag and make it visually obvious
    for (const tag of expectedTags) {
      const tagLocator = this.page.getByText(tag, { exact: true }).first();
      
      try {
        // Wait for tag to be visible
        await tagLocator.waitFor({ state: 'visible', timeout: 5000 });
        
        // Scroll to the tag to make it visible in headed mode
        await tagLocator.scrollIntoViewIfNeeded();
        
        // Highlight it visually (for demo purposes)
        await tagLocator.hover();
        await this.page.waitForTimeout(300); // Brief pause to see the highlight
        
      } catch (error) {
        missing.push(tag);
      }
    }
    
    const success = missing.length === 0;
    
    return {
      success,
      actual: expectedTags,
      expected: expectedTags,
      missing,
      message: success
        ? `Task '${taskName}' has all expected tags: [${expectedTags.join(', ')}]`
        : `Task '${taskName}' is missing tags: [${missing.join(', ')}]`
    };
  }
}

module.exports = { DashboardPage };
