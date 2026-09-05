# Mintlify: Setup, 2026 Pricing, and Headless Mode

Mintlify is the fastest path from zero to polished, hosted docs. The key 2026 development: headless mode (Enterprise-only, February 2026) allows custom Astro frontends.

> Sources: `research/external/2026-05-20-mintlify-platform.md`, `research/external/2026-05-20-mintlify-pricing-2026.md`, `research/external/2026-05-20-mintlify-headless-custom-frontend.md`

---

## 2026 Pricing (always name this upfront)

| Tier | Price | Key limits |
|---|---|---|
| **Hobby** | $0 | 1 editor, Mintlify branding |
| **Pro** | $300/month | Unlimited editors, custom domain, no Mintlify branding on Pro plan |
| **Enterprise** | $600+/month | White-label, headless mode, SSO, custom SLAs |
| **AI overage** | Not publicly disclosed | Verify with Mintlify sales |

**The hidden cost trap:** White-labeling requires Enterprise ($600+/month). Name this before a team commits to Mintlify.

## Setup

```bash
npm i -g mintlify
mintlify dev   # local preview
```

Project structure:
```
docs/
├── mint.json          # site config
├── index.mdx          # home page
├── getting-started/
│   └── quickstart.mdx
└── api-reference/
    └── introduction.mdx
```

## `mint.json` minimal config

```json
{
  "name": "My Docs",
  "logo": {
    "light": "/logo/light.svg",
    "dark": "/logo/dark.svg"
  },
  "favicon": "/favicon.svg",
  "colors": {
    "primary": "#0D9373"
  },
  "navigation": [
    {
      "group": "Getting Started",
      "pages": ["getting-started/quickstart"]
    },
    {
      "group": "API Reference",
      "pages": ["api-reference/introduction"]
    }
  ]
}
```

## OpenAPI import

Mintlify renders OpenAPI specs natively. Add the spec path to `mint.json`:

```json
{
  "openapi": ["api-reference/openapi.json"],
  "navigation": [
    {
      "group": "API Reference",
      "pages": ["api-reference/openapi"]
    }
  ]
}
```

Mintlify auto-generates one page per endpoint. Enrich with MDX descriptions in the spec's `description` fields. Route spec authorship to `api-docs-worker-bee`.

## Headless mode (February 2026, Enterprise only)

Mintlify's headless mode allows a custom Astro frontend to consume the Mintlify content API while keeping Mintlify as the CMS:

```bash
npm install @mintlify/astro
```

Use case: teams that want full brand control but still benefit from Mintlify's editor and AI search. Only available on Enterprise plan ($600+/month).

## Deployment

Mintlify is managed-hosted. Connect your GitHub repo in the Mintlify dashboard. Pushes to the configured branch trigger an automatic deploy.

Custom domain: add `"api": "https://docs.example.com"` to `mint.json` and configure DNS.

## When NOT to choose Mintlify

- Budget is hard-capped below $300/month → use Starlight or Docusaurus (free, self-hosted).
- White-label or custom frontend required AND budget below $600/month → use Starlight.
- Team needs full data sovereignty / self-hosting → Mintlify is SaaS-only; use Docusaurus or MkDocs Material (despite maintenance mode).
