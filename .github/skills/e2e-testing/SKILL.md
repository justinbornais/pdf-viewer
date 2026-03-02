<!-- managed-by: copilot-agent-kit -->
---
name: 'e2e-testing'
description: 'Use when setting up end-to-end tests, writing Playwright tests, implementing Page Object Model, or configuring E2E test infrastructure'
---

# E2E Testing

End-to-end test setup using Playwright (web) or framework-appropriate tools.

## Overview

End-to-end tests verify that the entire application works correctly from the user's perspective. They interact with the application through the same interface a real user would -- clicking buttons, filling forms, navigating pages, and verifying visible outcomes.

## Page Object Model

Separate page interactions from test logic. Each page or major component gets its own class that encapsulates selectors and actions.

```typescript
// pages/login-page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async getErrorMessage() {
    return this.page.getByRole('alert').textContent();
  }
}
```

```typescript
// tests/login.spec.ts
test('shows error for invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.fillEmail('bad@example.com');
  await loginPage.fillPassword('wrong');
  await loginPage.submit();

  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Invalid credentials');
});
```

### Benefits

- Tests read like user stories, not DOM manipulation
- Selector changes only need updating in one place
- Page objects are reusable across many tests

## Selector Strategy

Choose selectors in this priority order:

| Priority | Selector Type | Example | Reason |
|----------|--------------|---------|--------|
| 1 | Role | `getByRole('button', { name: 'Submit' })` | Mirrors accessibility, resilient to refactors |
| 2 | Test ID | `getByTestId('submit-btn')` | Explicit, decoupled from UI changes |
| 3 | Text content | `getByText('Welcome back')` | User-visible, meaningful assertions |
| 4 | Label | `getByLabel('Email address')` | Tied to accessible labels |
| 5 | Placeholder | `getByPlaceholder('Enter email')` | Acceptable fallback |

### Never Use

- **CSS classes** -- change frequently with styling updates
- **XPath** -- brittle, hard to read, breaks on DOM restructuring
- **Tag names alone** -- too generic, not stable
- **Auto-generated IDs** -- change between builds

## Waiting Strategy

### Use Auto-Waiting

Playwright auto-waits for elements to be actionable before interacting. Rely on this behavior by default.

```typescript
// Playwright waits automatically for the button to be visible and enabled
await page.getByRole('button', { name: 'Save' }).click();
```

### Use Explicit Waits for Dynamic Content

When content loads asynchronously, wait for specific conditions:

```typescript
// Wait for an element to appear after an async operation
await page.waitForSelector('[data-testid="results-list"]');

// Wait for a network response
await page.waitForResponse(resp =>
  resp.url().includes('/api/search') && resp.status() === 200
);

// Wait for navigation
await Promise.all([
  page.waitForNavigation(),
  page.getByRole('link', { name: 'Dashboard' }).click(),
]);
```

### Never Use Fixed Timeouts

```typescript
// WRONG -- never do this
await new Promise(resolve => setTimeout(resolve, 3000));

// CORRECT -- wait for a specific condition
await expect(page.getByText('Loaded')).toBeVisible();
```

## AAA Pattern in E2E

Apply the same Arrange-Act-Assert structure used in unit tests:

```typescript
test('user can add item to cart', async ({ page }) => {
  // Arrange -- navigate and set up preconditions
  await page.goto('/products');
  await expect(page.getByText('Product Catalog')).toBeVisible();

  // Act -- perform the user interaction
  await page.getByRole('button', { name: 'Add to Cart' }).first().click();

  // Assert -- verify the outcome
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

## Test Independence

Each test must be fully self-contained:

- **No shared state** -- tests must not depend on other tests having run first
- **Own preconditions** -- each test navigates to the right page and sets up its own data
- **Own cleanup** -- if a test creates data, it cleans up after itself (or uses isolated test accounts)
- **Parallel safe** -- tests can run in any order without conflicts

```typescript
// GOOD -- each test sets up its own state
test('displays empty cart message', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.getByText('Your cart is empty')).toBeVisible();
});

// BAD -- depends on a previous test having added items
test('shows item count after adding', async ({ page }) => {
  // This will fail if the "add item" test didn't run first
  await page.goto('/cart');
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

## Flaky Test Handling

A test that fails intermittently is worse than no test -- it erodes trust in the suite.

### Investigation Protocol

After a test fails on 2 consecutive runs:

1. **Reproduce locally** -- run the test in headed mode to observe the failure
2. **Identify the cause** -- check the categories below
3. **Fix the root cause** -- do not add retries to mask the problem
4. **Verify stability** -- run the test 10 times to confirm it passes consistently

### Common Causes and Fixes

| Cause | Symptom | Fix |
|-------|---------|-----|
| Race condition | Element not found intermittently | Add explicit wait for the condition |
| Animation timing | Click misses target | Wait for animations to complete, or disable animations in test config |
| Network latency | Timeout on API call | Mock the API or increase the specific timeout with a comment |
| Shared state | Passes alone, fails in suite | Isolate test data, use unique identifiers |
| Non-deterministic data | Assertion fails on dynamic values | Use pattern matching or ranges instead of exact values |

## CI Integration

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  // Run in headless mode for CI
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  // Retry failed tests once in CI
  retries: process.env.CI ? 1 : 0,

  // Run tests in parallel
  workers: process.env.CI ? 4 : undefined,

  // Fail fast in CI
  maxFailures: process.env.CI ? 10 : undefined,
});
```

### CI Workflow Essentials

```yaml
# Key steps for E2E in CI
steps:
  - name: Install browsers
    run: npx playwright install --with-deps chromium

  - name: Run E2E tests
    run: npx playwright test

  - name: Upload failure artifacts
    if: failure()
    uses: actions/upload-artifact@v4
    with:
      name: playwright-report
      path: playwright-report/
```

### CI Best Practices

- **Headless mode** -- always run headless in CI; headed mode is for local debugging only
- **Retry on failure** -- allow 1 retry in CI to handle transient infrastructure issues
- **Screenshot on failure** -- capture the page state when a test fails for debugging
- **Trace on failure** -- Playwright traces provide a full timeline of actions and network calls
- **Parallel execution** -- run tests across multiple workers to reduce total run time
- **Artifact upload** -- always upload test reports and screenshots on failure
- **Timeout limits** -- set reasonable timeouts to prevent hung tests from blocking the pipeline

## Project Structure

```
tests/
  e2e/
    pages/              # Page Object Model classes
      login-page.ts
      dashboard-page.ts
    fixtures/           # Test data and custom fixtures
      test-users.ts
    specs/              # Test files
      auth.spec.ts
      dashboard.spec.ts
    playwright.config.ts
```
