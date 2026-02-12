# ECNS Production Deployment Checklist

Complete checklist for deploying ECNS app and docs to production.

## Infrastructure Stack

- ✓ **Registrar:** Namecheap (ecns.domains)
- ✓ **DNS:** Cloudflare (DNS management + CDN + SSL)
- ✓ **Hosting:** Vercel (app + docs deployment)
- ✓ **Repos:** GitHub (ecnsdomains organization)

---

## Pre-Deployment Checklist

### Account Access

- [ ] **Namecheap Account:**
  - Login credentials verified
  - Domain renewal set to auto-renew
  - Contact information up to date

- [ ] **Cloudflare Account:**
  - Login credentials verified
  - ecns.domains listed in dashboard
  - 2FA enabled

- [ ] **Vercel Account:**
  - Login credentials verified
  - GitHub integration connected
  - ECNS organization/team created (optional)

- [ ] **GitHub Access:**
  - Access to ecnsdomains organization
  - Write access to ecns-app repository
  - Write access to ecnsjs repository

### Code Readiness

- [ ] **App Repository:**
  - All tests passing
  - Build succeeds locally
  - No TypeScript errors
  - Dependencies updated
  - OG image generator installed (`@vercel/og`)

- [ ] **Docs Repository:**
  - Documentation complete
  - Build succeeds locally
  - All links working
  - No broken images

---

## Phase 1: DNS Configuration (30 minutes)

### Step 1: Verify Nameservers

- [ ] Login to Namecheap
- [ ] Navigate to Domain List → ecns.domains → Manage
- [ ] Verify nameservers point to Cloudflare:
  ```
  ns1.cloudflare.com
  ns2.cloudflare.com
  ```
- [ ] If not, update nameservers and wait 24-48 hours for propagation

### Step 2: Configure Cloudflare DNS

- [ ] Login to Cloudflare
- [ ] Select ecns.domains domain
- [ ] Navigate to DNS → Records
- [ ] Add/verify DNS records:

**Root Domain:**
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: ON (orange cloud)
```

**WWW Subdomain:**
```
Type: CNAME
Name: www
Target: ecns.domains
Proxy: ON
```

**App Subdomain:**
```
Type: CNAME
Name: app
Target: cname.vercel-dns.com
Proxy: ON
```

**Docs Subdomain:**
```
Type: CNAME
Name: docs
Target: cname.vercel-dns.com
Proxy: ON
```

- [ ] Save all records
- [ ] Verify DNS propagation:
  ```bash
  dig app.ecns.domains +short
  dig docs.ecns.domains +short
  ```

### Step 3: Configure SSL/TLS

- [ ] Cloudflare → SSL/TLS → Overview
- [ ] Set encryption mode: **Full (strict)**
- [ ] Navigate to Edge Certificates
- [ ] Enable **Always Use HTTPS**
- [ ] Enable **HTTP Strict Transport Security (HSTS)**:
  - Max Age: 6 months (15768000)
  - Include subdomains: ON
  - Preload: ON
- [ ] Set **Minimum TLS Version**: 1.2
- [ ] Enable **Automatic HTTPS Rewrites**

### Step 4: Performance Optimization

- [ ] Cloudflare → Speed → Optimization
- [ ] Enable **Auto Minify** (JS, CSS, HTML)
- [ ] Enable **Brotli** compression
- [ ] Cloudflare → Caching
- [ ] Set **Caching Level**: Standard
- [ ] Set **Browser Cache TTL**: Respect Existing Headers

---

## Phase 2: Vercel App Deployment (45 minutes)

### Step 1: Import Project

- [ ] Login to Vercel: https://vercel.com
- [ ] Click "New Project"
- [ ] Import Git Repository → GitHub
- [ ] Select `ecnsdomains/ecns-app`
- [ ] Configure:
  - Project Name: `ecns-app`
  - Framework: Next.js (auto-detected)
  - Root Directory: `./` or `./app`
  - Build Command: `pnpm build`
  - Install Command: `pnpm install --frozen-lockfile`

### Step 2: Environment Variables

- [ ] Navigate to Settings → Environment Variables
- [ ] Add Production variables:

```bash
NEXT_PUBLIC_CHAIN_NAME=etc
NEXT_PUBLIC_PROVIDER=https://etc.rivet.cloud
NEXT_PUBLIC_DOMAIN=ecns.domains
```

- [ ] Add Preview/Development variables (optional):

```bash
NEXT_PUBLIC_CHAIN_NAME=mordor
NEXT_PUBLIC_PROVIDER=https://rpc.mordor.etccooperative.org
```

### Step 3: Build Settings

- [ ] Settings → General → Build & Development Settings
- [ ] Verify:
  - Node.js Version: 24.x
  - Package Manager: pnpm
  - Build Command: `pnpm build`
  - Output Directory: `.next`

### Step 4: Deploy

- [ ] Click "Deploy" button
- [ ] Monitor build logs (should complete in 2-5 minutes)
- [ ] Verify deployment at temporary URL: `https://ecns-app.vercel.app`
- [ ] Test wallet connection
- [ ] Test domain search
- [ ] Check OG image: `https://ecns-app.vercel.app/api/og?domain=test.etc`

