# ECNS GitHub Actions Workflows

CI/CD workflows for ECNS app deployment, testing, and security analysis.

## Workflows Overview

| Workflow | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| [ci.yml](ci.yml) | Push, PR | Lint, typecheck, test, build | ~10 min |
| [deploy-production.yml](deploy-production.yml) | Push to `etc` | Deploy to production (app.ecns.domains) | ~20 min |
| [deploy-preview.yml](deploy-preview.yml) | PR to `etc` or `main` | Deploy preview with Mordor testnet | ~15 min |
| [lighthouse-ci.yml](lighthouse-ci.yml) | Push, PR to `etc` | Performance audit (Core Web Vitals) | ~10 min |
| [dependency-review.yml](dependency-review.yml) | PR | Security review of dependencies | ~2 min |
| [codeql.yml](codeql.yml) | Push, PR, Weekly | Security code analysis | ~20 min |

---

## Workflow Details

### 1. CI (Continuous Integration)

**File:** [ci.yml](ci.yml)

**Triggers:**
- Push to `etc` or `main` branches
- Pull requests to `etc` or `main`

**Jobs:**
1. **Lint** - ESLint code quality checks
2. **Type Check** - TypeScript type validation
3. **Test** - Unit and integration tests with coverage
4. **Build** - Production build verification

**Environment Variables:**
```bash
NEXT_PUBLIC_CHAIN_NAME=etc
NEXT_PUBLIC_PROVIDER=https://etc.rivet.link
NEXT_PUBLIC_DOMAIN=ecns.domains
```

**Artifacts:**
- Test coverage report (uploaded to Codecov)

---

### 2. Deploy to Production

**File:** [deploy-production.yml](deploy-production.yml)

**Triggers:**
- Push to `etc` branch (production branch)

**Environment:**
- Name: `production`
- URL: https://app.ecns.domains

**Steps:**
1. Run full CI checks (lint, typecheck, test)
2. Build with production environment variables
3. Deploy to Vercel with `--prod` flag
4. Wait 30 seconds for deployment propagation
5. Health check: `https://app.ecns.domains` (expect 200)
6. OG image check: `https://app.ecns.domains/api/og` (expect 200)

**Required Secrets:**
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Project ID for ecns-app

**Concurrency:**
- Only one production deployment at a time
- Does NOT cancel in-progress deployments

---

### 3. Deploy Preview

**File:** [deploy-preview.yml](deploy-preview.yml)

**Triggers:**
- Pull requests to `etc` or `main` branches

**Environment:**
- Name: `preview`
- URL: Dynamic Vercel preview URL
- Chain: Mordor testnet (chain 63)

**Features:**
- Automatic preview deployment for each PR
- Comment on PR with preview URL and test links
- Uses Mordor testnet for testing
- Cancels previous preview when new commit pushed

**Environment Variables:**
```bash
NEXT_PUBLIC_CHAIN_NAME=mordor
NEXT_PUBLIC_PROVIDER=https://rpc.mordor.etccooperative.org
NEXT_PUBLIC_DOMAIN=vercel.app
```

**PR Comment Includes:**
- Preview URL
- Environment details (Mordor testnet)
- Test links (homepage, OG image generator)
- Check status (lint, typecheck, test, build)

---

### 4. Lighthouse CI

**File:** [lighthouse-ci.yml](lighthouse-ci.yml)

**Triggers:**
- Push to `etc` branch
- Pull requests to `etc` branch

**Audited URLs:**
- Homepage: `http://localhost:3000`
- OG Image API: `http://localhost:3000/api/og?domain=test.etc`

**Metrics:**
- Performance score
- Accessibility score
- Best Practices score
- SEO score
- Core Web Vitals (LCP, FID, CLS)

**Configuration:**
- Runs: 3 (median score used)
- Artifacts: Uploaded to temporary public storage
- Results: Available in workflow artifacts

**Performance Targets:**
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

### 5. Dependency Review

**File:** [dependency-review.yml](dependency-review.yml)

**Triggers:**
- Pull requests to `etc` or `main` branches

