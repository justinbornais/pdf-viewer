---
name: 'review'
description: 'Code review — security checks, quality analysis, and test coverage verification'
agent: 'reviewer'
argument-hint: 'Files or changes to review (leave blank for staged changes)'
---

Perform a structured code review. Reference the code-review and security-review skills.

## Workflow

1. **Identify changes**: check `git diff --cached`, fall back to `git diff`, then `git diff HEAD~1`
2. **Read each changed file** with surrounding context
3. **Check for linter results** and test results
4. **Verify security**: no hardcoded secrets, no SQL injection, no XSS, auth on protected endpoints, error messages don't leak internals
5. **Check code quality**: files <800 lines, functions <50 lines, nesting <4, proper error handling, no dead code
6. **Flag new/modified code paths** lacking tests

**File context**: ${file}

**Selected code**: ${selection}

## Report Format

- Files reviewed count
- Issues by severity (critical / high / medium / low)
- Decision: **Approve** | **Request Changes** | **Block**
- Each issue: `file:line`, category, impact, recommendation
