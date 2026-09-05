---
source_url: https://www.mintlify.com/blog/custom-frontends-on-mintlify
retrieved_on: 2026-05-20
source_type: blog
authority: official
relevance: high
topic: mintlify
stinger: docs-site-stinger
---

# Your docs, your frontend, our content engine (February 2026)

## Summary

Mintlify announced headless mode for enterprise customers in February 2026. Enterprise teams can now build their own custom Astro frontend while keeping Mintlify's content engine, AI features, and editor behind the scenes. The open-source starter kit (`mintlify-astro-starter`) provides a template. The `@mintlify/astro` integration reads `docs.json` and MDX content at build time and processes into Astro-renderable format. AI-powered search and assistant still function in headless mode. Auth, API Playground, User Feedback, Web Editor, and Preview Deployments are NOT available in headless mode. Headless is Enterprise-only.

## Key quotations / statistics

- "Today, enterprise teams can now build and own their documentation frontend while keeping Mintlify's content engine, AI features, and editor behind the scenes." (Feb 19, 2026)
- "Host the frontend on your own infrastructure, behind your own firewall, under your own access controls. Mintlify's content engine, search, and AI chat still work. No vendor-hosted pages required."
- Features NOT available in headless: Web editor, Authentication/password protection, API playground, User feedback, Preview deployments, PDF export
- "Custom frontends are available now for enterprise teams"
- Open-source starter: `mintlify-astro-starter`

## Annotations for stinger-forge

- This is a major 2026 shift that changes the managed vs self-hosted calculus for Mintlify. Previously it was all-or-nothing managed; now Enterprise can self-host the frontend.
- The headless approach uses Astro (same framework as Starlight) - create a note in `guides/05-mintlify.md` and `guides/07-starlight.md` linking these.
- The loss of API Playground and Auth in headless is a significant limitation - document clearly in the decision tree as a reason to stay on managed or move to Fern for API-first docs.
- This source should inform the "vendor lock-in" trade-off note in `guides/00-platform-selection.md`.
