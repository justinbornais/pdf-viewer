---
name: 'Coding Style'
description: 'Size limits, naming conventions, immutability, and error handling'
applyTo: '**'
---

# Coding Style

## Size Limits

| Metric | Target | Maximum |
|--------|--------|---------|
| Lines per file | 200-400 | 800 |
| Lines per function | 20-30 | 50 |
| Nesting depth | 2-3 | 4 |
| Parameters per function | 2-3 | 5 |

Prefer many small, focused files over few large ones.

## Naming Conventions

### TypeScript / JavaScript

- `camelCase` for variables and functions
- `PascalCase` for classes, types, interfaces, and components
- `SCREAMING_SNAKE_CASE` for constants
- `kebab-case` for file names

### Python

- `snake_case` for functions, variables, and modules
- `PascalCase` for classes
- `SCREAMING_SNAKE_CASE` for constants

### Go

- `camelCase` for unexported identifiers, `PascalCase` for exported identifiers
- Acronyms stay uppercase: `HTTPServer`, `JSONParser`
- Short, descriptive names; avoid stuttering (`user.UserName` should be `user.Name`)

### Rust

- `snake_case` for functions, variables, and modules
- `PascalCase` for types and traits
- `SCREAMING_SNAKE_CASE` for constants

## Immutability

Always create new objects instead of mutating existing ones.

```typescript
// CORRECT
const updated = { ...user, name: newName };
const withItem = [...items, newItem];
const without = items.filter(x => x.id !== targetId);

// WRONG -- never mutate
user.name = newName;
items.push(newItem);
items.splice(index, 1);
```

Use spread operators, `.map()`, and `.filter()` instead of `.push()`, `.splice()`, or direct property assignment on shared state.

## Error Handling

- Always handle errors explicitly. Never swallow them silently.
- Wrap errors with context describing the operation that failed.
- Return typed results (Result/Either patterns) when failure is expected.
- Log errors with enough context to debug without reproducing the issue.

## General Principles

- No `console.log` or `print` statements in production code. Use a structured logger.
- No hardcoded magic values. Extract them to named constants.
- Extract repeated logic into well-named helper functions.
- Keep conditionals simple. Extract complex conditions into descriptive boolean variables.
