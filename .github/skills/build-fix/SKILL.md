<!-- managed-by: copilot-agent-kit -->
---
name: 'build-fix'
description: 'Use when diagnosing and fixing build errors — incremental resolution one error at a time'
---

# Build Fix

## Overview

Diagnose and fix build errors incrementally. Run the build, parse the errors, fix one at a time, and re-run after each fix. Never batch fixes without verifying each one.

## Priority Order

Fix errors in this order, as earlier categories often cause cascading failures in later ones:

| Priority | Category | Examples |
|----------|----------|----------|
| 1 | Missing modules/imports | `Cannot find module`, `ModuleNotFoundError`, `unresolved import` |
| 2 | Syntax errors | Unexpected token, unclosed brackets, invalid expression |
| 3 | Type errors | Type mismatch, missing properties, incompatible signatures |
| 4 | Configuration issues | Missing tsconfig paths, invalid compiler options, wrong targets |

## Process

### Step 1: Run the Build

Execute the build command and capture the full output.

### Step 2: Parse Errors

Read the error output carefully. Identify:

- The file and line number
- The error code or type
- The specific message

### Step 3: Group by Type

If there are many errors, group them by category (imports, syntax, types, config). Fix the highest-priority category first, as those fixes often resolve errors in lower categories.

### Step 4: Fix One at a Time

Make a single fix. Do not batch multiple fixes before verifying.

### Step 5: Re-Run the Build

After each fix, re-run the build to confirm:

- The fixed error is resolved
- No new errors were introduced
- The remaining error count decreased (or at least did not increase)

### Step 6: Repeat

Continue until the build succeeds or a stop condition is reached.

## Multi-Language Build Commands

| Language | Check Command | Full Build Command |
|----------|--------------|-------------------|
| TypeScript | `npx tsc --noEmit` | `npm run build` |
| Go | `go build ./...` | `go build -o /dev/null ./...` |
| Python | `mypy .` | `python -m py_compile` (per file) |
| Rust | `cargo check` | `cargo build` |

Use the check command for fast iteration. Use the full build command for final verification.

## Error Diagnosis Patterns

### Missing Module or Import

```
Cannot find module 'foo'
```

**Diagnosis**:
1. Is the package installed? Check `package.json`, `go.mod`, `Cargo.toml`, or `requirements.txt`
2. Is the import path correct? Check for typos, wrong relative paths, missing file extensions
3. Is the module exported? Check that the source file exports the symbol being imported

**Fix**: Install the missing dependency, correct the import path, or add the missing export.

### Type Mismatch

```
Type 'string' is not assignable to type 'number'
```

**Diagnosis**:
1. Check the function signature -- what types does it expect?
2. Check the caller -- what types is it passing?
3. Was an interface or type definition recently changed?

**Fix**: Update the caller to pass the correct type, update the function signature, or add a type conversion.

### Syntax Error

```
Unexpected token '}'
```

**Diagnosis**:
1. Check for unclosed brackets, parentheses, or quotes above the reported line
2. Check for missing commas, semicolons, or operators
3. The actual error is often on a line before the reported line

**Fix**: Add the missing syntax element. Read the surrounding context, not just the error line.

### Configuration Issue

```
Unknown compiler option 'moduleResolution'
```

**Diagnosis**:
1. Check that the config file syntax is valid
2. Check that the option name is correct for the tool version
3. Check that the tool version supports the option

**Fix**: Correct the option name, update the tool, or remove the unsupported option.

## Stop Conditions

Stop the fix-one-at-a-time cycle and reassess when:

| Condition | Action |
|-----------|--------|
| Same error persists after 3 fix attempts | The root cause is elsewhere; investigate more broadly |
| A fix introduces more errors than it resolves | Revert the fix; the approach is wrong |
| Error requires architectural change | Stop fixing symptoms; plan the architectural change |
| Error is in generated or vendored code | Do not fix manually; regenerate or update the dependency |

## Rules

- **Fix one error at a time** -- batch fixes hide causation
- **Re-run after each fix** -- verify the fix worked before moving on
- **Do not refactor during build fixes** -- fix the build first, refactor later
- **Install missing dependencies** -- if a module is genuinely missing, install it rather than working around it
- **Read the full error message** -- the first line is the symptom; the rest is the diagnosis
- **Check the line above** -- syntax errors are often reported on the line after the actual problem
