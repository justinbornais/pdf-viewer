<!-- managed-by: copilot-agent-kit -->
---
name: 'deploy'
description: 'Use when deploying applications, running pre/post-deployment checks, managing releases, or performing rollbacks'
---

# Deploy

Deployment checklists, verification procedures, and rollback protocols.

## Pre-Deployment Checklist

Complete every item before deploying. If any item fails, stop and fix it first.

```markdown
- [ ] All tests pass (unit, integration, E2E)
- [ ] Linter reports zero warnings
- [ ] Type check passes with no errors
- [ ] No hardcoded secrets in the codebase
- [ ] Build succeeds in production mode
- [ ] No known critical or high vulnerabilities in dependencies
- [ ] Git working directory is clean (no uncommitted changes)
- [ ] Branch is up to date with the target branch
- [ ] Database migrations are tested and reversible
- [ ] Environment variables are configured for the target environment
- [ ] Feature flags are set correctly for the release
- [ ] Changelog is updated
- [ ] Version number is bumped appropriately
```

## Deployment Targets

### Docker

```bash
# Build the image
docker build -t myapp:1.2.3 .

# Tag for registry
docker tag myapp:1.2.3 registry.example.com/myapp:1.2.3
docker tag myapp:1.2.3 registry.example.com/myapp:latest

# Push to registry
docker push registry.example.com/myapp:1.2.3
docker push registry.example.com/myapp:latest

# Deploy with Compose
docker compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Or use Helm
helm upgrade --install myapp ./charts/myapp \
  --namespace production \
  --values values.prod.yaml \
  --set image.tag=1.2.3

# Watch rollout status
kubectl rollout status deployment/myapp -n production
```

### Cloud CLIs

```bash
# Vercel
vercel --prod

# Fly.io
fly deploy --image registry.example.com/myapp:1.2.3

# AWS ECS
aws ecs update-service \
  --cluster production \
  --service myapp \
  --force-new-deployment

# AWS Lambda
aws lambda update-function-code \
  --function-name myapp \
  --image-uri registry.example.com/myapp:1.2.3
```

### Static Hosting

```bash
# Build static assets
npm run build

# Deploy to S3 + CloudFront
aws s3 sync dist/ s3://my-bucket/ --delete
aws cloudfront create-invalidation --distribution-id EXXXXX --paths "/*"

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to GitHub Pages
# Configure in .github/workflows/deploy.yml
```

## Post-Deployment Verification

Run these checks immediately after every deployment.

### Health Check

```bash
# HTTP health endpoint
curl -f https://app.example.com/health

# Expected response
# { "status": "ok", "version": "1.2.3" }

# Kubernetes readiness
kubectl get pods -n production -l app=myapp
```

### Smoke Tests

Verify critical user paths work in production:

```markdown
- [ ] Homepage loads within acceptable time
- [ ] Authentication flow works (login, logout)
- [ ] Primary user action completes successfully
- [ ] API returns expected responses for key endpoints
- [ ] Database connectivity is healthy
- [ ] External service integrations are functional
```

### Monitoring

```markdown
- [ ] Error rate is at or below pre-deployment baseline
- [ ] Response latency is within acceptable range
- [ ] CPU and memory usage are normal
- [ ] No new error patterns in logs
- [ ] Alerting is active and configured for the new version
```

## Rollback Procedures

### When to Rollback

- Error rate spikes above the acceptable threshold
- Critical functionality is broken
- Data corruption is detected
- Security vulnerability is discovered in the release

### Rollback Steps

1. **Identify the issue** -- confirm the problem is caused by the deployment, not an external factor

2. **Revert to last known good version**

```bash
# Docker
docker compose -f docker-compose.prod.yml up -d --force-recreate

# Kubernetes
kubectl rollout undo deployment/myapp -n production

# Helm
helm rollback myapp 1 -n production

# Cloud platforms
# Redeploy the previous version tag
```

3. **Verify the rollback** -- run the same post-deployment checks

4. **Post-mortem** -- document what went wrong

```markdown
## Rollback Post-Mortem

### Incident
- **Date**: YYYY-MM-DD
- **Duration**: how long the issue lasted
- **Impact**: what users experienced

### Root Cause
What caused the deployment to fail.

### Timeline
- HH:MM -- Deployment started
- HH:MM -- Issue detected
- HH:MM -- Rollback initiated
- HH:MM -- Service restored

### Action Items
- [ ] Fix the root cause
- [ ] Add tests to prevent recurrence
- [ ] Update deployment checklist if needed
```

## Version Tagging

Follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

MAJOR -- breaking changes (incompatible API changes)
MINOR -- new features (backward compatible)
PATCH -- bug fixes (backward compatible)
```

### Git Tags

```bash
# Create an annotated tag
git tag -a v1.2.3 -m "Release 1.2.3: brief description"

# Push the tag
git push origin v1.2.3

# List tags
git tag --list 'v*' --sort=-version:refname
```

### Pre-release Versions

```
1.2.3-alpha.1    -- early testing
1.2.3-beta.1     -- feature complete, testing
1.2.3-rc.1       -- release candidate
```

## Environment Management

### Staging vs Production

| Aspect | Staging | Production |
|--------|---------|------------|
| Purpose | Final testing before release | Live user traffic |
| Data | Anonymized copy or synthetic | Real user data |
| Access | Team only | Public |
| Deployment | Automatic on merge to main | Manual trigger or tag-based |
| Monitoring | Basic | Full observability |

### Environment Variables

```bash
# Document required variables in .env.example (never commit .env)
DATABASE_URL=postgres://user:pass@host:5432/dbname
API_KEY=your-api-key-here
LOG_LEVEL=info
NODE_ENV=production

# Verify all required variables are set before starting
# The application should fail fast if a required variable is missing
```

### Feature Flags

```markdown
Use feature flags to decouple deployment from release:

- Deploy code with the flag disabled
- Enable the flag for internal users first
- Gradually roll out to a percentage of users
- Monitor for issues at each stage
- Remove the flag after full rollout is stable
```

## Rules

- **Never deploy with failing tests** -- all tests must pass before deployment
- **Require confirmation for production** -- production deploys must be explicitly confirmed
- **Flag failed post-deploy checks** -- if any verification step fails, initiate rollback procedures
- **Tag every release** -- every production deployment must have a corresponding git tag
- **Keep rollback capability** -- always maintain the ability to revert to the previous version
- **Document every deployment** -- record what was deployed, when, and by whom
