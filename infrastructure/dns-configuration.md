# ECNS DNS Configuration Guide

DNS management for ecns.domains infrastructure using Cloudflare.

## Infrastructure Overview

| Component | Provider | Purpose |
|-----------|----------|---------|
| Domain Registrar | Namecheap | ecns.domains registration |
| DNS Management | Cloudflare | All DNS records |
| App Deployment | Vercel | app.ecns.domains |
| Docs Deployment | Vercel | docs.ecns.domains |
| Repository Hosting | GitHub | Source code |

---

## Prerequisites

### 1. Cloudflare Access

Ensure you have access to the Cloudflare account managing ecns.domains:

1. Login to Cloudflare: https://dash.cloudflare.com
2. Verify ecns.domains is listed in your domains
3. Check DNS tab is accessible

### 2. Vercel Access

Ensure you have access to Vercel projects:

1. Login to Vercel: https://vercel.com
2. Verify ECNS organization/account exists
3. Check project deployment access

---

## DNS Records Configuration

### Current Required Records

Configure these DNS records in Cloudflare DNS dashboard:

#### Root Domain (ecns.domains)

| Type | Name | Content | Proxy | TTL | Notes |
|------|------|---------|-------|-----|-------|
| A | @ | 76.76.21.21 | ✓ Proxied | Auto | Vercel anycast (temporary placeholder) |
| AAAA | @ | 2606:4700:3034::ac43:bd4e | ✓ Proxied | Auto | Vercel IPv6 |
| CNAME | www | ecns.domains | ✓ Proxied | Auto | WWW redirect to root |
| TXT | @ | v=spf1 include:_spf.mx.cloudflare.net ~all | - | Auto | SPF record |

**Note:** Root domain should redirect to app.ecns.domains (configured in Vercel)

#### App Subdomain (app.ecns.domains)

| Type | Name | Content | Proxy | TTL | Notes |
|------|------|---------|-------|-----|-------|
| CNAME | app | cname.vercel-dns.com | ✓ Proxied | Auto | Vercel deployment |

#### Docs Subdomain (docs.ecns.domains)

| Type | Name | Content | Proxy | TTL | Notes |
|------|------|---------|-------|-----|-------|
| CNAME | docs | cname.vercel-dns.com | ✓ Proxied | Auto | Vercel deployment |

#### Faucet (faucet.ecns.domains) - Optional

| Type | Name | Content | Proxy | TTL | Notes |
|------|------|---------|-------|-----|-------|
| CNAME | faucet | mordortestnet.github.io | ✗ DNS only | Auto | GitHub Pages for faucet UI |
| TXT | _github-pages-challenge-ecnsdomains.faucet | [verification-code] | - | Auto | GitHub Pages verification |

**Alternative:** Point faucet.ecns.domains to https://github.com/mordortestnet/mordor-public-faucet directly (no subdomain needed, just link in docs)

#### API/RPC Subdomains (Optional, for future)

| Type | Name | Content | Proxy | TTL | Notes |
|------|------|---------|-------|-----|-------|
| A | rpc | [VPS-IP] | ✗ DNS only | Auto | ETC mainnet RPC endpoint |
| A | rpc-mordor | [VPS-IP] | ✗ DNS only | Auto | Mordor testnet RPC endpoint |

---

## Step-by-Step Setup

### Step 1: Configure Cloudflare DNS

1. **Login to Cloudflare:**
   ```
   https://dash.cloudflare.com
   ```

2. **Select ecns.domains:**
   - Click on ecns.domains in your domain list

3. **Navigate to DNS:**
   - Left sidebar → DNS → Records

4. **Add App Subdomain:**
   - Click "Add record"
   - Type: CNAME
   - Name: app
   - Target: cname.vercel-dns.com
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto
   - Click "Save"

5. **Add Docs Subdomain:**
   - Click "Add record"
   - Type: CNAME
   - Name: docs
   - Target: cname.vercel-dns.com
   - Proxy status: Proxied
   - TTL: Auto
   - Click "Save"

6. **Verify Records:**
   ```bash
   dig app.ecns.domains +short
   dig docs.ecns.domains +short
   ```

### Step 2: Configure Vercel Domains

#### For App (app.ecns.domains)

1. **Login to Vercel:**
   ```
   https://vercel.com/dashboard
   ```

2. **Select ECNS App Project:**
   - Navigate to your ECNS app project

3. **Go to Settings → Domains:**
   - Click "Settings" tab
   - Click "Domains" in left sidebar

4. **Add Domain:**
   - Enter: `app.ecns.domains`
   - Click "Add"

5. **Verify DNS Configuration:**
   - Vercel will verify the CNAME record
   - Should show ✓ Valid configuration
   - If invalid, wait 5-10 minutes for DNS propagation

