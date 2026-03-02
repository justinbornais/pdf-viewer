---
name: 'build-fix'
description: 'Diagnose and fix build errors incrementally'
agent: 'agent'
---

Diagnose and fix build errors. Reference the build-fix skill.

## Workflow

1. **Run the build command** for the project
2. **Parse error output** — group by type (import, type, syntax, dependency)
3. **Fix one error at a time**, starting with: missing modules, then syntax, then type errors
4. **Re-run build** after each fix
5. **Stop and report** if: same error persists after 3 attempts, fix introduces new errors, or error requires architectural changes

### Rules

- Fix one error at a time
- Verify after each change
- Don't refactor — only fix what's broken
- Install missing dependencies if needed
