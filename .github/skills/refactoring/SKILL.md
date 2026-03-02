<!-- managed-by: copilot-agent-kit -->
---
name: 'refactoring'
description: 'Use when removing dead code, cleaning up unused imports/variables/functions, or performing incremental codebase cleanup'
---

# Refactoring

Dead code detection, safety classification, and incremental cleanup.

## Overview

Refactoring focuses on removing dead code and cleaning up the codebase without changing behavior. Every removal must be verified by running the test suite. Work incrementally, removing one category at a time, and confirm tests pass after each step.

## Safety Classification

Before removing anything, classify it by risk level.

### Safe to Remove

These can be removed with confidence after verifying tests pass:

- **Unused imports** -- modules or symbols imported but never referenced
- **Unused variables** -- declared but never read
- **Unused private functions** -- private/unexported functions with zero callers
- **Commented-out code** -- dead code preserved in comments serves no purpose in version-controlled projects

### Requires Verification

These may have consumers outside the current codebase. Verify before removing:

- **Unused exports** -- may be consumed by other packages, scripts, or downstream projects
- **API endpoints** -- may be called by external clients not visible in the codebase
- **Configuration options** -- may be used in deployment environments not represented in code

Search for references across the entire project, check documentation, and consult the team before removing.

### Never Remove Without Review

These have high blast radius. Removal requires explicit human approval:

- **Public APIs** -- external consumers depend on stability
- **Database migrations** -- removing migration files can corrupt schema history
- **Environment variables** -- may be set in CI/CD, deployment configs, or secrets managers
- **Feature flags** -- may control behavior in production; coordinate with product team

## Detection Commands by Language

### TypeScript / JavaScript

```bash
# Unused exports, files, dependencies, and types
npx knip

# Unused dependencies only
npx depcheck

# Unused imports and variables (via linter)
npx eslint --rule 'no-unused-vars: error' --rule 'no-unused-imports: error' src/
```

### Go

```bash
# Unused code (functions, variables, types)
staticcheck -checks U1000 ./...

# Unused dependencies
go mod tidy -v
```

### Python

```bash
# Unused imports (F401) and unused variables (F841)
ruff check --select F401,F841 .

# Alternative with flake8
flake8 --select F401,F841 .
```

### Rust

```bash
# Dead code warnings
cargo clippy -- -W dead_code

# Unused dependencies
cargo +nightly udeps
```

## Incremental Removal Order

Remove dead code in this order, running tests after each step:

1. **Unused imports** -- lowest risk, highest noise reduction
2. **Unused variables** -- eliminates compiler/linter warnings
3. **Unused private functions** -- safe because they have no external callers
4. **Unused dependencies** -- reduces install size and attack surface
5. **Commented-out code** -- recoverable from version control history

```
Step 1: Remove unused imports     -> Run tests -> Pass? Continue
Step 2: Remove unused variables   -> Run tests -> Pass? Continue
Step 3: Remove private functions  -> Run tests -> Pass? Continue
Step 4: Remove unused deps        -> Run tests -> Pass? Continue
Step 5: Remove commented code     -> Run tests -> Pass? Continue
```

If tests fail at any step, revert the last removal and investigate before proceeding.

## Process

1. **Scan** -- Run detection tools for the project language
2. **Classify** -- Sort findings into the three safety categories above
3. **Plan** -- List removals in incremental order
4. **Remove** -- Delete one category at a time
5. **Test** -- Run the full test suite after each removal
6. **Report** -- Generate a cleanup report summarizing the work

## Cleanup Report Format

After completing the refactoring, produce a report:

```markdown
# Cleanup Report

## Summary
- **Files modified**: <count>
- **Lines removed**: <count>
- **Tests passing**: Yes / No

## Removals

### Unused Imports
| File | Import Removed |
|------|---------------|
| src/utils/helpers.ts | `import { unused } from 'lib'` |

### Unused Variables
| File | Variable |
|------|----------|
| src/service.ts | `const staleData` |

### Unused Private Functions
| File | Function |
|------|----------|
| src/calc.ts | `_legacyCompute()` |

### Unused Dependencies
| Package | Type |
|---------|------|
| left-pad | production |
| old-tool | dev |

### Commented-Out Code
| File | Lines | Description |
|------|-------|-------------|
| src/api.ts | 45-62 | Old endpoint handler |

## Verification
- [ ] All tests pass
- [ ] Linter reports no new warnings
- [ ] Build succeeds
- [ ] No regressions in functionality
```

## Rules

- **Never skip tests** -- run the full suite after every removal
- **One category at a time** -- do not batch different types of removals
- **Revert on failure** -- if tests break, undo the last change before investigating
- **Do not refactor logic** -- this skill is for removal only; behavior changes belong in a separate task
- **Preserve public contracts** -- do not remove or rename anything in the public API without approval
