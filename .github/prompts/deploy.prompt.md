---
name: 'deploy'
description: 'Deployment workflow with pre/post verification checklists'
agent: 'agent'
argument-hint: 'Target environment (staging/production)'
---

Guide deployment with quality gates. Reference the deploy and devops skills.

## Pre-Deployment Checklist (stop if any fail)

- [ ] Tests pass (full suite green)
- [ ] Linter clean (no errors)
- [ ] Type check passes
- [ ] No hardcoded secrets in source
- [ ] Build succeeds
- [ ] No known dependency vulnerabilities
- [ ] Git working tree clean

## Deployment Process

1. **Confirm environment** — display target, ask for explicit confirmation
2. **Run production build**
3. **Execute deployment command**
4. **Tag the release**: `git tag -a v<version>`

## Post-Deployment

1. **Health check** — hit endpoint or landing page
2. **Smoke test** — critical path checks
3. **Report** — success/failure, URL, version, warnings

**Target**: ${input:environment:Target environment (staging/production)}

### Rules

- Never deploy with failing tests or lint errors
- Always require explicit confirmation for production
- If post-deploy check fails, suggest rollback
