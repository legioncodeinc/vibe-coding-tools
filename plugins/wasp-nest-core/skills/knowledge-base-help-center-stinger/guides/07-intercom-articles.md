# Intercom Articles — Platform Guide

## Profile

**Best for:** In-product SaaS journeys where Messenger, Articles, and Fin AI are bundled in one workspace. Most valuable when the team is already paying for Intercom.

**AI deflection:** Fin ($0.99/resolution). **Fin now has a standalone plan — no Intercom subscription required.** Fin reads Intercom Articles + external URLs + PDFs.

**Versioning:** No versioning support. All content is "current."

**Multi-language:** Fin responds in 45 languages. Articles: manual TMS workflow (no native multi-locale portal routing).

**Pricing:** Per-seat ($) + per-resolution Fin fee ($$). Opaque total; 2-4x Help Scout at equivalent team size for most SMBs.

Source: `research/external/2026-05-20-ai-deflection-patterns.md`

---

## Fin standalone plan — the key 2026 change

As of 2026, Intercom Fin is available as a standalone product with no Intercom Messenger seat requirement. This means:
- Teams on Zendesk, Help Scout, or any other platform can use Fin's AI deflection without switching KB platform.
- Cost: $0.99 per resolved conversation. A "resolved" conversation is one where the user did not escalate to a human after Fin's response.

**When to use Fin standalone vs bundled:**
- Use **Fin bundled** (within Intercom) when the team already uses Intercom Messenger and Articles.
- Use **Fin standalone** when the team wants AI deflection but does not want to migrate to Intercom Articles. See `guides/02-ai-deflection.md` Pattern B.

---

## Setting up Fin knowledge sources

Source: `research/research-summary.md` OQ-5

Fin reads knowledge from three source types:
1. **Intercom Articles** — natively connected; no additional setup.
2. **External URLs** — add any public URL (docs site, marketing pages); Fin crawls and indexes.
3. **Uploaded PDFs** — upload product manuals, release notes, or support playbooks.

**Configuration:** Intercom Settings → AI → Fin → Knowledge Sources → Add source.

> **Warning:** Specific steps for connecting Fin to a non-Intercom Articles knowledge base were not fully resolved in the research sweep (see OQ-5). Verify the current workflow at https://fin.ai/docs before implementing.

---

## Messenger Home configuration for KB deflection

Intercom Messenger's Home screen can surface relevant KB articles before the user types a message:

1. Settings → Messenger → Home → Add a block.
2. Select "Recent articles" or "Search docs" block.
3. Set article collection to the most relevant (e.g., "Getting Started" for new users).

This reduces incoming tickets for common setup questions without requiring the user to navigate to the KB.

---

## Intercom Articles search tips

- Enable "Instant Answers" in the Articles settings — surfaces articles as the user types in the search box.
- Use the "Reactions" feature (article ratings) to surface poorly-rated articles in the content triage.
- Tag articles by "persona" or "plan tier" to configure Fin to show different articles to different user segments.

---

## Known limitations

- No article versioning or branching.
- No native multi-locale portal routing (all locales share the same portal URL).
- Fin knowledge source setup for external URLs is not fully self-documented as of May 2026 (see OQ-5 in `research/research-summary.md`).
- Per-resolution Fin pricing can spike unexpectedly for high-traffic products.

---

*Sources: `research/external/2026-05-20-ai-deflection-patterns.md`, `research/external/2026-05-20-helpscout-vs-intercom-cost-model.md`.*
