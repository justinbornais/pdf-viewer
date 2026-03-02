<!-- managed-by: copilot-agent-kit -->
---
name: 'scaffolding'
description: 'Use when creating new projects from scratch, generating project structure, selecting tech stacks, or setting up initial configuration files'
---

# Scaffolding

Project templates, stack selection, and initial setup for new projects.

## Project Type Templates

### API Project

```
project-root/
  src/
    routes/           # Route handlers grouped by domain
      users.ts
      health.ts
    middleware/        # Request/response middleware
      auth.ts
      error-handler.ts
      validate.ts
    models/           # Data models and schemas
      user.ts
    services/         # Business logic
      user-service.ts
    config/           # Configuration loading
      index.ts
    index.ts          # Application entry point
  tests/
    routes/
      users.test.ts
    services/
      user-service.test.ts
  .env.example
  .gitignore
  package.json
  tsconfig.json
  README.md
```

### CLI Project

```
project-root/
  src/
    commands/         # One file per command
      init.ts
      run.ts
      help.ts
    utils/            # Shared utilities
      logger.ts
      config.ts
      file-system.ts
    index.ts          # Entry point and argument parsing
  tests/
    commands/
      init.test.ts
      run.test.ts
    utils/
      config.test.ts
  bin/                # Executable entry point
    cli.ts
  .gitignore
  package.json
  tsconfig.json
  README.md
```

### Full-Stack Project

```
project-root/
  src/
    client/           # Frontend application
      components/
      pages/
      hooks/
      styles/
      index.tsx
    server/           # Backend application
      routes/
      middleware/
      models/
      services/
      index.ts
    shared/           # Types and utilities shared between client and server
      types.ts
      constants.ts
      validators.ts
  tests/
    client/
      components/
    server/
      routes/
    shared/
  public/             # Static assets
  .env.example
  .gitignore
  package.json
  tsconfig.json
  README.md
```

### Library Project

```
project-root/
  src/
    lib/              # Library source code
      core.ts
      utils.ts
      types.ts
    index.ts          # Public API exports
  tests/
    core.test.ts
    utils.test.ts
  examples/           # Usage examples
    basic-usage.ts
    advanced-usage.ts
  .gitignore
  package.json
  tsconfig.json
  tsconfig.build.json # Build-specific config (excludes tests)
  README.md
  LICENSE
```

## Stack Selection Interview

Ask these questions to determine the right stack for the project.

### Step 1: Project Type

> What kind of project is this?

| Answer | Template |
|--------|----------|
| REST API or backend service | API |
| Command-line tool | CLI |
| Web app with frontend and backend | Full-Stack |
| Reusable package or SDK | Library |

### Step 2: Language

> What language should we use?

| Factor | TypeScript | Go | Python | Rust |
|--------|-----------|-----|--------|------|
| Web APIs | Strong | Strong | Strong | Moderate |
| CLI tools | Good | Strong | Good | Strong |
| Data processing | Moderate | Good | Strong | Strong |
| Systems programming | Weak | Good | Weak | Strong |
| Rapid prototyping | Strong | Moderate | Strong | Weak |
| Performance-critical | Moderate | Strong | Weak | Strong |

### Step 3: Framework

> What framework fits the use case?

| Language | API | CLI | Full-Stack | Library |
|----------|-----|-----|------------|---------|
| TypeScript | Express, Fastify, Hono | Commander, oclif | Next.js, Remix | tsup, unbuild |
| Go | Chi, Echo, Fiber | Cobra | -- | Standard library |
| Python | FastAPI, Flask | Click, Typer | Django, FastAPI+React | setuptools, poetry |
| Rust | Axum, Actix | Clap | -- | cargo |

### Step 4: Database (if applicable)

> Does this project need a database?

| Need | Recommendation |
|------|---------------|
| Relational data with complex queries | PostgreSQL |
| Simple key-value or document storage | SQLite, Redis |
| Document-oriented with flexible schema | MongoDB |
| Time-series data | TimescaleDB, InfluxDB |
| No persistence needed | Skip database |

### Step 5: Additional Needs

> What else does the project need?

