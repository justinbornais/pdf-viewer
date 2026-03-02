<!-- managed-by: copilot-agent-kit -->
---
name: 'security-review'
description: 'Use when performing security audits, reviewing code for vulnerabilities, scanning for secrets, or assessing OWASP Top 10 compliance'
---

# Security Review

OWASP Top 10 checklist, secret detection, dependency auditing, and vulnerability reporting.

## OWASP Top 10 Checklist

### A01: Broken Access Control

**What to look for:**
- Missing authentication checks on protected endpoints
- Missing authorization checks (user A accessing user B's data)
- Direct object references without ownership verification (IDOR)
- Missing CORS configuration or overly permissive CORS
- Privilege escalation paths (regular user accessing admin functions)

**How to fix:**
- Enforce authentication on every protected route
- Verify resource ownership on every data access
- Use indirect references or validate ownership before returning data
- Configure CORS to allow only trusted origins
- Implement role-based access control (RBAC) and test it

### A02: Cryptographic Failures

**What to look for:**
- Sensitive data transmitted over HTTP (not HTTPS)
- Weak or deprecated algorithms (MD5, SHA1 for passwords, DES, RC4)
- Hardcoded encryption keys or secrets
- Missing encryption for data at rest (PII, financial data)
- Passwords stored in plaintext or with reversible encryption

**How to fix:**
- Enforce HTTPS everywhere; use HSTS headers
- Use bcrypt, scrypt, or argon2 for password hashing
- Store encryption keys in secret managers, not in code
- Encrypt sensitive data at rest using AES-256 or equivalent
- Use TLS 1.2+ for data in transit

### A03: Injection

**What to look for:**
- String concatenation in SQL queries
- User input in shell commands
- User input rendered as HTML without sanitization (XSS)
- Template injection (server-side template engines with user input)
- LDAP, XML, or NoSQL injection vectors

**How to fix:**
- Use parameterized queries or prepared statements for all database access
- Use allow-lists for shell command arguments; avoid shell execution with user input
- Sanitize HTML output with context-appropriate encoding
- Use safe template engines with auto-escaping enabled
- Validate and sanitize all user input at system boundaries

### A04: Insecure Design

**What to look for:**
- Missing rate limiting on authentication endpoints
- No account lockout after failed login attempts
- Missing CAPTCHA on public forms
- Business logic flaws (negative quantities, price manipulation)
- Missing input validation on business-critical operations

**How to fix:**
- Implement rate limiting on all public endpoints
- Lock accounts after N failed attempts with increasing delays
- Add CAPTCHA or proof-of-work on abuse-prone endpoints
- Validate business rules server-side, never trust client-side validation
- Threat model critical workflows before implementation

### A05: Security Misconfiguration

**What to look for:**
- Default credentials still active
- Debug mode enabled in production
- Verbose error messages exposing stack traces to users
- Unnecessary ports or services exposed
- Missing security headers

**How to fix:**
- Change all default credentials; automate checks for defaults
- Disable debug mode and verbose errors in production
- Return generic error messages to clients; log details server-side
- Expose only required ports; use firewalls and network policies
- Set security headers: CSP, HSTS, X-Content-Type-Options, X-Frame-Options

### A06: Vulnerable and Outdated Components

**What to look for:**
- Dependencies with known CVEs
- Outdated runtime versions
- Unmaintained or abandoned packages
- Packages with excessive permissions or suspicious behavior

**How to fix:**
- Run dependency audit tools regularly (see Dependency Audit section)
- Keep dependencies updated; automate with Dependabot or Renovate
- Replace unmaintained packages with actively maintained alternatives
- Review new dependencies before adding them

### A07: Identification and Authentication Failures

**What to look for:**
- Weak password policies (short, no complexity requirements)
- Missing multi-factor authentication on sensitive operations
- Session tokens in URLs
- Sessions that never expire
- Credential stuffing vulnerability (no rate limiting on login)

**How to fix:**
- Enforce minimum password length (12+ characters)
- Implement MFA for admin and sensitive operations
- Use HTTP-only, secure, SameSite cookies for session tokens
- Set session expiration and idle timeouts
- Rate limit authentication endpoints

### A08: Software and Data Integrity Failures

**What to look for:**
- CI/CD pipelines without integrity verification
- Deserialization of untrusted data
- Auto-update mechanisms without signature verification
- Missing subresource integrity (SRI) on CDN scripts

**How to fix:**
- Verify checksums and signatures on dependencies
- Never deserialize untrusted data (no pickle, no eval, no unvalidated JSON-to-object)
- Sign releases and verify signatures on updates
- Add SRI hashes to all external script and style tags

### A09: Security Logging and Monitoring Failures

**What to look for:**
- No logging of authentication events (login, logout, failures)
- No logging of authorization failures
- Sensitive data in logs (passwords, tokens, PII)
- No alerting on suspicious patterns
- Logs not protected from tampering

**How to fix:**
- Log all authentication and authorization events
- Never log sensitive data; redact tokens and PII
- Send logs to a centralized, tamper-evident logging service
- Set up alerts for brute force attempts, unusual access patterns
- Include correlation IDs for tracing requests across services

### A10: Server-Side Request Forgery (SSRF)

**What to look for:**
- User-supplied URLs used in server-side HTTP requests
- Internal service URLs exposed to user input
- URL redirects without validation
- File inclusion based on user input

**How to fix:**
- Validate and sanitize all user-supplied URLs
- Use allow-lists for permitted domains and IP ranges
- Block requests to internal/private IP ranges (10.x, 172.16.x, 192.168.x, 127.x)
- Do not follow redirects from user-supplied URLs without validation

## Secret Detection

Scan the codebase for accidentally committed secrets using these patterns.

### Regex Patterns

| Secret Type | Pattern |
|-------------|---------|
| AWS Access Key | `AKIA[0-9A-Z]{16}` |
| AWS Secret Key | `[0-9a-zA-Z/+=]{40}` adjacent to AWS context |
| GitHub Token | `gh[pousr]_[A-Za-z0-9_]{36,}` |
| Generic API Key | `(?i)(api[_-]?key\|apikey)\s*[:=]\s*['"][A-Za-z0-9]{20,}` |
| Generic Secret | `(?i)(secret\|password\|passwd\|token)\s*[:=]\s*['"][^'"]{8,}` |
| Private Key | `-----BEGIN (RSA\|EC\|DSA\|OPENSSH) PRIVATE KEY-----` |
| JWT | `eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}` |
| Connection String | `(?i)(mongodb\|postgres\|mysql\|redis)://[^\s'"]+` |

### Detection Tools

```bash
# Language-agnostic secret scanning
gitleaks detect --source . --verbose

# GitHub native secret scanning (if enabled)
gh secret-scanning list

# Pre-commit hook to prevent future leaks
# Add gitleaks to pre-commit configuration
```

## Dependency Audit Commands

### TypeScript / JavaScript

```bash
npm audit
npx audit-ci --critical
npx better-npm-audit audit
```

### Go

```bash
govulncheck ./...
go list -m -json all | nancy sleuth
```

### Python

```bash
pip-audit
safety check
bandit -r src/
```

### Rust

```bash
cargo audit
cargo deny check advisories
```

## Race Condition Analysis

Pay special attention to race conditions in code that handles:

- **Financial transactions** -- double-spend, balance manipulation
- **Inventory management** -- overselling, negative stock
- **User registration** -- duplicate accounts from concurrent requests
- **Session management** -- session fixation, concurrent session modification
- **File operations** -- TOCTOU (time-of-check-to-time-of-use) bugs

### What to Look For

- Read-then-write without locking or atomic operations
- Check-then-act patterns without synchronization
- Shared mutable state across concurrent requests
- Database operations without appropriate isolation levels

### Mitigation Strategies

- Use database transactions with appropriate isolation levels
- Implement optimistic locking with version columns
- Use atomic operations (compare-and-swap, database constraints)
- Apply idempotency keys for financial operations

## Report Format

Document every finding using this structure:

```markdown
# Security Review Report

## Summary
- **Date**: YYYY-MM-DD
- **Scope**: [files/modules reviewed]
- **Findings**: X critical, Y high, Z medium, W low

## Findings

### SEC-001: [Title]
- **Severity**: CRITICAL / HIGH / MEDIUM / LOW
- **Category**: OWASP A01-A10 reference
- **Location**: `path/to/file.ts:42`
- **Impact**: What could happen if exploited
- **Description**: What the vulnerability is and how it works
- **Remediation**: Specific steps to fix the issue
- **Verification**: How to confirm the fix works

### SEC-002: [Title]
...
```

## Escalation Protocol

| Severity | Action Required | Timeline |
|----------|----------------|----------|
| **CRITICAL** | Stop all development. Fix immediately. Rotate any exposed secrets. Notify security team. | Fix within hours |
| **HIGH** | Must be fixed before the code can be merged. Block the PR. | Fix before merge |
| **MEDIUM** | Should be fixed soon. Create a tracked issue with a deadline. | Fix within 1-2 sprints |
| **LOW** | Suggestions for improvement. Document and address when convenient. | Address when possible |

## Response Protocol for Found Vulnerabilities

When a vulnerability is discovered:

1. **Stop** -- pause current work immediately for CRITICAL/HIGH findings
2. **Assess** -- determine severity, blast radius, and whether it is actively exploitable
3. **Contain** -- if secrets are exposed, rotate them immediately
4. **Fix** -- implement the remediation; write tests to verify the fix
5. **Search** -- scan the rest of the codebase for similar patterns
6. **Document** -- record the finding in the security review report
7. **Prevent** -- add linter rules, pre-commit hooks, or CI checks to prevent recurrence
