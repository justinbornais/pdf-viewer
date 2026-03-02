---
name: 'Security Standards'
description: 'Secrets management, input validation, auth, and API protection'
applyTo: '**'
---

# Security Standards

## Secrets Management

- NEVER hardcode API keys, passwords, tokens, or connection strings.
- Use environment variables or a secret management service.
- Verify secrets exist before use. Fail fast with a clear error if they are missing.
- Never log or expose secrets in error messages, stack traces, or client responses.

## Input Validation

- Validate ALL user input at system boundaries.
- Use schema validation libraries (`zod` for TypeScript, `pydantic` for Python).
- Reject invalid input early with descriptive error messages.
- Sanitize data before rendering to prevent XSS.

## Database Security

- Use parameterized queries ONLY. Never use string concatenation for SQL.
- Apply the principle of least privilege to database credentials.
- Escape or validate any dynamic identifiers such as table or column names.

## Authentication and Authorization

- Require authentication on every protected endpoint.
- Verify authorization for each resource access, not just at the route level.
- Use established libraries for authentication. Never roll your own crypto.
- Implement CSRF protection on all state-changing endpoints.

## API Protection

- Apply rate limiting on all public endpoints.
- Set security headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
- Return generic error messages to clients. Log detailed error information server-side only.
- Disable verbose error output in production environments.

## Security Issue Response Protocol

If a security issue is discovered:

1. **Stop** current work immediately.
2. **Assess** severity: critical, high, medium, or low.
3. **Fix** critical and high issues before any other work continues.
4. **Rotate** any potentially exposed secrets.
5. **Search** the codebase for similar patterns that may have the same vulnerability.
6. **Document** the vulnerability and its remediation.

## Language-Specific Rules

- **TypeScript/JavaScript**: No `eval()` or `new Function()` with user input. Use DOMPurify for HTML sanitization.
- **Python**: No `pickle` with untrusted data. Use the `secrets` module for token generation. Avoid `shell=True` in subprocess calls.
- **Go**: Use `crypto/rand` for all random values, never `math/rand`. Use parameterized queries with `database/sql`.
- **Rust**: Minimize `unsafe` blocks. Every `unsafe` block must have a `// SAFETY:` comment explaining why it is sound.
