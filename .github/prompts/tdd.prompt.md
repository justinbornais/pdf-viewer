---
name: 'tdd'
description: 'Implement a feature using strict RED-GREEN-REFACTOR methodology'
agent: 'implementer'
argument-hint: 'What feature should be implemented?'
---

Implement the requested feature using strict TDD. Reference the tdd and verification skills.

**The Iron Law: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST**

## Setup

1. Identify language and test framework from the project
2. Run existing test suite — fix pre-existing failures first
3. Break the feature into behaviors to implement

## For Each Behavior — RED-GREEN-REFACTOR

**RED**: Write one failing test. Run it. It MUST fail. Never skip verification.

**GREEN**: Write minimal code to pass. Run full suite. ALL must pass.

**REFACTOR**: Improve code quality. Run tests after every change. Keep green.

**Current file context**: ${file}

**Feature to implement**: ${input:feature:What feature should be implemented?}

## Before Claiming Complete

- Full test suite passes
- Coverage meets targets (100% critical, 80%+ general)
- Edge cases covered
- Code follows project conventions
