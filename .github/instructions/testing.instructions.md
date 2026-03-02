---
name: 'Testing Standards'
description: 'TDD cycle, coverage targets, test structure, and quality standards'
applyTo: '**'
---

# Testing Standards

## TDD Cycle

Always write tests first:

```
RED      -> Write a failing test that defines expected behavior
GREEN    -> Write the minimal code to make it pass
REFACTOR -> Improve code quality while tests stay green
REPEAT   -> Next requirement
```

## Coverage Targets

| Code Type | Target |
|-----------|--------|
| Critical business logic | 100% |
| Public APIs | 90%+ |
| General application code | 80%+ |
| Generated / boilerplate | Exclude from coverage |

## Test Structure (AAA Pattern)

```
Arrange  -> Set up test data and dependencies
Act      -> Execute the code under test
Assert   -> Verify the result matches expectations
```

Keep each test focused on one behavior. Name tests to describe that behavior clearly.

## What to Test

- Public API functions and methods.
- Edge cases: null, empty, zero, boundary values, overflow.
- Error handling paths and failure modes.
- User-facing functionality and workflows.

## What NOT to Test

- Framework internals or third-party library behavior.
- Trivial getters and setters with no logic.
- Private implementation details (test through the public API).
- Exact log messages or cosmetic output formatting.

## Test Quality Standards

- **Independent**: No shared mutable state between tests. Each test stands alone.
- **Deterministic**: No randomness or time-dependence without mocks. Tests always produce the same result.
- **Fast**: Unit tests must run under 100ms each.
- **Isolated**: Mock external dependencies. Never call real APIs in unit tests.
- **Regression coverage**: Every bug fix must include a regression test that would have caught the bug.

## Test Commands Reference

```bash
# TypeScript / JavaScript
npm test -- --coverage

# Go
go test -race -cover ./...

# Python
pytest --cov=. --cov-report=html

# Rust
cargo test && cargo tarpaulin
```

## Rule: No Code Without Tests

Pull requests that add or change behavior without corresponding tests should be rejected. Write the test first, then the implementation.
