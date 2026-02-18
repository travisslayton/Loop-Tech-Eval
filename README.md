[![Playwright Tests](https://github.com/travisslayton/Loop-Tech-Eval/actions/workflows/playwright.yml/badge.svg)](https://github.com/travisslayton/Loop-Tech-Eval/actions)

# Loop QA Automation Framework

## Overview

Production-ready Playwright automation framework built with JavaScript.

Implements scalable test architecture using:

- Custom Playwright fixtures
- Page Object Model with inheritance
- True data-driven execution
- Structured utility layer
- CI/CD integration with GitHub Actions

Designed for maintainability, clarity, and long-term scalability.

---

## CI Behavior (GitHub Actions)

- Runs automatically on **push** and **pull request** to `main`
- Uses **CI-only retries (2)** to reduce flaky failures
- Retains **trace + video on failure** for debugging
- Uploads **Playwright HTML report** as artifact
- Average runtime: ~1 minute

> Download report: **Actions → Latest Run → Artifacts → playwright-report**

---

## Architecture Highlights

### 1. Custom Test Fixtures

```javascript
// fixtures/testFixtures.js
const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await loginPage.login(credentials);
    await use(page);
  },
  dashboardPage: async ({ authenticatedPage }, use) => {
    await use(new DashboardPage(authenticatedPage));
  }
});