**Checks:**
- New dependencies introduced
- Dependency vulnerability severity
- License compliance (denies GPL-2.0, GPL-3.0)

**Actions:**
- Fails PR if high severity vulnerabilities found
- Comments summary in PR
- Provides remediation suggestions

---

### 6. CodeQL Security Analysis

**File:** [codeql.yml](codeql.yml)

**Triggers:**
- Push to `etc` or `main` branches
- Pull requests
- Weekly schedule (Monday 2 AM UTC)

**Languages:**
- JavaScript
- TypeScript

**Queries:**
- Security vulnerabilities
- Code quality issues
- Best practices violations

**Results:**
- Security tab in GitHub repository
- Alerts for critical findings
- Automatic PR comments for new issues

---

## Setup Instructions

### 1. Add GitHub Secrets

Navigate to repository Settings → Secrets and Variables → Actions:

#### Required Secrets

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | Vercel → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Organization ID | Run `vercel --debug` and copy `orgId` |
| `VERCEL_PROJECT_ID` | Project ID | Run `vercel --debug` and copy `projectId` |

**Get Vercel IDs:**

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Link project (run in app directory)
cd /media/dev/2tb/dev/ecns/app
vercel link

# Get IDs
vercel --debug
# Look for:
# > orgId: org_xxxxxxxxxxxxx
# > projectId: prj_xxxxxxxxxxxxx
```

**Create Vercel Token:**

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `GitHub Actions - ECNS App`
4. Scope: Full Account
5. Expiration: No expiration (or 1 year)
6. Copy token and add to GitHub secrets

#### Optional Secrets

| Secret | Description | Purpose |
|--------|-------------|---------|
| `CODECOV_TOKEN` | Codecov upload token | Test coverage reporting |
| `SENTRY_DSN` | Sentry error tracking | Production error monitoring |

### 2. Configure GitHub Environments

**Settings → Environments:**

#### Production Environment

- Name: `production`
- Protection rules:
  - ✓ Required reviewers: 1 (optional)
  - ✓ Wait timer: 0 minutes
  - ✓ Deployment branches: `etc` only
- Environment secrets: (optional, can use repository secrets)

#### Preview Environment

- Name: `preview`
- Protection rules:
  - ✗ No required reviewers
  - ✗ No wait timer
- Environment secrets: None needed

### 3. Enable CodeQL

**Settings → Code security and analysis:**

- Enable "CodeQL analysis"
- Select languages: JavaScript, TypeScript
- Configure default setup

### 4. Configure Branch Protection

**Settings → Branches → Add rule:**

**Branch:** `etc` (production branch)

**Protection rules:**
- ✓ Require status checks to pass before merging
  - ✓ Require branches to be up to date
  - Status checks:
    - `All Checks Passed` (from ci.yml)
    - `Analyze Code (javascript)` (from codeql.yml)
    - `Analyze Code (typescript)` (from codeql.yml)
    - `Deploy to Vercel Preview` (optional, for testing before merge)
- ✓ Require conversation resolution before merging
- ✗ Require signed commits (optional)
- ✓ Include administrators

---

## Usage Examples

### Deploying to Production

```bash
# Make changes
git checkout etc
git add .
git commit -m "feat: add new feature"

# Push to production branch (triggers deploy-production.yml)
git push origin etc

# GitHub Actions will:
# 1. Run CI checks (lint, typecheck, test, build)
# 2. Deploy to Vercel production
# 3. Run health checks
# 4. Comment deployment URL
```

### Creating Preview Deployment

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: implement new feature"

# Push and create PR
git push origin feature/new-feature
gh pr create --title "New Feature" --body "Description"

# GitHub Actions will:
# 1. Run CI checks
# 2. Deploy to Vercel preview (Mordor testnet)
# 3. Comment preview URL in PR
```

### Running Lighthouse Locally

```bash
# Install Lighthouse CI
pnpm add -D @lhci/cli

# Run Lighthouse
pnpm build
pnpm start &
npx lhci autorun --config=lighthouse.config.json
```

---

## Monitoring Workflows

### View Workflow Runs

**Repository → Actions tab:**

