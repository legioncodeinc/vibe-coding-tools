# 07. Headers and transport

Grounded in [references/research/distilled-security.md §11](../references/research/distilled-security.md).

## Content Security Policy

SvelteKit generates the actual CSP header value via `kit.csp` config (`mode: 'hash' | 'nonce' | 'auto'`) - see [02-sveltekit-attack-surface.md](02-sveltekit-attack-surface.md) for the framework-level mechanics. Vercel's own best-practice guidance for the header itself: start with `Content-Security-Policy-Report-Only` to observe violations before enforcing; avoid `unsafe-inline`/`unsafe-eval`; use nonces or hashes for any inline content that genuinely needs to run rather than a blanket `unsafe-inline`; be as specific as possible in source allowlists (avoid broad wildcard subdomains); keep directives current as the app's actual resource sources change. [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md]

A production deployment left permanently in `Report-Only` mode with no plan to enforce is a Medium finding - Report-Only observes violations, it does not block anything.

## HSTS

Vercel applies HSTS automatically on `.vercel.app` domains and their subdomains (preloaded in browser HSTS lists); custom domains also get HSTS and the header remains configurable through the project's response-headers configuration. Confirm this hasn't been overridden/weakened for the custom domain this app actually deploys to. [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md]

## Frame options and content-type sniffing

`X-Frame-Options` (clickjacking) and `X-Content-Type-Options` (MIME-sniffing) are both documented as first-class configurable Vercel headers. Confirm both are present on the production deployment - their absence is a Medium finding individually, but combined with a weak or absent CSP `frame-ancestors` directive it compounds toward High.

## Vercel's managed WAF

Vercel's platform-wide firewall runs before the request reaches deployment protection or the project's own WAF rules; the managed ruleset already blocks OWASP-Top-10-class attacks (SQL injection, XSS) at the edge. This does NOT replace application-level input validation and parameterized queries - it's a defense-in-depth layer, not a substitute for the checks in [03-authorization-and-tenancy.md](03-authorization-and-tenancy.md) and [04-secrets-and-env.md](04-secrets-and-env.md).

## Rate limiting and abuse prevention

Custom WAF rules support rate limiting keyed by 15+ request parameters (path, IP, headers, cookies, user agent, JA3/JA4 TLS fingerprint) with optional "persistent actions" - a rate-limit trip can carry an automatic timed block (e.g. deny for 15 minutes) rather than only rejecting the single offending request. Documented example patterns directly relevant to this stack: rate-limiting `POST /auth/login` (brute-force protection on the WorkOS-fronted login flow) and blocking requests where the path ends in `.env`, `.git`, or `.bak` (defense-in-depth against an accidentally-deployed secret/config file). Rules can be authored via natural language, the dashboard UI, or `vercel.json` - note `vercel.json` only supports a subset of actions (`log`, `bypass`, and `redirect` require the dashboard/API), and rule changes propagate in roughly 300ms without a redeploy. [raw/security--vercel--cdn-security-headers-and-waf-rate-limiting.md]

Audit-time question for any auth-adjacent or webhook-intake endpoint: is it covered by an explicit rate limit, or only by Vercel's generic edge protections? An unrated-limited login or password-reset endpoint is a Medium finding even with everything else correct.
