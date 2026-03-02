---
name: 'scaffold'
description: 'Generate project structure, config files, and starter code'
agent: 'agent'
argument-hint: 'Project type (API/CLI/full-stack/library)'
---

Generate a project scaffold. Reference the scaffolding skill.

## Workflow

1. **Interview**: project type, language, framework, database, additional needs
2. **Summarize choices** and confirm before proceeding
3. **Create directory structure**
4. **Generate config files**: package manifest, linter, formatter, test runner, `.gitignore`, `.env.example`, CI workflow
5. **Create starter files**: entry point, one passing test, `README.md`
6. **Suggest next steps**: `/requirements`, `/plan`, run tests

**Project type**: ${input:project-type:Project type (API/CLI/full-stack/library)}

### Rules

- Always ask before creating files
- Start minimal — user adds more later
- Warn before overwriting existing files
