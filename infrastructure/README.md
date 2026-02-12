# ECNS Infrastructure Documentation

Complete infrastructure setup and deployment guides for ECNS production systems.

## Overview

ECNS infrastructure is built on modern cloud platforms with emphasis on performance, security, and reliability.

### Stack

| Layer | Provider | Purpose |
|-------|----------|---------|
| **Domain** | Namecheap | ecns.domains registration |
| **DNS** | Cloudflare | DNS management, CDN, SSL/TLS |
| **Hosting** | Vercel | App and docs deployment |
| **Repository** | GitHub | Source code and CI/CD |

---

## Quick Start

### For Deployment

Start with the deployment checklist:

```bash
cat DEPLOYMENT-CHECKLIST.md
```

This provides a step-by-step walkthrough of the entire deployment process.

### For DNS Configuration

See DNS configuration guide:

```bash
cat dns-configuration.md
```

Covers Cloudflare DNS setup, SSL/TLS configuration, and security settings.

### For Vercel Deployment

See Vercel deployment guide:

```bash
cat vercel-deployment.md
```

Detailed instructions for deploying app and docs to Vercel with custom domains.

---

## Documentation Index

### Deployment Guides

| File | Purpose | Audience |
|------|---------|----------|
| [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) | Complete deployment checklist (start here) | DevOps, Deployers |
| [dns-configuration.md](dns-configuration.md) | Cloudflare DNS setup and management | DNS Admins |
| [vercel-deployment.md](vercel-deployment.md) | Vercel project deployment and configuration | Developers |

---

## Infrastructure Architecture

### Domain Structure

```
ecns.domains (root)
├── app.ecns.domains       → Vercel (ECNS App)
├── docs.ecns.domains      → Vercel (ECNS Docs)
└── www.ecns.domains       → Redirect to app.ecns.domains
```

### DNS Flow

```
User Request
    ↓
Cloudflare DNS (Proxied)
    ↓
Cloudflare CDN (Edge Cache)
    ↓
Vercel Edge Network
    ↓
Next.js App (Edge Runtime)
```

### Deployment Pipeline

```
Developer
    ↓
Git Push (GitHub)
    ↓
Vercel Build (Automatic)
    ↓
Edge Deployment (Global)
    ↓
Cloudflare CDN (Caching)
    ↓
Production (app.ecns.domains)
```

---

## Access & Credentials

### Required Accounts

**Production Access:**
- Namecheap (domain registrar)
- Cloudflare (DNS + CDN)
- Vercel (hosting)
- GitHub (ecnsdomains organization)

**Monitoring:**
- UptimeRobot (uptime monitoring)
- Vercel Analytics (performance)
- Cloudflare Analytics (traffic)

**Optional:**
- Sentry (error tracking)
- Plausible (privacy-friendly analytics)

### Security

- ✓ Enable 2FA on all accounts
- ✓ Use password manager for credentials
- ✓ Rotate API keys quarterly
- ✓ Review access logs monthly

---

## Environment Variables

### App (app.ecns.domains)

**Production:**
```bash
NEXT_PUBLIC_CHAIN_NAME=etc
NEXT_PUBLIC_PROVIDER=https://etc.rivet.cloud
NEXT_PUBLIC_DOMAIN=ecns.domains
```

**Preview/Development:**
```bash
NEXT_PUBLIC_CHAIN_NAME=mordor
NEXT_PUBLIC_PROVIDER=https://rpc.mordor.etccooperative.org
```

### Docs (docs.ecns.domains)

```bash
NEXT_PUBLIC_SITE_URL=https://docs.ecns.domains
NEXT_PUBLIC_APP_URL=https://app.ecns.domains
NEXT_PUBLIC_GITHUB_ORG=ecnsdomains
```

---

## Performance Targets

### App (app.ecns.domains)

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance | >90 | - |
| Lighthouse Accessibility | >90 | - |
| First Contentful Paint | <1.5s | - |
| Time to Interactive | <3.0s | - |
| Total Blocking Time | <200ms | - |

### Docs (docs.ecns.domains)

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance | >95 | - |
| Lighthouse Accessibility | >95 | - |
| First Contentful Paint | <1.0s | - |
| Time to Interactive | <2.0s | - |

---

## Monitoring & Alerts

### Uptime Monitoring

**UptimeRobot:**
- app.ecns.domains (HTTPS)
- docs.ecns.domains (HTTPS)
- Check interval: 5 minutes
- Alert via: Email, Slack

### Performance Monitoring

**Vercel Analytics:**
- Real User Monitoring (RUM)
- Core Web Vitals
- Function performance

**Cloudflare Analytics:**
- Traffic patterns
- Bandwidth usage
- Threat analytics
- Cache hit ratio

### Error Tracking

**Vercel:**
- Deployment failures
- Function errors
- Build errors

**Optional (Sentry):**
- Runtime errors
- User-facing errors
- Stack traces

---

## Security Configuration

### Cloudflare

**SSL/TLS:**
- Encryption mode: Full (strict)
- HSTS: Enabled (6 months, preload)
- Minimum TLS: 1.2
- Always Use HTTPS: Enabled

