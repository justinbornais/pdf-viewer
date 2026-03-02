<!-- managed-by: copilot-agent-kit -->
---
name: 'planning'
description: 'Use before implementing multi-file changes or architectural decisions — enforces design-first development'
---

# Planning Protocol

## Core Principle

**No code until design is approved. No exceptions.**

Every implementation begins with a plan. The plan defines what will be built, how it will be built, and in what order. Code without a plan is improvisation, not engineering.

## Anti-Pattern

> "This is too simple to need a design."

Even simple tasks get a brief design. A two-minute plan prevents a two-hour debugging session. Scale the plan to the complexity, but always have one.

## Phase 1: Brainstorming

Before writing the plan, understand the problem space.

### Steps

1. **Explore context**: Search the codebase for related code, existing patterns, and prior decisions. Read relevant files to understand the current state.

2. **Ask questions**: Clarify requirements before proposing solutions.
   - Ask one question at a time
   - Prefer multiple-choice questions over open-ended ones
   - Example: "Should the API return paginated results? (a) Yes, with cursor-based pagination (b) Yes, with offset/limit (c) No, return all results"

3. **Propose 2-3 approaches**: For each, describe the approach, list pros and cons, and estimate scope. Lead with your recommendation and explain why.

4. **Present the design**: Once an approach is selected, present the full design covering architecture, components, data flow, error handling, and testing strategy.

5. **Write the design document**: Capture the approved design in a structured format so the plan can reference it.

## Phase 2: Writing the Plan

Convert the approved design into a sequence of bite-sized tasks.

### Plan Document Header

```markdown
# Plan: [Feature Name]

## Goal
One sentence describing the objective.

## Architecture
High-level approach and key design decisions.

## Tech Stack
Languages, frameworks, libraries, and tools involved.

## Files Affected
- path/to/file.ts -- what changes and why
- path/to/new-file.ts -- new file, purpose

## Risks / Open Questions
Anything uncertain or potentially problematic.
```

### Task Structure

Each task should take 2-5 minutes to complete. Every task includes TDD steps.

```markdown
### Task N: [Description]

**File**: `src/services/shipping.ts`

**Steps**:
1. Write failing test in `src/services/__tests__/shipping.test.ts`:
   ```typescript
   it("returns free shipping for orders over $100", () => {
     const cost = calculateShippingCost({ subtotal: 150 });
     expect(cost).toBe(0);
   });
   ```
2. Run tests to verify the test fails
3. Implement `calculateShippingCost` in `src/services/shipping.ts`:
   ```typescript
   export const calculateShippingCost = (order: { subtotal: number }): number => {
     return order.subtotal > 100 ? 0 : 5.99;
   };
   ```
4. Run tests to verify the test passes
5. Commit: `feat(shipping): add free shipping threshold`
```

### Plan Quality Rules

| Rule | Rationale |
|------|-----------|
| Exact file paths | No ambiguity about where changes go |
| Complete code in tasks | Copy-paste ready, no guessing |
| Exact commands to run | `npm test -- --grep "shipping"` not "run the tests" |
| DRY across tasks | Extract shared setup into earlier tasks |
| YAGNI ruthlessly | If the plan includes "we might need this later," remove it |
| TDD in every task | Every task starts with a failing test |
| Tasks are independently verifiable | Each task leaves the codebase in a working state |

## When Plans Change

Plans are living documents. When implementation reveals the plan is wrong:

1. **Stop implementing** -- do not push through a broken plan
2. **Identify what changed** -- new constraint, wrong assumption, better approach
3. **Revise the plan** -- update remaining tasks to reflect the new understanding
4. **Communicate the change** -- explain what changed and why before continuing
5. **Resume implementation** -- from the revised plan

Never silently deviate from an approved plan.

## Estimation Guide

| Scope | Action |
|-------|--------|
| Small (1-3 files) | Brief plan, then implement |
| Medium (4-10 files) | Detailed plan with task breakdown, then implement |
| Large (10+ files) | Detailed plan, phased implementation with review checkpoints |
