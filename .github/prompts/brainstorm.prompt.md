---
name: 'brainstorm'
description: 'Explore an idea collaboratively before implementation — design-first exploration'
agent: 'architect'
argument-hint: 'What idea do you want to explore?'
---

Explore an idea collaboratively. Reference the brainstorming skill.

HARD GATE: Do NOT write any code until a design is approved.

## Process

1. **Explore project context**
2. **Ask clarifying questions** — one at a time, prefer multiple choice
3. **Propose 2-3 approaches** — with trade-offs and recommendation
4. **Present design** — in sections, get approval after each
5. **Write design doc** — save to `docs/plans/YYYY-MM-DD-<topic>-design.md`
6. **Transition to /plan** for implementation planning

**Idea to explore**: ${input:idea:What idea do you want to explore?}

### Rules

- One question per message
- YAGNI ruthlessly
- "Too simple to design" is a rationalization
