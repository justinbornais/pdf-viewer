---
name: 'Context Management'
description: 'Efficient context usage, selective file reading, and workspace search'
applyTo: '**'
---

# Context Management

Context is finite. Use it wisely.

## File Reading

- Prefer targeted reads over loading entire large files.
- Search first to find the relevant sections, then read only what you need.
- When working with files over 500 lines, identify the specific line ranges of interest before reading.
- Avoid dumping full file contents when a focused excerpt will suffice.

## Search Strategy

- Use codebase search to find relevant code before reading files.
- Use workspace indexing for broad questions about project structure.
- Be specific in search queries. Narrow terms produce better results than vague ones.
- Start with a broad search to build a map of the codebase, then narrow down to specific files and functions.

## CI Polling

Use exponential backoff when waiting for CI results:

| Attempt | Wait |
|---------|------|
| 1 | 1 minute |
| 2 | 2 minutes |
| 3 | 4 minutes |
| 4 | 8 minutes |

Never poll more frequently than the schedule above.

## General Discipline

- Have a clear reason for every file you read. Do not speculatively open files "just in case."
- Summarize findings in your response instead of re-reading the same files repeatedly.
- When exploring unfamiliar code, start with a broad search to understand the structure, then drill into specifics.
- Parallelize independent lookups when possible to reduce round trips.
- Prefer structured output formats over raw text dumps when presenting information.
