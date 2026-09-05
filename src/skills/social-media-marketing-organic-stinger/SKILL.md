---
name: social-media-marketing-organic-stinger
description: Genuine organic social strategy for solo developers, founders, and teams up to ~10 people. No AI-generated posts, no cross-post automation slop, no bought followers. Covers platform selection (LinkedIn / X / Threads / Bluesky), founder-led authentic voice, build-in-public discipline, realistic content calendars, and growth expectations grounded in 2026 benchmarks. Invoke when the user says "help me with social media", "organic growth strategy", "which platform should I post on", "I want to build in public", "my social is inconsistent", "I need a content calendar", "AI slop is hurting my brand", or "how do I grow authentically". Do NOT invoke for paid advertising (no Angel yet), email newsletter strategy (newsletter-platform-worker-bee), SEO content strategy (seo-aeo-worker-bee), or Discord/Slack community management (out of scope).
---

# Social Media Marketing Organic Stinger

Equips `social-media-marketing-organic-worker-bee` to deliver authentic, platform-native, founder-led social media strategy.

This stinger has one north star: the founder's genuine human voice, published consistently on the platforms where their specific audience lives, without automation or AI substituting for that voice. It is calibrated for resource-constrained solo founders and small teams who need a strategy they can actually sustain — not a playbook written for a 5-person content team.

---

## Critical directives (the non-negotiables)

These are not preferences. Every engagement must apply them.

- **Never recommend AI-generated post content.** The Angel's entire value proposition is authentic founder voice. AI-generated posts are the exact anti-pattern it exists to replace. See `guides/00-principles.md`.
- **Never recommend cross-posting identical content to every platform.** Platform-native content performs 3-5x better. Cross-posting signals inauthenticity to algorithms and audiences. See `guides/02-platform-selection.md`.
- **Never recommend buying followers, engagement pods, or automation bots.** 37.2% of influencer accounts show fraudulent activity (SociaVault 2026). Vanity metrics destroy the engagement rate that matters for actual business outcomes. See `guides/00-principles.md`.
- **Always ground growth expectations in 2026 benchmarks.** Founders with unrealistic expectations quit after 60 days. See `guides/07-growth-benchmarks.md`.
- **Always ask for the founder's real available time before producing a calendar.** A calendar the founder cannot maintain is worse than no calendar. See `guides/06-content-calendar.md`.
- **Refuse vague requests for "going viral."** Virality is an outcome, not a strategy. Redirect every viral-seeking question toward audience specificity and consistency.

---

## Routing table

| User request | Primary guide | Secondary |
|---|---|---|
| "Audit my social presence" | `guides/01-anti-pattern-catalog.md` | `guides/05-authenticity-checklist.md` |
| "Which platform should I focus on?" | `guides/02-platform-selection.md` | `guides/07-growth-benchmarks.md` |
| "Help me find my voice" | `guides/03-founder-voice.md` | `guides/05-authenticity-checklist.md` |
| "I want to build in public" | `guides/04-build-in-public.md` | `guides/06-content-calendar.md` |
| "Write me some sample posts" | `guides/05-authenticity-checklist.md` | `guides/03-founder-voice.md` |
| "Create a content calendar" | `guides/06-content-calendar.md` | `guides/02-platform-selection.md` |
| "How fast should I expect to grow?" | `guides/07-growth-benchmarks.md` | `guides/08-engagement-strategy.md` |
| "How do I engage without being spammy?" | `guides/08-engagement-strategy.md` | `guides/04-build-in-public.md` |
| "What am I doing wrong?" | `guides/01-anti-pattern-catalog.md` | `guides/05-authenticity-checklist.md` |

---

## Standard engagement sequence

For most founder social media engagements, follow this order:

1. **Classify the request** using the routing table above.
2. **Check for anti-patterns first.** If the founder has existing content, run the anti-pattern audit before strategy. A great strategy on top of a slop foundation wastes everyone's time. See `guides/01-anti-pattern-catalog.md`.
3. **Platform select before calendar.** You cannot build a realistic calendar without knowing which platform's posting cadence the founder must sustain. One or two platforms maximum for resource-constrained founders. See `guides/02-platform-selection.md`.
4. **Voice before copy.** The content calendar and sample posts are meaningless unless they match the founder's authentic register. Do the voice exercise first. See `guides/03-founder-voice.md`.
5. **Calendar with real bandwidth.** Ask the honest time question. Default to 3 posts/week. Scale only when the founder has demonstrated 30-day consistency. See `guides/06-content-calendar.md`.
6. **Set growth expectations.** End every strategic session with a 90-day and 12-month realistic trajectory. See `guides/07-growth-benchmarks.md`.

---

## Folder layout

```
social-media-marketing-organic-stinger/
+- SKILL.md                          (this file)
+- README.md                         (one-page human overview)
+- guides/
|  +- 00-principles.md               (authenticity-first philosophy, non-negotiables)
|  +- 01-anti-pattern-catalog.md     (ten common organic social anti-patterns with before/after)
|  +- 02-platform-selection.md       (LinkedIn / X / Threads / Bluesky platform-fit rubric)
|  +- 03-founder-voice.md            (voice-finding exercise and register translation)
|  +- 04-build-in-public.md          (BIP content types, cadence, and what not to share)
|  +- 05-authenticity-checklist.md   (12-point post checklist before publishing)
|  +- 06-content-calendar.md         (3-post/week default, post-type archetypes, bandwidth adaptation)
|  +- 07-growth-benchmarks.md        (2026 per-platform ER benchmarks, 90-day/12-month trajectories)
|  +- 08-engagement-strategy.md      (give-more-than-you-take model, reply strategy, DM discipline)
+- examples/
|  +- founder-audit-walkthrough.md   (full anti-pattern audit + remediation for a hypothetical founder)
|  +- content-calendar-solo-dev.md   (4-week calendar for a solo developer on LinkedIn + Bluesky)
+- templates/
|  +- social-audit-report.md         (template for delivering a social presence audit)
|  +- content-calendar-4-week.md     (4-week calendar scaffold with post-type placeholders)
|  +- authenticity-checklist.md      (portable 12-point checklist for post review)
|  +- growth-expectations-summary.md (90-day + 12-month trajectory template for founder handoff)
+- reports/
|  +- README.md                      (how past audit reports accumulate in this folder)
+- research/
   +- research-summary.md            (executive summary, 5 most influential sources, open questions)
   +- index.md                       (manifest of all 12 source files)
   +- research-plan.md               (depth tier, queries, time window)
   +- external/                      (9 external source notes)
   +- internal/                      (3 internal source notes)
```

---

## Scope boundaries

This stinger explicitly ends at these handoff surfaces:

| When this comes up | Handoff |
|---|---|
| Email newsletter setup and growth | `newsletter-platform-worker-bee` |
| Search-driven content strategy (blog posts, landing pages) | `seo-aeo-worker-bee` |
| Paid social advertising | No Angel yet — flag explicitly |
| Community management inside Discord/Slack | Out of scope — flag explicitly |
| Brand/visual design for social assets | `design-system-worker-bee` or `ux-ui-worker-bee` |
| Teams > 10 people or dedicated social media roles | Out of scope — flag and recommend agency tooling |

---

*Forged by `stinger-forge` from `social-media-marketing-organic-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory.*
