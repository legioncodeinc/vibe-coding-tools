---
source_url: https://www.eesel.ai/blog/zendesk-guide-locale-and-translations
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: medium
topic: multi-language
stinger: knowledge-base-help-center-stinger
---

# Zendesk Guide Locale Routing and Translation Setup (2025-2026)

**Published:** August 1, 2025 | **Source:** eesel.ai Blog

## Summary

Comprehensive step-by-step guide to Zendesk Guide's multilingual setup including locale configuration, mandatory content hierarchy, locale-based URL routing, and three translation approaches with pricing. Relevant for `guides/04-multi-language.md` and a supplemental reference for `guides/00-platform-selection.md`'s Zendesk Guide entry.

## Key quotations / statistics

**Zendesk Guide locale URL pattern:**
- Path-based locale codes: `/hc/en-us/`, `/hc/fr/`, `/hc/de/` etc.
- Categories → Sections → Articles hierarchy must be created in the **parent/default language first** before adding translations (mandatory content ordering).

**Three translation approaches benchmarked:**

| Approach | Cost | Quality | Speed |
|---|---|---|---|
| Zendesk Copilot built-in AI translation | $50/agent/month | Good (AI) | Fast |
| Third-party TMS (Crowdin $50/mo, Lokalise $144/mo, Phrase $1,045/mo) | Varies | High (MT + human review) | Medium |
| Fully manual translation | High (human time) | Highest | Slow |

- Dynamic content (system messages, email notification templates) requires separate translation outside the article workflow.
- Zendesk Copilot's AI translation covers the article body but NOT: meta descriptions, category names, or section names (those need manual translation or TMS).
- RTL languages (Arabic, Hebrew) are natively supported by Zendesk Guide UI; requires RTL CSS toggle in the theme.

## Annotations for stinger-forge

- The mandatory parent-before-child hierarchy in Zendesk Guide is a common migration pitfall: teams importing content from another platform (e.g., Help Scout to Zendesk) must create the category/section structure in the default language before importing articles. Include as a migration warning in `guides/00-platform-selection.md`.
- Zendesk Copilot AI translation ($50/agent/month) is the simplest path for teams already on Zendesk - it handles the bulk of article translation inside the platform without a separate TMS. For teams needing > 10 languages or > 500 articles, the TMS path is more economical.
- The gap between Copilot AI translation and TMS integration (Zendesk does NOT auto-sync category/section names or meta descriptions) is a workflow complexity the stinger should flag: "native AI translation covers article body; full multilingual setup still requires manual work on navigation elements."
- Dynamic content translation (email notifications in the user's language) is often overlooked in KB localization projects. Include as a checklist item in `templates/kb-setup-checklist.md`.