- Authentication? (JWT, OAuth, session-based)
- Background jobs? (BullMQ, Celery, Tokio tasks)
- File storage? (S3, local filesystem)
- Email? (SendGrid, Resend, SMTP)
- Real-time? (WebSockets, Server-Sent Events)

## Default Stack Tables

### TypeScript API

| Component | Default |
|-----------|---------|
| Runtime | Node.js 20+ |
| Framework | Fastify |
| Validation | Zod |
| Database | PostgreSQL + Drizzle |
| Testing | Vitest |
| Linting | ESLint + Prettier |
| Build | tsup |

### Go API

| Component | Default |
|-----------|---------|
| Runtime | Go 1.22+ |
| Framework | Chi |
| Validation | go-playground/validator |
| Database | PostgreSQL + sqlx |
| Testing | go test + testify |
| Linting | golangci-lint |

### Python API

| Component | Default |
|-----------|---------|
| Runtime | Python 3.12+ |
| Framework | FastAPI |
| Validation | Pydantic |
| Database | PostgreSQL + SQLAlchemy |
| Testing | pytest |
| Linting | Ruff |
| Type checking | mypy |

### Rust CLI

| Component | Default |
|-----------|---------|
| Runtime | Rust stable |
| CLI framework | Clap |
| Error handling | anyhow + thiserror |
| Testing | cargo test |
| Linting | clippy |

## Configuration File Checklist

Every new project must include these configuration files:

```markdown
- [ ] Package manifest (package.json, go.mod, Cargo.toml, pyproject.toml)
- [ ] Linter config (.eslintrc, .golangci.yml, ruff.toml, clippy.toml)
- [ ] Formatter config (.prettierrc, rustfmt.toml, pyproject.toml [tool.ruff.format])
- [ ] Test runner config (vitest.config.ts, pytest.ini, cargo test config)
- [ ] .gitignore (language-appropriate template)
- [ ] .env.example (all required environment variables with placeholders)
- [ ] CI workflow (.github/workflows/ci.yml)
- [ ] README.md (project name, description, setup instructions)
- [ ] TypeScript: tsconfig.json with strict: true
- [ ] Docker: Dockerfile + .dockerignore (if containerized)
```

## Scaffolding Checklist

After generating the project, verify everything works:

```markdown
- [ ] All directories created according to the template
- [ ] All configuration files generated and valid
- [ ] Starter files written with minimal working code
- [ ] Dependencies install without errors
- [ ] Linter runs and passes
- [ ] Tests run and pass (at least one starter test)
- [ ] Build succeeds (if applicable)
- [ ] Dev server starts (if applicable)
- [ ] .gitignore excludes appropriate files
- [ ] README contains accurate setup instructions
```

## Naming Conventions by Language

### TypeScript / JavaScript

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `user-service.ts` |
| Test files | kebab-case + .test | `user-service.test.ts` |
| Components (React) | PascalCase | `UserProfile.tsx` |
| Variables, functions | camelCase | `getUserById` |
| Types, interfaces | PascalCase | `UserProfile` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |

### Go

| Item | Convention | Example |
|------|-----------|---------|
| Files | snake_case | `user_service.go` |
| Test files | snake_case + _test | `user_service_test.go` |
| Exported | PascalCase | `GetUserByID` |
| Unexported | camelCase | `parseInput` |
| Packages | lowercase, single word | `users` |
| Constants | PascalCase or camelCase | `MaxRetries` |

### Python

| Item | Convention | Example |
|------|-----------|---------|
| Files | snake_case | `user_service.py` |
| Test files | test_ prefix | `test_user_service.py` |
| Functions, variables | snake_case | `get_user_by_id` |
| Classes | PascalCase | `UserProfile` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| Packages | snake_case | `user_service` |

### Rust

| Item | Convention | Example |
|------|-----------|---------|
| Files | snake_case | `user_service.rs` |
| Test files | inline mod tests | `#[cfg(test)] mod tests` |
| Functions, variables | snake_case | `get_user_by_id` |
| Types, traits | PascalCase | `UserProfile` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| Crates | kebab-case | `my-library` |
| Modules | snake_case | `user_service` |