### Step 5: Add Custom Domain

- [ ] Settings → Domains
- [ ] Click "Add Domain"
- [ ] Enter: `app.ecns.domains`
- [ ] Click "Add"
- [ ] Wait for DNS verification (5-10 minutes)
- [ ] Click three dots → "Set as Production Domain"
- [ ] Verify SSL certificate is active (green checkmark)
- [ ] Test production domain:
  ```bash
  curl -I https://app.ecns.domains
  # Expected: HTTP/2 200 OK
  ```

### Step 6: Configure Git Integration

- [ ] Settings → Git
- [ ] Set Production Branch: `etc`
- [ ] Enable "Automatically deploy commits"
- [ ] Enable "Preview deployments for all branches"

---

## Phase 3: Vercel Docs Deployment (30 minutes)

### Step 1: Import Docs Project

- [ ] Vercel Dashboard → New Project
- [ ] Import `ecnsdomains/ecnsjs`
- [ ] Configure:
  - Project Name: `ecns-docs`
  - Framework: Vite (or Other if not detected)
  - Root Directory: `./docs` (if in monorepo)
  - Build Command: `pnpm build` or `cd docs && pnpm build`
  - Output Directory: `.vocs/dist` or `docs/.vocs/dist`

### Step 2: Environment Variables

- [ ] Add Production variables:

```bash
NEXT_PUBLIC_SITE_URL=https://docs.ecns.domains
NEXT_PUBLIC_APP_URL=https://app.ecns.domains
NEXT_PUBLIC_GITHUB_ORG=ecnsdomains
```

### Step 3: Deploy & Configure Domain

- [ ] Click "Deploy"
- [ ] Monitor build logs
- [ ] Verify deployment at temporary URL
- [ ] Settings → Domains → Add `docs.ecns.domains`
- [ ] Set as Production Domain
- [ ] Verify SSL certificate active
- [ ] Test:
  ```bash
  curl -I https://docs.ecns.domains
  ```

---

## Phase 4: Verification & Testing (20 minutes)

### DNS Verification

- [ ] Test DNS resolution:
  ```bash
  dig ecns.domains +short
  dig app.ecns.domains +short
  dig docs.ecns.domains +short
  dig www.ecns.domains +short
  ```

### SSL/TLS Verification

- [ ] Check SSL certificates:
  ```bash
  openssl s_client -connect app.ecns.domains:443 -servername app.ecns.domains < /dev/null 2>/dev/null | openssl x509 -noout -subject -dates

  openssl s_client -connect docs.ecns.domains:443 -servername docs.ecns.domains < /dev/null 2>/dev/null | openssl x509 -noout -subject -dates
  ```

- [ ] Verify SSL Labs rating: https://www.ssllabs.com/ssltest/
  - Test: app.ecns.domains (should be A or A+)
  - Test: docs.ecns.domains (should be A or A+)

### Functionality Testing

**App (app.ecns.domains):**

- [ ] Homepage loads correctly
- [ ] Wallet connection works (MetaMask, WalletConnect)
- [ ] Domain search works
- [ ] Domain registration flow works (on Mordor testnet)
- [ ] Profile pages load
- [ ] OG image generator works:
  ```bash
  curl -I https://app.ecns.domains/api/og?domain=test.etc
  # Expected: HTTP/2 200, Content-Type: image/png
  ```

**Docs (docs.ecns.domains):**

- [ ] Homepage loads
- [ ] Navigation works
- [ ] All pages load correctly
- [ ] Search works (if implemented)
- [ ] Code examples are formatted correctly
- [ ] Links to app work correctly

### Performance Testing

- [ ] Run Lighthouse audit on app.ecns.domains
  - Target: Performance >90, Accessibility >90
- [ ] Run Lighthouse audit on docs.ecns.domains
  - Target: Performance >95, Accessibility >95

### Social Media Testing

- [ ] Test OG images with validators:
  - Twitter: https://cards-dev.twitter.com/validator
    - Test URL: https://app.ecns.domains
  - Facebook: https://developers.facebook.com/tools/debug/
    - Test URL: https://app.ecns.domains
  - LinkedIn: https://www.linkedin.com/post-inspector/
    - Test URL: https://app.ecns.domains

- [ ] Verify OG images display correctly
- [ ] Check meta tags are correct (title, description, image)

---

## Phase 5: Monitoring Setup (15 minutes)

### Uptime Monitoring

- [ ] Sign up for UptimeRobot: https://uptimerobot.com
- [ ] Add monitor:
  - Name: ECNS App
  - URL: https://app.ecns.domains
  - Type: HTTPS
  - Interval: 5 minutes
