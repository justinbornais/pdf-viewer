---
name: 'plan'
description: 'Design-first planning workflow — brainstorm approaches, get approval, write implementation plan'
agent: 'agent'
argument-hint: 'What do you want to build?'
---

Design before building. Reference the planning and architecture skills for methodology.

HARD GATE: Do NOT write any code until a design has been presented and approved.

## Phase 1 — Brainstorm

1. **Explore project context** — check files, docs, recent commits
2. **Ask clarifying questions** — one at a time, prefer multiple choice
3. **Propose 2-3 approaches** — with trade-offs and recommendation
4. **Present design** — scaled to complexity, get approval after each section
5. **Write design doc** — save to `docs/plans/YYYY-MM-DD-<topic>-design.md`

## Phase 2 — Write Implementation Plan

1. **Write bite-sized tasks** — each step is one action (2-5 minutes), exact file paths, complete code
2. **Follow TDD within tasks** — write failing test, verify fails, implement, verify passes, commit
3. **Save plan** — to `docs/plans/YYYY-MM-DD-<feature>.md`

## Phase 3 — Execution

Present options: agent-driven execution, batch execution, or manual.

**The user's goal**: ${input:goal:What do you want to build?}

### Rules

- Never write production code during planning
- Every plan must include TDD steps
- "Too simple to plan" is a rationalization
