---
source_url: https://llmstxt.org/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: ai-deflection
stinger: knowledge-base-help-center-stinger
---

# llms.txt Standard: AI Discoverability for Knowledge Bases (2026)

**Primary source:** llmstxt.org | **Secondary:** Presenc AI state-of-llms.txt report (April 2026), Search Engine Land (May 20, 2026)
**Retrieved:** 2026-05-20

## Summary

The `llms.txt` standard provides a plain-text file at the root domain that tells AI crawlers (ChatGPT, Perplexity, Claude, Copilot) what content is available for AI indexing, exclusions, and structure. Google added Lighthouse checks for llms.txt on May 20, 2026 (the day of this research), while simultaneously stating it is not required for Search rankings. The standard is growing in adoption and is a low-effort, high-impact addition to any KB setup.

## Key quotations / statistics

- **llms.txt file location:** `https://yourdomain.com/llms.txt` at the root of the help center domain.
- **Content format:** Markdown-style file listing available sections, article categories, and optionally specific URLs to include or exclude from AI indexing.
- **Adoption rate (April 2026, Presenc AI report):** ~48% of top-50 SaaS documentation sites have added `/llms.txt`. Adoption is accelerating.
- **Google Lighthouse (May 20, 2026):** Google added llms.txt validation checks to Chrome Lighthouse v13. Google statement: "You don't need llms.txt for Google Search rankings, but it helps AI assistants cite your content accurately."
- **Extended format `llms-full.txt`:** optional file that contains the full text of all KB articles in a single AI-consumable format. Recommended for smaller KBs (< 500 articles). Larger KBs should use the index-only `llms.txt` format.
- KB platforms with native llms.txt generation (as of May 2026): Mintlify (auto-generated), Docusaurus (plugin available), GitBook (manual). Help Scout Docs, Intercom Articles, Document360, and Zendesk Guide do NOT auto-generate - teams must add it manually via custom domain DNS and a static file.

## Implementation pattern for a typical KB

```text
# Example llms.txt for a SaaS help center
# Company: Acme Corp
# Help Center: https://help.acmecorp.com

# INCLUDE
/hc/en-us/categories/getting-started
/hc/en-us/categories/billing
/hc/en-us/categories/api-reference

# EXCLUDE (internal-only articles, redirect stubs)
/hc/en-us/articles/12345-internal-draft
/hc/en-us/articles/00001-redirects

# CONTACT
support@acmecorp.com
```

## Annotations for stinger-forge

- llms.txt belongs in `guides/02-ai-deflection.md` as a "Day 1 implementation" step - it takes 30 minutes and improves AI assistant citation accuracy for the KB.
- The fact that none of the major KB platforms (Help Scout, Intercom, Document360, Zendesk) auto-generate llms.txt is a significant gap. `stinger-forge` should include a concrete implementation script or template in `guides/02-ai-deflection.md`.
- The Google Lighthouse integration (May 20, 2026 - TODAY) makes this a forward-looking recommendation. Teams setting up a KB today should include llms.txt as a standard step; teams with existing KBs should add it in the next sprint.
- The llms-full.txt extended format is relevant for the AI deflection "chat-with-your-docs" endpoint pattern: instead of running a custom crawler, an AI agent can read `llms-full.txt` to ingest the entire KB in one request. This simplifies the ingestion pipeline for small KBs.
- Contradiction with SEO guidance: `seo-aeo-worker-bee` owns organic keyword strategy, but llms.txt is about AI assistant citation, not traditional search ranking. The boundary is clear: llms.txt = this Angel; meta tags and structured data = seo-aeo-worker-bee.
