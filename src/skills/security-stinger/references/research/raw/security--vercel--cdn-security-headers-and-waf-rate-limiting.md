# Content Security Policy / CDN security - Vercel Docs

- URL: https://vercel.com/docs/cdn-security/security-headers ; https://vercel.com/docs/cdn-security ; https://vercel.com/security/web-application-firewall ; https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules
- Fetched: 2026-08-14
- Source type: official vendor documentation (Vercel)
- Component: Vercel hosting layer (headers, WAF, rate limiting)

## Security headers on Vercel

- Vercel documents four configurable HTTP security headers: Content-Security-Policy (CSP, restricts which sources can load scripts/images/resources to prevent XSS), Strict-Transport-Security (HSTS, forces browsers to always connect over HTTPS), X-Frame-Options (blocks embedding in iframes to prevent clickjacking), X-Content-Type-Options (stops MIME-sniffing).
- HSTS is applied automatically by Vercel on `.vercel.app` domains and all subdomains, and those domains are preloaded in browser HSTS preload lists. Custom domains also get HSTS but the header can be further customized via the project's response-headers configuration.
- CSP best practices per Vercel: start with `Content-Security-Policy-Report-Only` before enforcing, to observe violations without breaking functionality; avoid `unsafe-inline`/`unsafe-eval`; use nonces or hashes to allow specific inline scripts/styles instead of blanket `unsafe-inline` (this is the same nonce/hash mechanism SvelteKit's own `kit.csp` config generates - see the SvelteKit CSRF/CSP source - so on Vercel the SvelteKit-level `csp.mode: 'nonce' | 'hash' | 'auto'` setting is what actually produces Vercel-compatible header values); be as specific as possible in source allowlists (avoid broad wildcard subdomains); keep directives updated as the app's resource sources change.
- Example CSP header syntax: `Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com; img-src 'self' img.example.com; style-src 'self';`

## Vercel Firewall / WAF / rate limiting

- Vercel's request pipeline: platform-wide firewall (Layer 3/DDoS/SYN-flood protection) inspects every request first, then deployment protection (project-level access rules), then the project's Web Application Firewall (WAF) rules, then the request reaches the deployment.
- The managed WAF ruleset protects against OWASP Top 10 risks including SQL injection and XSS at the edge, before the request reaches application code.
- Custom WAF rules can log, deny, challenge, bypass, or RATE LIMIT traffic based on 15+ request parameters (path, headers, cookies, user agent, JA3/JA4 TLS fingerprint, etc.), configurable via natural language, step-by-step UI, or `vercel.json` (`vercel.json` only supports a subset of actions - `log`, `bypass`, and `redirect` are dashboard/API-only, not configurable via `vercel.json`).
- Rate-limit rules support "persistent actions": a challenge/deny/rate-limit action can carry a follow-on timed block, so a client that trips a rate limit can be automatically blocked for a configurable duration (default timeframe option starts at 1 minute) rather than only being rejected for the single offending request.
- Example natural-language WAF rule prompts documented by Vercel: "Rate limit /api to 100 requests per minute per IP," "Block requests where path ends with .env, .git, or .bak" (directly relevant to blocking scans for accidentally-deployed secret/config files), "Rate limit POST /auth/login to 10 per minute per IP, deny for 15 minutes" (brute-force login protection).
- Rule changes propagate globally in roughly 300ms and do not require a redeploy - meaning WAF/rate-limit tuning is an operational control that can be adjusted independently of a code ship.
