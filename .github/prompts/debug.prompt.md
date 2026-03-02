---
name: 'debug'
description: 'Systematic 4-phase debugging — root cause investigation before fixes'
agent: 'agent'
argument-hint: 'Describe the bug or unexpected behavior'
---

Diagnose and fix bugs using 4-phase root cause debugging. Reference the systematic-debugging and tdd skills.

**Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

## Phase 1 — Root Cause Investigation

1. Read error messages carefully
2. Reproduce consistently — exact steps, reliable trigger
3. Check recent changes — `git diff`, recent commits
4. Gather evidence — add diagnostics if needed
5. Trace data flow — where does the bad value originate?

## Phase 2 — Pattern Analysis

1. Find working examples in the codebase
2. Compare against references — read completely
3. Identify every difference

## Phase 3 — Hypothesis

1. Form a single, specific hypothesis
2. Make the SMALLEST possible change to test it
3. One variable at a time

## Phase 4 — Implementation

1. Write a failing test reproducing the bug (TDD RED)
2. Implement the fix
3. Verify test passes (TDD GREEN)
4. If 3+ fixes failed: STOP and discuss architecture with user

**File context**: ${file}

**Bug description**: ${input:symptom:Describe the bug or unexpected behavior}
