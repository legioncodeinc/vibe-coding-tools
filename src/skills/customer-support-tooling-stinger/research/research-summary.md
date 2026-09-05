---
depth_consumed: normal
time_window: 2025-11-20 to 2026-05-20
files_written: 13
angel: customer-support-tooling-worker-bee
stinger: customer-support-tooling-stinger
summarized: 2026-05-20
---

# Research Summary — customer-support-tooling-stinger

## Coverage overview

| Subfolder | Files |
|---|---|
| `research/` root | 3 (research-plan.md, research-summary.md, index.md) |
| `research/external/` | 10 source notes |

All 5 backlog queries were resolved with primary sources. No query returned fewer than 2 usable sources.

## 5 most influential sources

1. **Plain official docs (plain.com/docs)** — Definitive reference for Plain's API-first architecture, Slack Connect inbox, and pricing tiers. Establishes Plain as the canonical developer-first choice for B2B SaaS with < 5K tickets/month.

2. **Intercom Fin AI product page and May 2026 rebrand announcement** — Fin was rebranded from "Fin AI Copilot" to simply "Fin" in May 2026. Resolution rate benchmarks: 67% average across Intercom customers; outcome-based pricing at $0.99/resolved conversation (Fin 2.0 model). Critical for the AI-deflection guide.

3. **Help Scout contact-based pricing pivot (2025)** — Help Scout moved from seat-based to contact-based pricing in 2025, significantly changing the cost profile for growing teams. This dramatically affects the tool-selection comparison matrix for SMB products.

4. **Runbear Slack-to-Linear integration documentation** — Documents the bi-directional sync pattern: Slack thread → ticket creation in Plain/Intercom → Linear issue auto-creation on escalation. The canonical middleware pattern for developer-first support stacks.

5. **Pylon official site and G2 comparison (2026)** — Pylon targets B2B SaaS companies managing customer relationships through Slack Connect. Strong on shared Slack channels as primary support surface; weaker than Plain on API quality and Linear integration depth.

## 5 open questions (flagged for stinger-forge)

1. **Plain pricing at scale**: Plain's public pricing page is gated behind a signup form for companies > 200 seats. The per-ticket pricing for enterprise tiers is unclear without a sales conversation.

2. **Pylon's native AI depth**: Pylon documents a "Pylon AI" feature but benchmark resolution rates are not publicly available. The deflection guide should treat Pylon AI as unverified until practitioner data emerges.

3. **ClearFeed / Unthread / Thena coverage gap**: These three Slack-native support tools (which route Slack channels into a shared inbox) were not deeply covered in the primary sources. A follow-on shallow scripture-historian run targeting "ClearFeed Unthread Thena Slack support 2026" is recommended.

4. **Notion integration pattern**: The backlog entry mentioned Notion as an integration target but no primary sources document a canonical Notion-to-support-tool sync pattern. The integration guide should treat Notion as a knowledge-base surfacing target (via Plain's Notes API or Intercom's Articles) rather than a bidirectional sync.

5. **Intercom outcome-based pricing caps**: The $0.99/resolved conversation model has an undocumented behavior at high volume (> 10K resolutions/month). The AI-deflection guide should flag this as a cost-ceiling risk for high-volume B2C products.

## Sources to re-fetch

- Plain pricing page (re-fetch after signup to capture enterprise tier)
- Pylon AI resolution rate benchmarks (watch for blog posts Q3 2026)
- G2 comparison tables (quarterly refresh recommended)
