<!-- managed-by: copilot-agent-kit -->
---
name: 'verification'
description: 'Use before claiming any task is complete — enforces evidence-based completion verification'
---

# Verification

## Gate Function

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.**

Before claiming anything is "done," "working," or "fixed," run the actual verification command and show the output. Assertions without evidence are not verification.

## The Rule

Before saying any of these:

- "This is done"
- "The fix is working"
- "Tests are passing"
- "The build succeeds"
- "The bug is fixed"

You must:

1. Run the relevant command
2. Show the actual output
3. Confirm the output proves the claim

If you cannot show the output, you cannot make the claim.

## Verification Types

| Claim | Required Evidence |
|-------|-------------------|
| "Tests pass" | Run the test command, show output with pass/fail counts |
| "Build succeeds" | Run the build command, show output with no errors |
| "Lint is clean" | Run the lint command, show output with no warnings/errors |
| "Bug is fixed" | Run the failing test case, show it now passes |
| "Feature works" | Run the feature's test suite, show all tests pass |
| "No regressions" | Run the full test suite, show all tests pass |

## Anti-Patterns

| Anti-Pattern | Correction |
|-------------|------------|
| "I believe this works" | Run it and show the output |
| "This should fix it" | Verify it fixes it and show the evidence |
| "Tests should pass" | Run them and show that they pass |
| "The implementation looks correct" | Correctness is proven by tests, not by reading |
| "I made the change, so it's done" | Making a change and verifying a change are different steps |

## Verification Process

### Step 1: Identify What Needs Verification

For every claim you are about to make, identify the specific command that would prove it.

- Feature complete? Which tests cover it?
- Bug fixed? Which test reproduces it?
- Build clean? What is the build command?
- No regressions? What is the full test suite command?

### Step 2: Run the Command

Execute the verification command. Do not skip this step. Do not assume the result.

### Step 3: Show the Output

Include the actual command output. This is the evidence. Without it, there is no verification.

### Step 4: Interpret the Result

Only after seeing the output, state whether the claim is supported:

- **All tests pass**: Claim is supported
- **Some tests fail**: Claim is NOT supported -- investigate the failures
- **Build has errors**: Claim is NOT supported -- fix the errors
- **Lint has warnings**: Claim is NOT supported -- resolve the warnings

## Fresh Evidence

Evidence must be fresh. Do not rely on:

- Output from a previous run before you made changes
- Cached test results
- Memory of what the output was last time
- Assumptions based on the code you wrote

Re-run the command after every change. The only valid evidence is the most recent output.

## Completion Checklist

Before declaring any task complete:

- [ ] Test suite runs and passes (show output)
- [ ] Build succeeds (show output)
- [ ] Lint is clean (show output)
- [ ] All acceptance criteria are verified (show evidence for each)
- [ ] No skipped or pending tests related to this change
- [ ] Edge cases are tested and passing
