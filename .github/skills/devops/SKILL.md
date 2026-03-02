<!-- managed-by: copilot-agent-kit -->
---
name: 'devops'
description: 'Use when creating GitHub Actions workflows, writing Dockerfiles, setting up Docker Compose, configuring Kubernetes manifests, or managing CI/CD pipelines'
---

# DevOps

GitHub Actions workflows, Docker, Docker Compose, Kubernetes, and CI/CD infrastructure.

## GitHub Actions Workflow Templates

### CI Workflow

Runs on every push and pull request to validate code quality.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build
```

**Adapt for other runtimes:**

```yaml
# Go
- name: Setup Go
  uses: actions/setup-go@v5
  with:
    go-version: '1.22'

- name: Lint
  uses: golangci/golangci-lint-action@v4

- name: Test
  run: go test -race -cover ./...

# Python
- name: Setup Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.12'

- name: Install
  run: pip install -e ".[dev]"

- name: Lint
  run: ruff check .

- name: Test
  run: pytest --cov

# Rust
- name: Setup Rust
  uses: dtolnay/rust-toolchain@stable

- name: Lint
  run: cargo clippy -- -D warnings

- name: Test
  run: cargo test
```

### CD Workflow

Deploys when a version tag is pushed.

```yaml
name: CD

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install and build
        run: |
          npm ci
          npm run build

      - name: Deploy
        run: npm run deploy
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### PR Checks

Lightweight checks that run on pull requests.

```yaml
name: PR Checks

on:
  pull_request:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npx tsc --noEmit
```

## Dockerfile Best Practices

### Multi-Stage Build

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Run as non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```

### Key Principles

| Principle | Why |
|-----------|-----|
| **Multi-stage builds** | Keep production images small by excluding build tools |
| **Minimal base images** | Use `alpine` or `distroless` to reduce attack surface |
| **Non-root user** | Never run as root in production; create a dedicated user |
| **.dockerignore** | Exclude node_modules, .git, tests, docs from the build context |
| **Layer caching** | Copy dependency files before source code to maximize cache hits |
| **HEALTHCHECK** | Enable container orchestrators to detect unhealthy instances |
| **Pin versions** | Use specific tags (node:20-alpine) not `latest` |

### .dockerignore

```
node_modules
.git
.github
.env
.env.*
*.md
tests
coverage
dist
.dockerignore
Dockerfile
```

## Docker Compose Patterns

### Service Definitions

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:pass@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: appdb
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U user -d appdb']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
  redisdata:

networks:
  default:
    name: app-network
```

### Environment Files

```yaml
# Reference an env file instead of inline variables
services:
  app:
    env_file:
      - .env.production
```

Always provide `.env.example` with placeholder values. Never commit `.env` files.

## Kubernetes Basics

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: registry.example.com/myapp:1.2.3
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: myapp-secrets
                  key: database-url
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
  namespace: production
spec:
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
  namespace: production
data:
  LOG_LEVEL: info
  CACHE_TTL: '300'
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
  namespace: production
type: Opaque
data:
  database-url: <base64-encoded-value>
  api-key: <base64-encoded-value>
```

Never commit Secret manifests with real values. Use sealed-secrets, external-secrets, or vault integration.

## Environment Variable Management

### .env.example

Document every required variable with a description and placeholder value:

```bash
# Server configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Database
DATABASE_URL=postgres://user:password@localhost:5432/myapp

# External services
API_KEY=your-api-key-here
SMTP_HOST=smtp.example.com
SMTP_PORT=587

# Feature flags
ENABLE_NEW_DASHBOARD=false
```

### Rules

- Never commit `.env` files -- add `.env` to `.gitignore`
- Always provide `.env.example` with placeholder values
- Validate that required variables are present at application startup
- Use different variable values per environment (dev, staging, production)
- Store production secrets in a secret manager, not in environment variables on disk

## Monitoring Essentials

### Health Endpoints

```typescript
// Expose a health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
  });
});

// Deeper readiness check (verify dependencies)
app.get('/ready', async (req, res) => {
  const dbHealthy = await checkDatabase();
  const cacheHealthy = await checkCache();

  if (dbHealthy && cacheHealthy) {
    res.json({ status: 'ready' });
  } else {
    res.status(503).json({
      status: 'not ready',
      db: dbHealthy,
      cache: cacheHealthy,
    });
  }
});
```

### Structured Logging

```typescript
// Use structured JSON logs for machine parsing
logger.info('request processed', {
  method: req.method,
  path: req.path,
  statusCode: res.statusCode,
  duration_ms: elapsed,
  requestId: req.id,
});
```

Key practices:
- Use JSON format for log entries
- Include correlation/request IDs for tracing
- Log at appropriate levels: debug, info, warn, error
- Never log sensitive data (tokens, passwords, PII)
- Include enough context to diagnose issues without reproducing them

### Alerting

Set up alerts for these conditions:

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Error rate spike | >1% of requests | Investigate immediately |
| High latency | p99 > 2x baseline | Check for bottlenecks |
| CPU usage | >80% sustained | Scale up or optimize |
| Memory usage | >85% sustained | Check for leaks, scale up |
| Disk usage | >90% | Clean up or expand storage |
| Health check failure | 3 consecutive | Restart or rollback |
