---
name: 'finish-branch'
description: 'Complete branch work — verify tests, merge/PR/keep/discard'
agent: 'agent'
---

Complete development work on the current branch.

## Process

1. **Verify tests** — run test suite, stop if failures
2. **Determine base branch** (usually `main` or `master`)
3. **Present exactly 4 options**:
   - **a. Merge locally** — merge to base, run tests on result, delete feature branch
   - **b. Push and create PR** — push remote, create PR with summary
   - **c. Keep as-is** — leave branch intact for later
   - **d. Discard** — delete branch and work (requires typed confirmation)
4. **Execute the chosen option**

### Rules

- Always verify tests pass before offering options
- Present exactly 4 options
- Discard requires explicit confirmation
- Never force-push without explicit request
