---
name: 'security-review'
description: 'OWASP Top 10 security audit of codebase or recent changes'
agent: 'reviewer'
argument-hint: 'File or scope to review'
---

Perform a focused security review. Reference the security-review and code-review skills.

## Workflow

1. **Identify changes** (`git diff` or specified scope)
2. **Read changed files** with context
3. **Run security scanners** if available
4. **Check every OWASP Top 10 category** against all changed files
5. **Check for race conditions** in financial/state-mutation logic
6. **Run dependency audit**

**File context**: ${file}

## Report Format

```
# Security Review Report
**Risk Level**: CRITICAL / HIGH / MEDIUM / LOW

## [SEC-001] Issue Title
- **Severity**: Critical / High / Medium / Low
- **Category**: OWASP category
- **Location**: file:line
- **Impact**: What could happen
- **Remediation**: How to fix
```

### Rules

- Read-only — do not modify files
- Every finding: file, line, OWASP category, remediation
- If CRITICAL found: recommend stopping development until fixed