- See all workflow runs
- Filter by workflow, branch, status
- View logs and artifacts
- Re-run failed workflows

### Check Deployment Status

**Vercel Dashboard:**
- https://vercel.com/dashboard
- Select ecns-app project
- Deployments tab shows all deployments
- Check build logs, function logs, analytics

### Review Security Alerts

**Security tab:**
- CodeQL alerts
- Dependabot alerts
- Secret scanning alerts

---

## Troubleshooting

### Workflow Fails: "VERCEL_TOKEN not found"

**Cause:** GitHub secret not configured

**Fix:**
1. Create Vercel token: https://vercel.com/account/tokens
2. Add to GitHub secrets: Settings → Secrets → New repository secret
3. Name: `VERCEL_TOKEN`
4. Value: [paste token]

---

### Deployment Fails: "Build exceeded timeout"

**Cause:** Build taking >15 minutes

**Fix:**
1. Increase timeout in workflow: `timeout-minutes: 30`
2. Optimize build (check for slow dependencies)
3. Use Vercel's build cache

---

### Lighthouse Scores Below Target

**Cause:** Performance regression

**Fix:**
1. Review Lighthouse report in workflow artifacts
2. Optimize bundle size (use bundle analyzer)
3. Optimize images (use next/image)
4. Reduce JavaScript execution time
5. Implement code splitting

---

### CodeQL Alert: High Severity

**Cause:** Security vulnerability detected

**Fix:**
1. Review alert in Security tab
2. Read CodeQL recommendation
3. Fix code or update dependency
4. Push fix (will re-run CodeQL)
5. Dismiss alert if false positive (with justification)

---

### Preview Deployment Not Commenting

**Cause:** Missing `GITHUB_TOKEN` or insufficient permissions

**Fix:**
1. Verify `GITHUB_TOKEN` in workflow (should be automatic)
2. Check workflow permissions:
   ```yaml
   permissions:
     pull-requests: write
     issues: write
   ```
3. Ensure GitHub App has correct permissions

---

## Best Practices

### Commit Messages

Use conventional commits for automatic changelog generation:

```bash
feat: add new domain search filter
fix: resolve wallet connection issue
docs: update deployment guide
chore: update dependencies
test: add unit tests for profile page
```

### Branch Strategy

- `etc` - Production branch (deploys to app.ecns.domains)
- `main` - Future stable branch (currently unused)
- `feature/*` - Feature branches (deploy to preview)
- `fix/*` - Bug fix branches (deploy to preview)

### Pull Request Checklist

Before merging to `etc`:

- [ ] All CI checks pass (lint, typecheck, test, build)
- [ ] CodeQL scan passes
- [ ] Dependency review passes (no high severity)
- [ ] Lighthouse scores meet targets (>90)
- [ ] Preview deployment tested
- [ ] PR description includes context and screenshots
- [ ] Breaking changes documented

### Security

- ✓ Never commit secrets to repository
- ✓ Rotate Vercel token annually
- ✓ Review CodeQL alerts weekly
- ✓ Keep dependencies updated (Dependabot)
- ✓ Enable branch protection on `etc`
- ✓ Require status checks before merge

---

## Performance Optimization

### Reduce Build Time

1. **Use pnpm cache:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'pnpm'  # Already configured
   ```

2. **Parallelize jobs:**
   - Lint, typecheck, test, build run in parallel
   - Independent checks complete faster

3. **Cache Next.js build:**
   ```yaml
   - uses: actions/cache@v4
     with:
       path: .next/cache
       key: ${{ runner.os }}-nextjs-${{ hashFiles('pnpm-lock.yaml') }}
   ```

### Reduce Workflow Costs

GitHub Actions free tier:
- 2,000 minutes/month (free for public repos)
- Unlimited for public repositories

**Optimization strategies:**
- Use concurrency to cancel redundant runs
- Use appropriate timeouts
- Cache dependencies
- Run expensive workflows only on `etc` branch

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [CodeQL Documentation](https://codeql.github.com/docs/)

---

**Last Updated:** 2026-02-12
**Maintainer:** ECNS Development Team
