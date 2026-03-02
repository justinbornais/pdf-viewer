# Copilot Instructions

See [AGENTS.md](../AGENTS.md) for full project context, conventions, and skill reference.

## Available Prompts

| Prompt | Description |
|--------|-------------|
| /plan | Create a structured implementation plan before writing any code |
| /tdd | Strict test-driven development: write failing test first, then minimal code |
| /brainstorm | Explore design options and trade-offs before committing to an approach |
| /review | Two-stage code review covering spec compliance and code quality |
| /debug | Systematic four-phase root cause debugging |
| /deploy | Run deployment checklists with pre and post verification |
| /scaffold | Generate project scaffolding from templates (API, CLI, full-stack, library) |
| /refactor | Detect dead code, classify safety, and produce cleanup reports |
| /build-fix | Diagnose build errors and resolve them incrementally |
| /security-review | OWASP Top 10 audit, vulnerability scanning, and escalation protocol |
| /execute-plan | Execute an approved plan step-by-step with review checkpoints |
| /finish-branch | Complete branch work: merge, open PR, keep, or discard |

## Available Agents

| Agent | Role |
|-------|------|
| researcher | Read-only exploration of the codebase and external sources |
| reviewer | Code review with security analysis and quality scoring |
| implementer | TDD-driven coding: writes tests first, then production code |
| architect | Design-first analysis and ADRs; produces plans, not code |

## Chat Modes

| Mode | Behavior |
|------|----------|
| architect | Design discussion only; no code generation |
| tdd-coach | Strict TDD enforcement: refuses to write code without a failing test |
| reviewer | Focuses on security issues and code quality concerns |

## Quality Gates

- Always run tests after code changes
- Always run the linter before commits
- Fix all warnings before moving on
- Verify the build succeeds before considering work complete

## Workflow Guidance

- Use **agent mode** for multi-file changes that require coordination
- Use **prompts** for structured workflows with defined steps
- Use **chat modes** to switch working style without changing context
- Start with **/plan** or **/brainstorm** for new features
- Use **/review** before merging any branch
