---
name: 'refactor'
description: 'Dead code detection and cleanup with safety classification'
agent: 'agent'
argument-hint: 'File or directory to refactor'
---

Remove dead code and improve organization. Reference the refactoring skill.

## Workflow

1. **Run detection commands** for the project's languages
2. **Classify findings**:
   - **Safe to remove**: unused imports, variables, private functions, commented-out code
   - **Requires verification**: unused exports, API endpoints, config options
   - **Never remove without review**: public APIs, migrations, env vars, feature flags
3. **Remove incrementally** — one category at a time
4. **Run tests** after each removal
5. **Produce cleanup report**

**File context**: ${file}

### Rules

- Run tests after every change
- Never remove public API functions without explicit approval
- Commit frequently with descriptive messages
- Only remove dead code — don't restructure working code