6. **Set as Production Domain:**
   - Click the three dots next to app.ecns.domains
   - Select "Set as Production Domain"

7. **Enable HTTPS:**
   - Vercel automatically provisions SSL certificate
   - Should show "Active" within 1-2 minutes

#### For Docs (docs.ecns.domains)

Repeat the same process for the docs project:

1. Select ECNS Docs project in Vercel
2. Settings → Domains
3. Add `docs.ecns.domains`
4. Verify DNS configuration
5. Set as production domain
6. Confirm HTTPS active

### Step 3: Configure SSL/TLS in Cloudflare

1. **Navigate to SSL/TLS Settings:**
   - Cloudflare dashboard → ecns.domains → SSL/TLS

2. **Set Encryption Mode:**
   - Select: **Full (strict)**
   - This ensures end-to-end encryption (Cloudflare ↔ Vercel)

3. **Enable Always Use HTTPS:**
   - SSL/TLS → Edge Certificates
   - Toggle "Always Use HTTPS" → ON

4. **Enable HSTS:**
   - SSL/TLS → Edge Certificates
   - Enable HTTP Strict Transport Security (HSTS)
   - Max Age: 6 months (15768000 seconds)
   - Include subdomains: ✓
   - Preload: ✓

5. **Minimum TLS Version:**
   - Set to: TLS 1.2 or higher

### Step 4: Configure Cloudflare Performance

1. **Enable Auto Minify:**
   - Speed → Optimization
   - Auto Minify: JavaScript, CSS, HTML → ON

2. **Enable Brotli:**
   - Speed → Optimization
   - Brotli → ON

3. **Caching:**
   - Caching → Configuration
   - Caching Level: Standard
   - Browser Cache TTL: Respect Existing Headers

4. **Page Rules (Optional):**

   **Rule 1: Force HTTPS**
   ```
   URL: http://*ecns.domains/*
   Setting: Always Use HTTPS
   ```

   **Rule 2: Cache API responses**
   ```
   URL: *ecns.domains/api/*
   Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 day
   ```

---

## Verification Checklist

After completing DNS configuration, verify each subdomain:

### App Subdomain

```bash
# Check DNS resolution
dig app.ecns.domains +short
# Expected: Cloudflare proxy IPs

# Check HTTPS
curl -I https://app.ecns.domains
# Expected: HTTP/2 200 OK

# Check SSL certificate
openssl s_client -connect app.ecns.domains:443 -servername app.ecns.domains < /dev/null 2>/dev/null | openssl x509 -noout -subject -dates
# Expected: Valid certificate for app.ecns.domains
```

### Docs Subdomain

```bash
# Check DNS resolution
dig docs.ecns.domains +short

# Check HTTPS
curl -I https://docs.ecns.domains

# Check SSL certificate
openssl s_client -connect docs.ecns.domains:443 -servername docs.ecns.domains < /dev/null 2>/dev/null | openssl x509 -noout -subject -dates
```

### Root Domain Redirect

```bash
# Should redirect to app.ecns.domains
curl -I https://ecns.domains
# Expected: HTTP/2 301 or 308 redirect
```

---

## Cloudflare Firewall Rules (Security)

Add firewall rules to protect against common attacks:

### Rule 1: Block Bad Bots

```
Expression: (cf.client.bot)
Action: Challenge (CAPTCHA)
```

### Rule 2: Rate Limiting

```
Expression: (http.request.uri.path contains "/api/")
Action: Rate Limit (100 requests per minute)
```

### Rule 3: Geo-blocking (Optional)

If you want to limit access to specific countries:

```
Expression: (ip.geoip.country ne "US" and ip.geoip.country ne "CA")
Action: Challenge
```

---

## Environment Variables

Set these in Vercel for both app and docs projects:

### App Environment Variables

```bash
# Production
NEXT_PUBLIC_DOMAIN=ecns.domains
NEXT_PUBLIC_CHAIN_NAME=etc
NEXT_PUBLIC_PROVIDER=https://etc.rivet.cloud
NEXT_PUBLIC_GRAPH_URI=https://subgraph.ecns.domains/graphql

# Preview/Development
NEXT_PUBLIC_DOMAIN=app-preview.vercel.app
NEXT_PUBLIC_CHAIN_NAME=mordor
NEXT_PUBLIC_PROVIDER=https://rpc.mordor.etccooperative.org
```

