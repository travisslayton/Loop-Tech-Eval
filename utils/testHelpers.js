/**
 * Test Utilities
 * Common helper functions used across tests
 */

/**
 * Validate test case data structure
 * @param {Object} testCase - Test case object to validate
 * @throws {Error} If test case is invalid
 */
function validateTestCase(testCase) {
  const requiredFields = ['testId', 'description', 'project', 'taskName', 'expectedColumn', 'expectedTags'];
  
  for (const field of requiredFields) {
    if (!testCase[field]) {
      throw new Error(`Test case missing required field: ${field}`);
    }
  }
  
  if (!Array.isArray(testCase.expectedTags)) {
    throw new Error(`expectedTags must be an array for test case: ${testCase.testId}`);
  }
  
  if (testCase.expectedTags.length === 0) {
    throw new Error(`expectedTags cannot be empty for test case: ${testCase.testId}`);
  }
}

/**
 * Format test case for logging
 * @param {Object} testCase - Test case to format
 * @returns {string} Formatted test case string
 */
function formatTestCase(testCase) {
  return `
    Test ID: ${testCase.testId}
    Project: ${testCase.project}
    Task: ${testCase.taskName}
    Expected Column: ${testCase.expectedColumn}
    Expected Tags: [${testCase.expectedTags.join(', ')}]
  `.trim();
}

/**
 * Create detailed error message for test failures
 * @param {string} testId - Test case ID
 * @param {string} step - Which step failed
 * @param {Object} details - Error details
 * @returns {string} Formatted error message
 */
function createErrorMessage(testId, step, details) {
  return `
❌ Test ${testId} failed at step: ${step}
${JSON.stringify(details, null, 2)}
  `.trim();
}

/**
 * Log test progress
 * @param {string} testId - Test case ID
 * @param {string} message - Progress message
 */
function logProgress(testId, message) {
  console.log(`[${testId}] ${message}`);
}

module.exports = {
  validateTestCase,
  formatTestCase,
  createErrorMessage,
  logProgress
};
