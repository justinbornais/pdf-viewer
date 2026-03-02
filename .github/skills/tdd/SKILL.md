<!-- managed-by: copilot-agent-kit -->
---
name: 'tdd'
description: 'Use when writing new features, fixing bugs, or refactoring — enforces test-first development'
---

# Test-Driven Development (TDD)

## Overview

Write the test first. Watch it fail. Write the minimal code to make it pass. Refactor. Repeat.

TDD is not optional. It is the foundation of reliable software. Every feature, every bug fix, every refactoring starts with a failing test that defines the expected behavior.

## The Iron Law

**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**

This is non-negotiable. If you write production code before a failing test exists, delete it and start over.

## When to Use

**Always use TDD for:**

- New features and functionality
- Bug fixes (write a test that reproduces the bug first)
- Refactoring (ensure tests exist before changing behavior)
- API endpoints and business logic
- Data transformations and validations

**Exceptions (rare and explicit):**

- Throwaway prototypes that will be discarded
- Generated code (OpenAPI clients, database migrations)
- Static configuration files (tsconfig, eslint configs)
- Pure markup/styling with no logic

## The RED-GREEN-REFACTOR Cycle

### RED: Write a Failing Test

Write a test that describes the behavior you want. Run it. It must fail.

```typescript
// GOOD: Specific, descriptive, tests one behavior
describe("calculateShippingCost", () => {
  it("returns free shipping for orders over $100", () => {
    const cost = calculateShippingCost({ subtotal: 150.00, weight: 2.5 });
    expect(cost).toBe(0);
  });

  it("returns $5.99 flat rate for orders under $100", () => {
    const cost = calculateShippingCost({ subtotal: 50.00, weight: 2.5 });
    expect(cost).toBe(5.99);
  });

  it("throws for negative subtotal", () => {
    expect(() => calculateShippingCost({ subtotal: -10, weight: 1 }))
      .toThrow("Subtotal must be non-negative");
  });
});
```

```typescript
// BAD: Vague, tests multiple things, no edge cases
describe("shipping", () => {
  it("works", () => {
    expect(calculateShippingCost({ subtotal: 100, weight: 1 })).toBeDefined();
  });
});
```

### GREEN: Write Minimal Code

Write the simplest code that makes the test pass. Do not add anything the tests do not require.

```typescript
// GOOD: Minimal, covers exactly what tests demand
const calculateShippingCost = (order: { subtotal: number; weight: number }): number => {
  if (order.subtotal < 0) {
    throw new Error("Subtotal must be non-negative");
  }
  return order.subtotal > 100 ? 0 : 5.99;
};
```

```typescript
// BAD: Over-engineered beyond what tests require
const calculateShippingCost = (order: Order): number => {
  // Weight-based tiers nobody asked for
  // International shipping nobody asked for
  // Tax calculation nobody asked for
};
```

### REFACTOR: Improve While Green

With passing tests as your safety net, improve code quality: extract functions, rename variables, eliminate duplication. Run tests after every change.

## Common Rationalizations

| Rationalization | Reality |
|----------------|---------|
| "It's too simple to test" | Writing the test takes 30 seconds. Not writing it costs hours when it breaks. |
| "I'll write tests after" | Tests that pass immediately prove nothing. You cannot verify they catch failures. |
| "I know this works" | You know it works *now*. Tests prove it works *tomorrow* after someone else changes it. |
| "Testing slows me down" | Debugging without tests slows you down. TDD prevents bugs; debugging fixes them. |
| "It's just a refactor" | Refactoring without tests is not refactoring. It is unverified code rearrangement. |
| "The deadline is tight" | Shipping untested code creates more work later. The deadline gets tighter, not looser. |

## Completion Checklist

Before considering any task done:

- [ ] Full test suite passes (run the test command, show the output)
- [ ] Coverage targets met: 100% for business logic, 90%+ for public APIs, 80%+ for general code
- [ ] Edge cases covered: null, empty, zero, boundary values, overflow
- [ ] Error paths tested: every catch block, every validation failure
- [ ] No skipped or commented-out tests
- [ ] Tests are independent and deterministic
- [ ] Each test verifies one specific behavior

## Strict Enforcement

If production code is written before a failing test:

1. **Stop immediately**
2. **Delete the production code**
3. **Write the failing test first**
4. **Then rewrite the production code to make it pass**

No exceptions. No "just this once." The discipline is the value.
