<!-- managed-by: copilot-agent-kit -->
---
name: 'code-review'
description: 'Use when reviewing code changes — two-stage review for spec compliance and code quality'
---

# Code Review

## Overview

Code review is a two-stage process: first verify the changes meet the specification, then evaluate code quality. Every review produces a structured report with actionable findings.

## Two-Stage Review

### Stage 1: Spec Compliance

Does the code do what it is supposed to do?

- [ ] All requirements from the task/ticket are addressed
- [ ] Acceptance criteria are met
- [ ] Edge cases identified in the spec are handled
- [ ] No requirements are partially implemented
- [ ] No unrelated changes are included

### Stage 2: Code Quality

Is the code well-written, safe, and maintainable?

- [ ] Security checks pass (see below)
- [ ] Code quality checks pass (see below)
- [ ] Tests are adequate
- [ ] Error handling is comprehensive
- [ ] Naming is clear and consistent

## Review Workflow

1. **Identify changes**: List all modified, added, and deleted files
2. **Read the files**: Read each changed file to understand the modifications
3. **Run linters and tests**: Execute lint and test commands, capture output
4. **Manual review**: Apply security, quality, and spec compliance checks
5. **Produce report**: Write the structured review report

## Security Checks (OWASP Top 10)

| Category | What to Look For |
|----------|-----------------|
| Injection | String concatenation in SQL, shell commands, or HTML; unsanitized user input in queries |
| Broken Authentication | Hardcoded credentials, weak password requirements, missing session management |
| Sensitive Data Exposure | Secrets in code or logs, unencrypted sensitive data, PII in error messages |
| Broken Access Control | Missing authorization checks, direct object references without ownership validation |
| Security Misconfiguration | Debug mode in production, default credentials, overly permissive CORS |
| XSS | Unsanitized user input rendered in HTML, missing Content-Security-Policy headers |
| Known Vulnerabilities | Outdated dependencies with known CVEs, deprecated APIs |
| Insufficient Logging | No audit trail for security events, sensitive data in logs |

## Secret Detection Patterns

Search for these patterns in changed files:

```
api_key\s*[:=]
password\s*[:=]
secret\s*[:=]
token\s*[:=]
AKIA[0-9A-Z]{16}          # AWS access key
-----BEGIN .* PRIVATE KEY  # Private keys
ghp_[A-Za-z0-9]{36}       # GitHub personal access token
sk-[A-Za-z0-9]{48}        # OpenAI API key
```

If any match is found, flag as **critical severity** immediately.

## Code Quality Checks

| Check | Threshold |
|-------|-----------|
| File length | Target 200-400 lines, max 800 |
| Function length | Target 20-30 lines, max 50 |
| Nesting depth | Target 2-3 levels, max 4 |
| Function parameters | Target 2-3, max 5 |
| Error handling | Every error path handled explicitly |
| Dead code | No commented-out code, no unreachable code |
| Test coverage | Business logic 100%, public APIs 90%+, general 80%+ |
| Type safety | No `any` type (TypeScript), no `interface{}` without justification (Go) |

## Confidence Filtering

Not every observation belongs in the report. Filter by confidence:

| Confidence | Action |
|------------|--------|
| High (>80%) | Include in report |
| Medium (60-80%) | Include with caveat: "Potential issue -- verify that..." |
| Low (<60%) | Omit from report; do not waste the author's time with speculation |

## Report Structure

```markdown
# Code Review Report

## Summary
One paragraph: what was reviewed, overall assessment, key findings.

## Critical Issues
Issues that must be fixed before merge. Security vulnerabilities, data loss risks, correctness bugs.

## High Severity
Issues that should be fixed before merge. Performance problems, missing error handling, inadequate tests.

## Medium Severity
Issues worth addressing. Style inconsistencies, naming improvements, minor refactoring opportunities.

## Low Severity
Suggestions and nit-picks. Optional improvements, alternative approaches.

## Positive Observations
What was done well. Good patterns, thorough tests, clear naming.

## Decision
- [ ] APPROVE -- ready to merge
- [ ] REQUEST CHANGES -- critical/high issues must be addressed
- [ ] NEEDS DISCUSSION -- architectural concerns require conversation
```

## Finding Format

Every finding must include:

| Field | Description |
|-------|-------------|
| **File** | Full path to the file |
| **Line** | Line number or range |
| **Issue** | Clear description of the problem |
| **Impact** | What could go wrong if this is not fixed |
| **Remediation** | Specific suggestion for how to fix it |
