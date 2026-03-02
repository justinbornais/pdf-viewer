---
name: 'Architecture Standards'
description: 'ADRs, design principles, patterns, and trade-off analysis'
applyTo: '**'
---

# Architecture Standards

## Architecture Decision Records (ADRs)

Record significant architectural decisions using this format:

```markdown
# ADR-NNN: Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Context
What situation or problem prompted this decision.

## Options Considered
1. **Option A** -- Pros: ... Cons: ...
2. **Option B** -- Pros: ... Cons: ...
3. **Option C** -- Pros: ... Cons: ...

## Decision
Which option was chosen.

## Rationale
Why this option was selected over the alternatives.

## Consequences
What changes as a result. What trade-offs are accepted.
```

Store ADRs in `docs/adr/` with filenames like `001-use-postgres.md`.

## Trade-off Analysis

Before making architectural choices:

1. List at least two viable options.
2. Identify pros and cons for each.
3. Consider: complexity, performance, maintainability, and team familiarity.
4. Document the decision and rationale.
5. Revisit if assumptions change.

## Design Principles

- **Composition over inheritance**: Build behavior by combining small, focused components.
- **Design for testability**: If it is hard to test, the design needs work.
- **Depend on abstractions**: Use interfaces and protocols at boundaries, not concrete types.
- **Single responsibility**: Each module, class, and function does one thing well.
- **Fail fast**: Validate early and surface errors close to their source.

## Common Patterns

| Pattern | Use When |
|---------|----------|
| Repository | Abstracting data access behind a clean interface |
| Factory | Object creation logic is complex or varies by context |
| Strategy | Algorithm or behavior needs to be swappable at runtime |
| Observer | Components need to react to events without tight coupling |
| Adapter | Integrating with external systems or legacy code |

## Anti-Patterns to Avoid

- **God objects**: Classes or modules that do everything. Split them by responsibility.
- **Premature abstraction**: Do not generalize until you have at least two concrete cases.
- **Circular dependencies**: Restructure modules to break cycles.
- **Deep inheritance hierarchies**: Flatten with composition instead.
- **Shared mutable state**: Isolate state and use immutable data where possible.
