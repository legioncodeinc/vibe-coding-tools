---
source_url: https://checkthat.ai/brands/mintlify/pricing
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: mintlify
stinger: docs-site-stinger
---

# Mintlify Pricing 2026: Plans, Costs & Hidden Fees

## Summary

Mintlify uses a three-tier model. Hobby (free) is for individuals but has no AI features, no team collaboration, no password protection, and no preview deployments. Pro costs $300/month (base) with 5 seats + $20/seat for overages. Enterprise starts at $600+/month custom. A critical finding: **neither Hobby nor Pro allows branding removal** - white-labeling and custom CSS/JS injection are Enterprise-only. Pro adds AI Assistant (250 msgs/month), preview deployments, and password protection. AI overage rates are not publicly disclosed.

## Key quotations / statistics

- Hobby: $0/month - "1 user, 1 site, custom domain, no AI features, no team collaboration, no password protection, no preview deployments"
- Pro: "$300/month - 5 seats included (+$20/seat), AI Assistant (250 msgs/mo), preview deployments, password protection, real-time co-editing"
- Enterprise: "$600+/month (custom) - Unlimited seats, SSO/SAML, branding removal, dedicated support, 99.99% SLA"
- "Neither Hobby nor Pro tiers offer branding customization; both maintain Mintlify branding that cannot be removed"
- "Overage charges apply after limit but per-message rates not publicly disclosed" (AI Assistant)
- "Seat scaling at $20/month per additional user and AI overages can push costs 50% higher than the sticker price"

## Annotations for stinger-forge

- **CRITICAL trade-off for `guides/05-mintlify.md`**: Pro at $300/month sounds reasonable for small teams, but AI overage opacity and mandatory Enterprise for any white-labeling is a hidden cost trap. Name this explicitly in the platform decision tree (`guides/00-platform-selection.md`).
- The Pro tier is positioned for "5-20 people" teams - this is the key sweet spot for SaaS companies needing fast docs without infrastructure burden.
- Enterprise self-hosting (headless Astro, see separate source) requires Enterprise tier - document this alongside the managed vs self-hosted decision.
- Compare against: Docusaurus (free self-hosted), GitBook ($65/site/month Premium), to complete the decision matrix.
