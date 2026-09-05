---
source_type: docs
authority: high
relevance: high
topic: Next.js remotePatterns security SSRF configuration
url: https://nextjs.org/docs/messages/next-image-unconfigured-host
date_accessed: 2026-05-20
---

# Next.js `next/image` Unconfigured Host: Security Guide

## Key Findings

### SSRF Risk

Overly broad `remotePatterns` (e.g., `hostname: "**"`) allow malicious actors to use the Next.js Image Optimization API as a proxy to fetch arbitrary external URLs: a Server-Side Request Forgery vector.

**Never use**: `hostname: '**'` without a protocol/pathname restriction.

### Exact Matching Semantics

Each part of the `src` URL is strictly matched:
- **Protocol**: `http` vs `https` must match exactly
- **Hostname**: `example.org` ≠ `www.example.org` ≠ `assets.example.org`
- **Port**: if present (e.g., `:3000`), must be included in pattern
- **Pathname**: must be covered by glob (e.g., `/**` or `/images/**`)
- **Search**: if specified in pattern, must match full search string (Globs NOT supported for search)

### Common Pitfalls

1. Using `https` in `src` but only allowing `http` (or vice versa)
2. Loading from `assets.example.com` while configuring `example.com`
3. Missing port during local/dev usage (e.g., `http://localhost:3000`)
4. Too-narrow pathname pattern (`/images/` vs `/images/**`)
5. When using `new URL()` constructor syntax: if no `search` is specified, `search` property defaults to `''`; meaning search params are NOT allowed

### Safe Patterns

```js
// GOOD — specific bucket on S3
remotePatterns: [{ protocol: 'https', hostname: 's3.amazonaws.com', pathname: '/my-bucket/**' }]

// GOOD — all subdomains of example.com (1 level)
remotePatterns: [{ protocol: 'https', hostname: '*.example.com' }]

// GOOD — any subdomain depth
remotePatterns: [{ protocol: 'https', hostname: '**.example.com' }]

// RISKY — no pathname restriction (all paths on this host allowed)
remotePatterns: [new URL('https://cdn.example.com/**')]

// DANGEROUS — wildcard hostname
remotePatterns: [{ protocol: 'https', hostname: '**' }]
```

### Version Note (Next.js 15.3.0+)

The `new URL()` constructor syntax was added in Next.js 15.3.0. For older versions, use the object syntax with all fields explicitly set.

## Relevance to image-optimization-stinger

This is the security-critical content that `guides/04-nextjs-image.md` must encode. The Command Brief explicitly calls out SSRF as a critical directive ("Validate remote remotePatterns before shipping... overly broad patterns are a Server-Side Request Forgery vector"). Must be included verbatim.

## Direct Quotes / Data Points

- "To protect your application from malicious users, configuration is required in order to use external images. This ensures that only external images from your account can be served from the Next.js Image Optimization API."
- "Good to know: When omitting protocol, port, pathname, or search then the wildcard ** is implied. This is not recommended because it may allow malicious actors to optimize urls you did not intend."
- "domains configuration does not support wildcard pattern matching and it cannot restrict protocol, port, or pathname. Since most remote image servers are shared between multiple tenants, it's safer to use remotePatterns." (domains was deprecated in Next.js 14)
