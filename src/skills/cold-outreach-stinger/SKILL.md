---
name: cold-outreach-stinger
description: Outbound sales specialist for founders running cold email. Covers Apollo / Clay / Smartlead / Instantly / Lemlist tool selection, email deliverability and domain warmup, multi-touch sequence design (3-5 steps), AI personalization without slop (Clay Claygent SKIP rule), reply classification and disqualification, and list hygiene. Use when the user says "set up cold outreach", "my cold email is landing in spam", "write a cold email sequence", "set up Clay personalization", "Apollo vs Instantly", "my reply rate is below 2%", "cold email warmup", "build a list in Apollo", or when cold-outreach-worker-bee is invoked. Do NOT use for inbound SDR workflows, CRM architecture (db-worker-bee), AE discovery call scripts, paid acquisition, or LinkedIn content strategy.
license: MIT
---

# cold-outreach-stinger

Opinionated cold outreach playbook for founder-led B2B sales. Encodes the decisions, diagnostics, and templates that separate 3%+ reply rates from landing in spam.

**Read first:** `guides/00-principles.md` -- the six non-negotiables that govern every engagement. If you violate these, no amount of copy optimization will help.

**Then orient by task:**

| Task | Start here |
|---|---|
| "Which tools should I use?" | `guides/01-tool-decision-matrix.md` |
| "My emails land in spam" / deliverability fix | `guides/02-infrastructure-and-deliverability.md` |
| "Write me a cold sequence" / sequence audit | `guides/03-sequence-design.md` |
| "Set up Clay personalization" | `guides/04-clay-personalization.md` |
| "Clean my list" / ICP definition | `guides/05-list-hygiene.md` |
| "Handle replies" / disqualification | `guides/06-reply-handling.md` |
| "Something broke" / reply rate dropped | `guides/07-diagnostics.md` |

---

## Critical directives (non-negotiables)

These are the guardrails that govern every cold-outreach-worker-bee engagement. They are explained fully in `guides/00-principles.md`.

1. **Deliverability before copy.** Infrastructure problems make perfect copy irrelevant. Assess SPF/DKIM/DMARC, warmup status, and sending reputation before touching email text.

2. **Separate sending domains are non-negotiable.** The main company domain is never used for cold outreach. If the user is sending from `acme.com`, stop and fix this before anything else. Deliverability damage to the primary domain is irreversible without full domain rotation.

3. **AI personalization must pass the 1-in-1000 test.** Any AI-generated opener that would be true for the majority of the list is slop. The Clay Claygent SKIP rule is the operational implementation: if no specific data is found, return "SKIP" rather than generate a generic line. (See `research/external/2026-05-20-clay-claygent-personalization-anti-slop.md`)

4. **Never recommend more than 5 steps for cold SMB sequences.** Data shows 3-step sequences generate the highest per-sequence reply rate (9.2%). Steps 6+ produce near-zero positive replies and burn sender reputation. (See `research/external/2026-05-20-cold-email-sequence-length-benchmarks.md`)

5. **Reply rate is the canonical metric.** Open rates are manipulated by Apple MPP and are not a reliable KPI since 2021. The canonical measure is reply rate: positive replies / emails sent. Benchmark: >2% = functional, 3.43% = industry average, 10%+ = elite. (See `research/external/2026-05-20-cold-email-reply-rate-benchmarks-2026.md`)

6. **Flag EU/GDPR cold outreach risks explicitly.** Cold email to EU prospects without legitimate interest documentation is non-compliant. Surface this explicitly and route to `security-worker-bee` for audit. Never provide legal advice; flag and hand off.

---

## The five primary workflows

### 1. Infrastructure and deliverability setup

**Entry point:** `guides/02-infrastructure-and-deliverability.md`

Key facts from research:
- Google permanent 550 rejections went live November 2025 (not temporary deferrals anymore). (See `research/external/2026-05-20-cold-email-deliverability-2026-rules.md`)
- Google Postmaster Tools v2 (October 2025): binary Pass/Fail reputation scoring, replacing gradient.
- Required: SPF + DKIM (2048-bit key) + DMARC (minimum `p=none`, recommended `p=quarantine`).
- Safe volume: 50-100 emails/mailbox/day. Scale horizontally (more mailboxes) not vertically (more sends per mailbox).
- Warmup: 4 weeks minimum. Key warmup metric is reply rate during warmup, not volume.

Use `templates/deliverability-audit-checklist.md` to run the audit before touching sequence or copy.

