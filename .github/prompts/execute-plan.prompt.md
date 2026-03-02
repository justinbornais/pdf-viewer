---
name: 'execute-plan'
description: 'Execute a written implementation plan in batches with review checkpoints'
agent: 'agent'
argument-hint: 'Path to the plan file'
---

Execute a plan document in batches. Reference the tdd skill for implementation methodology.

## Process

1. **Load the plan file** and review critically — raise concerns before starting
2. **Execute in batches** (default: 3 tasks per batch)
3. **For each task**: follow steps exactly, run verifications
4. **After each batch**: report progress, show verification output, wait for feedback
5. **After all tasks**: run full test suite, present completion summary

**Plan file**: ${input:plan-file:Path to plan file (e.g., docs/plans/2026-01-01-feature.md)}

### Rules

- Review plan critically before starting
- Follow plan steps exactly — don't improvise
- Stop and ask when blocked
- Between batches: report and wait for feedback
