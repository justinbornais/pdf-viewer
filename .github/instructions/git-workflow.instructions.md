---
name: 'Git Workflow'
description: 'Branch strategy, commit messages, PR format, and merge rules'
applyTo: '**'
---

# Git Workflow

## Branch Strategy

- NEVER commit directly to main or master.
- Create a branch for every task, no matter how small.
- Keep branches short-lived. Merge and delete promptly.

### Branch Naming

```
feature/TASK-123-short-description
fix/TASK-456-bug-summary
hotfix/TASK-789-urgent-patch
```

## Commit Messages

### Format

```
<type>(<scope>): <description>

[optional body explaining why, not what]

[optional footer: Closes #123]
```

### Types

| Type | Use For |
|------|---------|
| feat | New feature |
| fix | Bug fix |
| refactor | Restructuring without behavior change |
| test | Adding or fixing tests |
| docs | Documentation only |
| chore | Build, deps, tooling |
| ci | CI/CD pipeline changes |
| perf | Performance improvement |

## Commit Discipline

- One logical change per commit (atomic commits).
- Never mix refactoring with feature work in the same commit.
- Write commits so each one leaves the codebase in a working state.
- Stage specific files by name. Avoid `git add -A` or `git add .`.

## Pull Requests

- Keep PRs focused: one feature or fix per PR.
- Write a clear summary with context for reviewers.
- Open as draft when work is in progress.

### PR Description Template

```markdown
## Summary
What this PR does and why.

## Changes
- Bullet list of notable changes

## Test Plan
- How this was verified
```

## Merge Rules

- All CI checks must pass before merge.
- Resolve merge conflicts by rebasing, not with merge commits.
- Squash-merge feature branches to keep main history clean.
- Delete the branch after merge.
