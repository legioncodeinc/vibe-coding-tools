---
source_url: internal://research-synthesis
retrieved_on: 2026-05-20
source_type: internal
authority: official
relevance: critical
topic: platform-selection
stinger: docs-site-stinger
---

# Platform Comparison Matrix (May 2026)

## Summary

Synthesized comparison of all seven platforms based on research collected in this sweep. Intended as the seed data for `guides/00-platform-selection.md`.

## Comparison table

| Platform | Cost | Hosting | Primary Use Case | 2026 Status | Self-host? | Search | AI Features |
|---|---|---|---|---|---|---|---|
| Docusaurus v3 | Free | Self | React-native OSS/commercial docs | v3.10 last v3; v4 coming | Yes | Algolia/pagefind | No built-in |
| Mintlify | $0 / $300 / $600+ per month | Managed (or Enterprise headless) | AI-native managed docs, API portals | Active, strong 2026 momentum | Enterprise only (Astro headless) | AI Search (built-in) | Yes (AI Assistant, Writing Agent, MCP) |
| GitBook | $0 / $65 / $249+ per site/month | Managed | Block-editor docs, non-technical contributors | Active, per-site pricing (2026 change) | No | AI Search (Premium+) | Yes (Ultimate+) |
| MkDocs Material | Free | Self | Python ecosystem docs | **MAINTENANCE MODE since Nov 2025** | Yes | Built-in + Algolia plugin | No |
| Nextra v4 | Free | Self (Next.js) | Next.js-native docs, co-located | v4 current (App Router) | Yes | Pagefind (built-in) | No |
| Starlight (Astro) | Free | Self | Greenfield docs, Astro-native | v0.38.x, 200K+ weekly npm downloads | Yes | Built-in (Pagefind-based) | No |
| Fern | Commercial (contact) | Managed + self-host SDK gen | API-first docs + SDK distribution | Active, MCP server auto-gen (2026) | SDK gen self-host | AI Search (built-in) | Yes (AI Search, MCP, llms.txt) |

## Selection guidance (synthesized)

**Choose Mintlify when:**
- You want fast time-to-production (< 1 day)
- You need built-in AI Assistant for users without extra integration
- Budget is not the primary constraint
- You don't need deep customization (or are on Enterprise)

**Choose Docusaurus v3/v4 when:**
- You want the largest plugin ecosystem (React-based)
- You need versioning for multiple doc versions
- You're React-native and comfortable with JSX/MDX customization
- OSS project with Algolia DocSearch qualification

**Choose Starlight when:**
- Starting a greenfield docs site in 2026 and not locked to React
- You want Astro performance + framework-agnostic component support
- You don't need versioning (Starlight versioning is less mature)

**Choose GitBook when:**
- Non-technical contributors need to write docs (block editor)
- You need a quick start with minimal dev involvement
- Budget is <$65/month per site

**Choose MkDocs Material when:**
- Team is Python-native (existing mkdocs.yml investment)
- You have an existing MkDocs site and don't want to migrate
- **Caveat: Do NOT start new projects on MkDocs Material in 2026** (maintenance mode)

**Choose Nextra when:**
- Team is already on Next.js and docs need to co-locate with the app
- You want static docs export with Next.js App Router patterns

**Choose Fern when:**
- Primary output is API reference documentation + multi-language SDKs
- You want docs and SDKs from the same spec (zero drift)
- You need MCP server auto-generation from your API spec

## Annotations for stinger-forge
- This matrix is the core content of `guides/00-platform-selection.md`
- Add a "cost at 10-person team" column to make the Pro-tier pricing tangible
- The MkDocs maintenance mode should be in a RED warning box in the guide