### Docs Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://docs.ecns.domains
NEXT_PUBLIC_APP_URL=https://app.ecns.domains
```

---

## Monitoring & Alerts

### Cloudflare Analytics

Monitor traffic and performance:

1. Cloudflare dashboard → Analytics
2. Check:
   - Total requests
   - Bandwidth usage
   - SSL/TLS traffic percentage (should be 100%)
   - Top countries/IPs
   - Threat analytics

### Vercel Analytics

Monitor deployment and runtime:

1. Vercel dashboard → Project → Analytics
2. Check:
   - Page views
   - Real User Monitoring (RUM)
   - Function invocations
   - Bandwidth usage

### Uptime Monitoring

Set up external uptime monitoring:

**Option 1: UptimeRobot (Free)**
```
https://uptimerobot.com
Monitor:
- https://app.ecns.domains (HTTP)
- https://docs.ecns.domains (HTTP)
- Check interval: 5 minutes
```

**Option 2: Cloudflare Health Checks (Pro plan)**
```
Cloudflare → Traffic → Health Checks
Add monitors for app and docs subdomains
```

---

## Troubleshooting

### DNS Not Resolving

**Symptom:** `dig app.ecns.domains` returns no results

**Fix:**
1. Check Cloudflare DNS records are saved
2. Verify nameservers at Namecheap point to Cloudflare
3. Wait up to 24 hours for propagation (usually <5 minutes)

### SSL Certificate Error

**Symptom:** Browser shows "Your connection is not private"

**Fix:**
1. Check Cloudflare SSL/TLS mode is "Full (strict)"
2. Verify Vercel SSL certificate is active
3. Clear browser cache and retry
4. Check certificate validity: `openssl s_client -connect app.ecns.domains:443`

### Vercel Domain Not Verified

**Symptom:** Vercel shows "Invalid Configuration"

**Fix:**
1. Verify CNAME record in Cloudflare: `dig app.ecns.domains CNAME +short`
2. Should return: `cname.vercel-dns.com`
3. If missing, add CNAME record in Cloudflare
4. Wait 5-10 minutes, then click "Refresh" in Vercel

### Redirect Loop

**Symptom:** Browser shows "Too many redirects"

**Fix:**
1. Check Cloudflare SSL/TLS mode (should be "Full (strict)", not "Flexible")
2. Verify Vercel is serving HTTPS (check deployment logs)
3. Disable "Always Use HTTPS" temporarily in Cloudflare to debug

### Slow Performance

**Symptom:** App loads slowly (>3 seconds)

**Fix:**
1. Enable Cloudflare Auto Minify
2. Enable Brotli compression
3. Check Vercel function cold start times
4. Verify Cloudflare cache is working (check CF-Cache-Status header)

---

## DNS Migration Checklist

If migrating from another DNS provider to Cloudflare:

- [ ] Export DNS records from current provider
- [ ] Add all records to Cloudflare
- [ ] Verify records with `dig` before switching nameservers
- [ ] Update nameservers at Namecheap to Cloudflare
- [ ] Wait for nameserver propagation (24-48 hours)
- [ ] Verify all subdomains resolve correctly
- [ ] Enable Cloudflare features (SSL, caching, minification)
- [ ] Set up firewall rules and rate limiting
- [ ] Configure uptime monitoring
- [ ] Update documentation with new DNS configuration

---

## Cost Breakdown

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| Namecheap | Domain registration | ~$12/year | .domains TLD |
| Cloudflare | Free plan | $0/month | DNS + CDN + SSL |
| Vercel | Hobby (Free) | $0/month | 100GB bandwidth/month |
| Vercel | Pro (if needed) | $20/month | 1TB bandwidth/month |

**Total:** $12/year (domain only) + $0-20/month (hosting)

---

## Next Steps

1. **Verify Cloudflare Access:**
   - Confirm login credentials
   - Check ecns.domains is in your account

2. **Add DNS Records:**
   - Add CNAME for app.ecns.domains
   - Add CNAME for docs.ecns.domains

3. **Configure Vercel:**
   - Add custom domains to projects
   - Verify SSL certificates

4. **Test Deployments:**
   - Deploy app to production
   - Deploy docs to production
   - Verify HTTPS works

5. **Set Up Monitoring:**
   - Configure UptimeRobot alerts
   - Enable Cloudflare analytics

---

## Security Best Practices

- ✓ Use "Full (strict)" SSL/TLS mode
- ✓ Enable HSTS with preload
- ✓ Enable Cloudflare WAF (Web Application Firewall)
- ✓ Set up rate limiting on API endpoints
- ✓ Enable bot protection
- ✓ Regularly review access logs
- ✓ Use Vercel environment variables for secrets
- ✓ Enable 2FA on Cloudflare and Vercel accounts

---

## Contact & Support

- **Cloudflare Support:** https://support.cloudflare.com
- **Vercel Support:** https://vercel.com/support
- **Namecheap Support:** https://www.namecheap.com/support/

---

**Last Updated:** 2026-02-12
**Maintainer:** ECNS Development Team