### 2. Sequence design

**Entry point:** `guides/03-sequence-design.md`

Key facts from research:
- Optimal sequence: 3-5 steps (SMB = 3-4, mid-market = 5-7). (See `research/external/2026-05-20-cold-email-sequence-length-benchmarks.md`)
- Under 80 words per email. (See `research/external/2026-05-20-cold-email-reply-rate-benchmarks-2026.md`)
- Peak timing: Wednesday, 7-11 AM recipient local time; Tuesday-Thursday window. (See `research/external/2026-05-20-b2b-cold-email-sequence-build.md`)
- Step 2 should read like a reply, not a reminder.
- One CTA per email. No two asks in one message.
- Multi-channel rule: email accounts for 50% or less of total touchpoints in a full sequence.

Use `templates/sequence-5-step.md` as the scaffold.

### 3. Clay AI personalization

**Entry point:** `guides/04-clay-personalization.md`

Key facts from research:
- Clay Claygent throughput: 500+ contacts/hour at $0.02-0.05 per personalized line. (See `research/external/2026-05-20-clay-claygent-personalization-anti-slop.md`)
- SKIP rule: prompt Claygent to return "SKIP" if it cannot find a specific, genuine insight. Never generate a generic line.
- Opener constraints: 25 words max, no forbidden phrases ("I noticed", "impressive", "exciting").
- Personalization lift: 1.5-2x reply rate vs template personalization with Claygent.
- Signal triggers worth building campaigns around: job change (VP roles = 3x higher buy probability in 90 days), funding events, tech stack change, open job postings. (See `research/external/2026-05-20-clay-signal-based-prospecting.md`)
- Recommended email waterfall: Prospeo → Hunter → Apollo (3 providers + MX validation = 70-85% coverage). (See `research/external/2026-05-20-clay-ai-personalization-workflow.md`)

Use `templates/clay-waterfall-formula.md` as the starting formula.

### 4. List hygiene

**Entry point:** `guides/05-list-hygiene.md`

Key facts from research:
- ZeroBounce: best accuracy (1.8% actual bounce after verification), $0.80/1K contacts. (See `research/external/2026-05-20-email-verification-zerobounce-neverbounce.md`)
- NeverBounce: best balance of accuracy + price, $1.00/1K.
- Catch-all domains: remove entirely from cold email lists. Risk outweighs coverage.
- List decay: 25% per year. Re-verify every 6 months minimum.
- EU/GDPR: flag explicitly; route to `security-worker-bee` for compliance audit.

Use `templates/icp-definition-worksheet.md` before building the list.

### 5. Tool selection

**Entry point:** `guides/01-tool-decision-matrix.md`

Recommended 2026 founder stacks:
- **Apollo + Instantly:** email-only, volume-first, budget-conscious. (See `research/external/2026-05-20-apollo-vs-lemlist-tool-decision.md`)
- **Apollo + Lemlist:** high-personalization craft, LinkedIn steps, image personalization.
- **Apollo + Smartlead:** agency or multi-channel (email + LinkedIn + SMS).
- **Smartlead standalone:** agency managing multiple clients with full multi-channel.

Critical rule: Apollo does NOT run email warmup. Always pair with a sending platform that does.

---

## Open questions (flagged from research)

> TODO: Clay's current AI model backend is abstracted through Claygent. Verify current model options at docs.clay.com before advising on model selection. See `research/research-summary.md` open question 1.

> TODO: Instantly pricing discrepancy ($30 vs $37.6 vs $47/mo for Growth plan across sources). Always verify current pricing at instantly.ai before recommending. Do not hard-code pricing figures. See `research/research-summary.md` open question 2.

> TODO: Microsoft Outlook bulk sender rules (May 2025) were referenced in multiple sources but not scraped directly. The deliverability guide covers Google; Microsoft rules require a targeted follow-up search before the guide can claim comprehensive coverage. See `research/research-summary.md` open question 3.

---

## Cross-Angel handoffs

| Domain | Route to |
|---|---|
| CRM schema (lead status, sequence tracking fields) | `db-worker-bee` |
| GDPR / EU compliance, lawful basis for cold contact | `security-worker-bee` |
| GTM strategy, ICP definition, target market | `library-worker-bee` (PRD) |
| AE discovery call scripts, demo process | out of scope (no peer Angel) |

---

*Forged from `ai-tools/command-briefs/cold-outreach-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
