<!-- managed-by: copilot-agent-kit -->
---
name: 'systematic-debugging'
description: 'Use when diagnosing bugs — enforces root cause investigation before any fix attempts'
---

# Systematic Debugging

## Iron Law

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

Do not guess. Do not "just try this." Do not change code hoping the problem goes away. Understand the root cause, then fix it.

## Phase 1: Root Cause Investigation

### Read Errors Carefully

- Read the full error message, not just the first line
- Check the stack trace for the originating call, not just where it surfaced
- Note the exact error type, message, and any error codes

### Reproduce Consistently

- Write down the exact steps to reproduce the bug
- Confirm you can reproduce it before investigating further
- If it is intermittent, identify the conditions under which it occurs

### Check Recent Changes

- Review recent commits that touched the affected area
- Check if dependencies were updated
- Look for configuration changes

### Gather Evidence

- Check logs for related errors or warnings
- Inspect the state of relevant data (database records, API responses, file contents)
- Add temporary logging if needed to trace the flow

### Trace Data Flow

- Follow the data from input to the point of failure
- Identify where the actual value diverges from the expected value
- Check each transformation step along the way

## Phase 2: Pattern Analysis

### Find Working Examples

- Identify similar functionality in the codebase that works correctly
- Check documentation for correct usage of the API or library involved
- Look for examples in the dependency's test suite or documentation

### Compare Against References

- Diff the working example against the broken code
- Check function signatures, parameter order, and types
- Verify configuration values match what the documentation specifies

### Identify Differences

- List every difference between the working reference and the broken code
- For each difference, determine if it could explain the observed behavior
- Prioritize differences closest to the point of failure

## Phase 3: Hypothesis Testing

### Form a Single Hypothesis

- State the hypothesis clearly: "The error occurs because X receives Y instead of Z"
- The hypothesis must be specific and testable
- It must explain all observed symptoms, not just some

### Make the Smallest Possible Change

- Change one thing at a time
- The change should directly test the hypothesis
- If the change does not fix the issue, revert it before trying something else

### One Variable at a Time

- Never make multiple changes to test a hypothesis
- If you change two things and the bug goes away, you do not know which change fixed it
- This discipline prevents "fix it but don't understand it" outcomes

## Phase 4: Implementation

### Write a Failing Test (TDD RED)

Before implementing the fix, write a test that reproduces the bug:

```
1. Write a test that exercises the buggy code path
2. Run the test -- it must FAIL, confirming the bug is reproduced
3. This test becomes the regression test
```

### Implement the Fix

```
1. Make the minimal change to fix the root cause
2. Do not refactor, do not "improve" adjacent code
3. The fix should address the root cause, not the symptom
```

### Verify the Fix (TDD GREEN)

```
1. Run the failing test -- it must now PASS
2. Run the full test suite -- no regressions
3. Manually verify the original reproduction steps no longer trigger the bug
```

### Escalation Rule

If 3 or more fix attempts have failed:

1. **STOP**
2. Review all evidence collected so far
3. Question your assumptions about the root cause
4. Consider whether the issue is architectural, not local
5. Seek a second opinion or fresh perspective

## Anti-Patterns

| Anti-Pattern | Problem | Correction |
|-------------|---------|------------|
| "Just try this" | Random changes waste time and obscure the root cause | Return to Phase 1; form a hypothesis first |
| Fixing symptoms | The bug returns in a different form | Trace to the root cause before changing code |
| Multiple changes at once | Cannot determine what actually fixed the issue | One change at a time, revert if ineffective |
| Fixing without a test | No proof the fix works, no regression protection | Write the failing test BEFORE implementing the fix |
| "It works on my machine" | Environment differences are the root cause | Investigate environment differences as Phase 1 evidence |
| Debugging by print statement | Logs disappear, no systematic approach | Add structured logging, trace data flow methodically |

## Every Bug Fix Includes

- [ ] Root cause identified and documented
- [ ] Regression test written (fails before fix, passes after)
- [ ] Fix addresses root cause, not just symptoms
- [ ] Full test suite passes with no regressions
- [ ] Commit message explains the root cause and fix