**WAF (Web Application Firewall):**
- Managed Rules: Enabled
- Bot Fight Mode: Enabled
- Rate Limiting: 100 req/min on /api/*

**DNS:**
- DNSSEC: Enabled (recommended)
- Proxy Status: Proxied (orange cloud)

### Vercel

**Security Headers:**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- CSP: Configured in next.config.js

**Environment Variables:**
- Never commit secrets
- Use Vercel env vars for API keys
- Rotate keys quarterly

---

## Cost Breakdown

### Monthly Costs

| Service | Plan | Cost/month | Notes |
|---------|------|------------|-------|
| Namecheap | Domain | ~$1/month | $12/year amortized |
| Cloudflare | Free | $0 | DNS + CDN + SSL |
| Vercel | Hobby | $0 | 100GB bandwidth |
| GitHub | Free | $0 | Public repos |
| UptimeRobot | Free | $0 | 50 monitors |
| **Total** | - | **$1/month** | Within free tiers |

### Upgrade Triggers

**Cloudflare Pro ($20/month):**
- Need advanced WAF rules
- Need image optimization
- Need prioritized email support

**Vercel Pro ($20/month):**
- Exceed 100GB bandwidth/month
- Need concurrent builds
- Need advanced analytics
- Commercial license required

---

## Troubleshooting

### Common Issues

**DNS not resolving:**
```bash
# Check nameservers
dig ecns.domains NS +short

# Check CNAME
dig app.ecns.domains CNAME +short

# Clear local DNS cache
sudo systemd-resolve --flush-caches
```

**SSL certificate error:**
```bash
# Check certificate
openssl s_client -connect app.ecns.domains:443 -servername app.ecns.domains

# Verify Cloudflare SSL mode is "Full (strict)"
```

**Vercel deployment fails:**
```bash
# Check build logs in Vercel dashboard
# Verify environment variables are set
# Check package.json scripts are correct
```

**Slow performance:**
```bash
# Check Cloudflare cache hit ratio (should be >80%)
# Run Lighthouse audit
# Check Vercel function cold start times
```

---

## Disaster Recovery

### Backup Strategy

**Code:**
- Primary: GitHub (ecnsdomains organization)
- Backup: Local clones on developer machines

**DNS:**
- Export DNS records from Cloudflare monthly
- Keep copy in infrastructure/backups/

**Environment Variables:**
- Document all env vars in `.env.example`
- Store production values in password manager

### Recovery Procedures

**DNS Failure:**
1. Check Cloudflare status page
2. If Cloudflare down, switch nameservers at Namecheap
3. Point to backup DNS provider

**Vercel Failure:**
1. Check Vercel status page
2. If Vercel down, deploy to backup platform (Cloudflare Pages)
3. Update DNS CNAME to point to backup

**Complete Outage:**
1. Deploy static maintenance page to Cloudflare Pages
2. Point DNS to maintenance page
3. Investigate and fix underlying issue
4. Restore service incrementally

---

## Maintenance Schedule

### Daily

- [ ] Check uptime monitoring alerts
- [ ] Review error logs (if any alerts)

### Weekly

- [ ] Review analytics (traffic, performance)
- [ ] Check for dependency updates
- [ ] Review deployment logs

### Monthly

- [ ] Export and backup DNS records
- [ ] Update dependencies (security patches)
- [ ] Review bandwidth usage
- [ ] Check SSL certificate expiry
- [ ] Review access logs

### Quarterly

- [ ] Rotate API keys
- [ ] Review and update documentation
- [ ] Performance audit (Lighthouse)
- [ ] Security audit (SSL Labs, securityheaders.com)
- [ ] Review and optimize costs

### Annually

- [ ] Renew domain (ecns.domains)
- [ ] Review and update infrastructure stack
- [ ] Major dependency updates
- [ ] Full security audit

---

## Change Management

### Making Infrastructure Changes

1. **Document change** in this directory
2. **Test in preview environment** (Vercel preview deployments)
3. **Create backup** of current configuration
4. **Apply change** during low-traffic window
5. **Monitor metrics** for 24 hours post-change
6. **Rollback if needed** (see rollback procedures in guides)
7. **Update documentation**

### Approval Process

| Change Type | Approval Required | Rollback Plan |
|-------------|-------------------|---------------|
| DNS record change | DevOps lead | Revert DNS record |
| Vercel config change | Developer | Promote previous deployment |
| Security policy change | Security lead | Revert policy |
| Major infrastructure change | Team consensus | Full rollback procedure |

---

## Support & Resources

### Documentation

- Cloudflare: https://developers.cloudflare.com
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs

### Status Pages

- Cloudflare: https://www.cloudflarestatus.com
- Vercel: https://www.vercel-status.com
- GitHub: https://www.githubstatus.com

### Community

- ECNS Discord: [TBD]
- GitHub Discussions: https://github.com/ecnsdomains/ecns-app/discussions

---

## Contributing

To contribute to infrastructure documentation:

1. Fork repository
2. Create feature branch
3. Make changes to relevant `.md` files
4. Test procedures if applicable
5. Submit pull request
6. Tag with `infrastructure` label

---

**Last Updated:** 2026-02-12
**Maintainer:** ECNS Development Team
**Review Cycle:** Quarterly
