<!-- managed-by: copilot-agent-kit -->
---
name: 'brainstorming'
description: 'Use when exploring ideas, evaluating approaches, or designing solutions before implementation'
---

# Brainstorming

## Overview

Turn ideas into fully formed designs through collaborative dialogue. Brainstorming is the bridge between "I want X" and a concrete implementation plan. It ensures the right problem is solved the right way before any code is written.

## HARD GATE

**No implementation until the design is approved.**

Do not write code, create files, or modify the codebase during brainstorming. The output of brainstorming is a design document, not code.

## Anti-Pattern

> "This is too simple to need a design."

Simple-seeming tasks have hidden complexity. A five-minute brainstorm catches edge cases, identifies dependencies, and prevents wasted effort. Scale the depth of brainstorming to the complexity, but always brainstorm.

## Brainstorming Checklist

1. [ ] Explore context -- understand the current state of the project
2. [ ] Ask questions -- clarify requirements and constraints
3. [ ] Propose approaches -- present 2-3 options with trade-offs
4. [ ] Present the design -- detail the selected approach
5. [ ] Write the design document -- capture decisions for the planning phase
6. [ ] Transition to planning -- hand off to the planning skill for task breakdown

## Understanding the Idea

### Check Project State

Before discussing solutions, understand where things stand:

- Search the codebase for related functionality
- Read existing implementations that the new work will interact with
- Check for prior decisions (ADRs, design docs) that constrain the approach
- Identify dependencies and integration points

### Ask Questions

Clarify the idea through focused questions:

- **Ask one question at a time** -- avoid overwhelming with a list of ten questions
- **Prefer multiple choice** -- "Should we (a) add a new endpoint or (b) extend the existing one?" is easier to answer than "How should we expose this?"
- **Build on answers** -- each question should follow logically from the previous answer
- **Focus on constraints** -- "Must this be backward compatible?" matters more than "What color should the button be?"

## Exploring Approaches

Once the requirements are clear, propose 2-3 concrete approaches.

### Structure for Each Approach

```markdown
### Approach A: [Name]

**Description**: One paragraph explaining the approach.

**Pros**:
- Benefit 1
- Benefit 2

**Cons**:
- Drawback 1
- Drawback 2

**Estimated scope**: Small / Medium / Large
```

### Guidelines

- **Lead with your recommendation** and explain why it is preferred
- **Be honest about trade-offs** -- every approach has downsides
- **Include a "do nothing" option** when appropriate -- sometimes the best action is inaction
- **Consider existing patterns** -- consistency with the codebase has real value

## Presenting the Design

Once an approach is selected, present the full design. Scale the depth of each section to the complexity of the change.

### Design Sections

- **Architecture**: How components fit together, what communicates with what
- **Components**: What new modules, functions, or types are needed
- **Data flow**: How data moves through the system, what transformations occur
- **Error handling**: What can go wrong and how each failure mode is handled
- **Testing strategy**: What tests are needed, what coverage is expected

### Presentation Rules

- **Ask for feedback after each section** -- do not present the entire design in a monologue
- **Use diagrams when helpful** -- a simple diagram is worth a thousand words
- **Call out assumptions** -- make implicit assumptions explicit so they can be challenged
- **Identify risks** -- flag anything uncertain or potentially problematic

## Key Principles

| Principle | Application |
|-----------|-------------|
| One question at a time | Avoid question dumps; build understanding incrementally |
| YAGNI ruthlessly | If "we might need this later" appears, remove it |
| Explore alternatives | Never present just one option; comparison reveals trade-offs |
| Incremental validation | Get agreement on each section before moving to the next |
| Design, not code | The output is a document, not an implementation |
