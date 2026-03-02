---
name: 'Planning Standards'
description: 'When to plan, plan format, incremental delivery, and anti-patterns'
applyTo: '**'
---

# Planning Standards

## When to Plan

- ALWAYS plan before multi-file changes.
- ALWAYS plan before architectural decisions.
- SKIP planning for small, obvious, single-file changes (typo fixes, simple bug fixes).

## Planning Process

1. **Understand**: Read relevant code and requirements before proposing anything.
2. **Ask**: If requirements are ambiguous, ask clarifying questions first.
3. **Propose**: Present a clear plan with scope, approach, and affected files.
4. **Wait**: Get explicit approval before implementing multi-file plans.
5. **Execute**: Implement in small, testable increments.

## Plan Format

```markdown
## Goal
One sentence describing the objective.

## Approach
How we will achieve it (high-level steps).

## Files Affected
- path/to/file.ts -- what changes and why
- path/to/other.ts -- what changes and why

## Risks / Open Questions
Anything uncertain or potentially problematic.

## Estimated Scope
Small (1-3 files) / Medium (4-10 files) / Large (10+ files)
```

## Incremental Delivery

- Break large tasks into small, independently testable increments.
- Each increment should leave the codebase in a working state.
- Commit after each successful increment.
- Run tests after every change, not just at the end.

## When Plans Change

- If implementation reveals the plan is wrong, stop and revise.
- Communicate what changed and why before continuing.
- Never silently deviate from an approved plan.

## Estimation

- **Small changes**: Implement directly.
- **Medium changes**: Brief plan, then implement.
- **Large changes**: Detailed plan, approval, phased implementation.

## Anti-Patterns

- Do not plan endlessly without implementing.
- Do not implement without understanding the existing code.
- Do not assume requirements. Ask when in doubt.
- Do not make sweeping changes across many files without a plan.