- [ ] Add monitor:
  - Name: ECNS Docs
  - URL: https://docs.ecns.domains
  - Type: HTTPS
  - Interval: 5 minutes

### Analytics Setup

- [ ] Vercel Analytics (if using):
  - App Settings → Analytics → Enable Web Analytics
  - Docs Settings → Analytics → Enable Web Analytics

- [ ] Plausible (if using):
  - Add script to _document.tsx (already configured)
  - Verify tracking at: https://plausible.io/ecns.domains

### Error Monitoring

- [ ] Set up error alerts in Vercel:
  - Settings → Notifications
  - Enable "Failed Deployments"
  - Enable "Function Errors"

---

## Phase 6: Security Hardening (10 minutes)

### Cloudflare Security

- [ ] Enable **Cloudflare WAF** (Web Application Firewall):
  - Security → WAF → Managed Rules → Enable
- [ ] Add **Rate Limiting** rule:
  - Security → WAF → Rate Limiting Rules
  - Rule: 100 requests per minute per IP on `/api/*`
- [ ] Enable **Bot Fight Mode**:
  - Security → Bots → Enable

### Vercel Security

- [ ] Review environment variables (no secrets exposed)
- [ ] Enable DDoS protection (automatic on Vercel)
- [ ] Review function permissions

### Account Security

- [ ] Enable 2FA on Cloudflare account
- [ ] Enable 2FA on Vercel account
- [ ] Enable 2FA on GitHub account
- [ ] Enable 2FA on Namecheap account

---

## Phase 7: Documentation & Handoff (10 minutes)

### Update Documentation

- [ ] Update README.md with production URLs
- [ ] Document environment variables in repository
- [ ] Update `.env.example` files
- [ ] Create deployment runbook (this checklist)

### Team Handoff

- [ ] Share access credentials (via password manager)
- [ ] Document deployment process
- [ ] Set up team communication channel (Discord/Slack)
- [ ] Schedule weekly deployment review

---

## Post-Deployment Checklist

### Week 1: Monitoring

- [ ] Day 1: Check uptime (should be 100%)
- [ ] Day 3: Review analytics (page views, bounce rate)
- [ ] Day 7: Check error logs (should be minimal)
- [ ] Week 1: Review Cloudflare analytics (bandwidth, threats)

### Week 2: Optimization

- [ ] Review Core Web Vitals
- [ ] Optimize slow pages (if any)
- [ ] Fix any reported bugs
- [ ] Update dependencies

### Monthly: Maintenance

- [ ] Review uptime reports
- [ ] Update dependencies
- [ ] Check SSL certificate expiry (should auto-renew)
- [ ] Review bandwidth usage vs limits
- [ ] Check domain renewal date

---

## Rollback Plan

If deployment fails or critical issues arise:

### Immediate Rollback (Vercel)

1. **Via Dashboard:**
   - Deployments → Select previous working deployment
   - Click three dots → "Promote to Production"
   - Instant rollback (0 downtime)

2. **Via CLI:**
   ```bash
   vercel rollback [deployment-url]
   ```

### DNS Rollback (Cloudflare)

1. **Remove custom domain from Vercel:**
   - Settings → Domains → Remove app.ecns.domains

2. **Point DNS to maintenance page:**
   - Cloudflare → DNS → Update CNAME to maintenance page

3. **Investigate and fix issues**

4. **Redeploy when ready**

---

## Emergency Contacts

| Service | Support URL | Phone |
|---------|-------------|-------|
| Cloudflare | https://support.cloudflare.com | - |
| Vercel | https://vercel.com/support | - |
| Namecheap | https://www.namecheap.com/support/ | - |
| GitHub | https://support.github.com | - |

---

## Success Criteria

Deployment is considered successful when:

- ✓ All domains resolve correctly (app, docs, www)
- ✓ SSL certificates are active and valid
- ✓ HTTPS enforced on all subdomains
- ✓ App functionality works (wallet connect, search, register)
- ✓ Docs site loads and navigation works
- ✓ OG images generate correctly
- ✓ Lighthouse scores >90 (performance, accessibility)
- ✓ Uptime monitoring configured
- ✓ Analytics tracking works
- ✓ Error monitoring active
- ✓ No critical errors in logs
- ✓ Social media cards display correctly

---

## Timeline Estimate

| Phase | Duration | Notes |
|-------|----------|-------|
| DNS Configuration | 30 min | Plus DNS propagation time |
| App Deployment | 45 min | Including testing |
| Docs Deployment | 30 min | Including testing |
| Verification | 20 min | Thorough testing |
| Monitoring Setup | 15 min | UptimeRobot + analytics |
| Security Hardening | 10 min | Cloudflare + 2FA |
| Documentation | 10 min | Update docs |

**Total:** ~2.5 hours (excluding DNS propagation wait time)

---

**Last Updated:** 2026-02-12
**Maintainer:** ECNS Development Team
