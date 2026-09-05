# Platform Selection — Knowledge Base Help Center

## Decision tree

Work through these filters top to bottom. A hard NO at any step eliminates the platform.

### Filter 1: Is this a developer-facing API documentation hub?

- **YES** → Prefer **ReadMe.com**. It is purpose-built for API-as-product documentation with OpenAPI sync, metrics, and developer portal features. General KB platforms are a poor fit. See `guides/09-readme-dev-hub.md`.
- **NO** → Continue.

### Filter 2: Does the team need parallel-version KB branches (e.g., v2.x docs live alongside v3.x)?

- **YES** → **Document360** is the only platform in 2026 with full branch versioning for parallel product releases. Shortlist it. Be aware: pricing is quote-only (see OQ-4 in `research/research-summary.md`). Confirm budget before proceeding.
- **NO** → Continue.

### Filter 3: Is AI deflection required Day 1?

- **NO** → Any platform works. Use the scoring matrix.
- **YES, and the budget is low** → **Help Scout Docs** (AI Answers at $0.75/resolution) or **Intercom Fin standalone** ($0.99/resolution, layerable over any platform). Intercom Fin can ingest external URLs and PDFs — it is no longer tied to Intercom Articles.
- **YES, and the team wants the most capable AI with MCP/agent integration** → **Document360** (Eddy AI + MCP server in Business+ tier).

### Filter 4: Are 50+ languages required?

- **YES** → **Document360** Business+ (50+ language auto-translate) or a platform + dedicated TMS (Phrase/Crowdin/Lokalise). See `guides/04-multi-language.md`.
- **NO** → Continue.

---

## Scoring matrix (use after hard filters)

Score each candidate 1-5 on each dimension. Highest total wins.

| Dimension | Weight | Help Scout Docs | Intercom Articles | Document360 | Zendesk Guide |
|---|---|---|---|---|---|
| AI deflection maturity | 3 | 3 | 4 | 5 | 3 |
| Search quality | 3 | 4 | 3 | 5 | 4 |
| Authoring UX (non-dev) | 2 | 5 | 4 | 4 | 4 |
| Versioning | 2 | 2 | 1 | 5 | 2 |
| Multi-language | 1 | 2 | 3 | 5 | 4 |
| Pricing transparency | 3 | 5 | 2 | 1 | 3 |
| MCP / AI-agent integration | 1 | 1 | 1 | 5 | 1 |

**Interpretation:**
- Document360 scores highest on capability but lowest on pricing transparency. Right for complex enterprise needs; wrong for teams that need self-serve evaluation.
- Help Scout Docs wins for SMBs with price sensitivity and non-developer authoring teams.
- Intercom Articles is only competitive when the team is already on Intercom and values the combined Messenger + Articles + Fin suite.

---

## Platform personas (quick match)

| Profile | Recommended platform | Why |
|---|---|---|
| Early-stage SaaS, <50 articles, email-first support | Help Scout Docs | Transparent pricing, Beacon widget, no per-article limits |
| In-product SaaS, chat-led support, 1K+ MRR | Intercom Articles + Fin standalone | Messenger home card, Fin deflection, 45-language Fin |
| Enterprise SaaS, 500+ articles, parallel versioning | Document360 | Branch versioning, Eddy AI, MCP server, RTL locale support |
| Developer API product, changelog-driven, Git-native | ReadMe.com | OpenAPI sync, GitHub AI Writer, `@readme/cli`, AI Agent |
| Call-center-adjacent, already on Zendesk Support | Zendesk Guide | Unified Zendesk workspace, Answer Bot, native ticket deflection |

---

## Pricing reality check (2026)

Source: `research/external/2026-05-20-helpscout-vs-intercom-cost-model.md`

**Worked example: 10-person team, 2,000 conversations/month**

| Platform | Monthly cost estimate |
|---|---|
| Help Scout (Plus) | ~$220/mo all-in |
| Intercom (Advanced) | $390-$990/mo before Fin fees |
| Intercom + 40% Fin deflection | +$800/mo Fin at $0.99/res |
| Document360 | Sales quote required |
| Zendesk Guide (Suite Growth) | ~$340/mo (per-agent) |

**Key insight:** Intercom's total cost is typically 2-4x Help Scout's at the same team size. The Fin standalone plan ($0.99/res with no Intercom subscription) is only cost-effective when used sparingly or when deflection rates exceed 50%.

---

## HelpJuice — data gap warning

No 2026 sources were found for HelpJuice in the research sweep. HelpJuice is positioned as a mid-market platform between Help Scout (SMB) and Document360 (enterprise). **Do not recommend HelpJuice without first checking https://helpjuice.com/whats-new for current AI deflection, versioning, and pricing status.** See `research/research-summary.md` OQ-1.

---

*Sources: `research/external/2026-05-20-helpscout-vs-intercom-cost-model.md`, `research/external/2026-05-20-document360-2026-features.md`, `research/external/2026-05-20-ai-deflection-patterns.md`.*
