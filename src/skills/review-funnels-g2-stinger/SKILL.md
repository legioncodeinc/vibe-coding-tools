---
name: review-funnels-g2-stinger
description: Review collection and online-reputation specialist for SaaS products -- G2, Capterra (now G2-owned), Trustpilot, Product Hunt, AppSumo, and Software Advice. Covers platform selection, profile setup, in-product review-request UX (timing, two-step pattern, copy), G2 incentive compliance (2026 rules + FTC Consumer Reviews Rule), Product Hunt launch-day playbook (00:01 PT, first-6-hours intensity, hunter sourcing), negative-review response templates, and earned-badge-as-conversion-asset deployment. Use when the user says "set up G2", "get more reviews", "Product Hunt launch", "is this incentive compliant", "respond to a negative review", "deploy G2 badges", "Capterra strategy", or asks anything about online review platforms for a SaaS product. Do NOT use for SEO structured data (seo-aeo-worker-bee), outbound cold-email infrastructure beyond a review-request drip (cold-outreach-worker-bee), or social amplification of reviews (social-media-marketing-organic-worker-bee).
---

# review-funnels-g2-stinger

The procedural arsenal for `review-funnels-g2-worker-bee`. This Stinger encodes the full review-collection and reputation-management lifecycle for SaaS products, grounded in 2026 platform policies and practitioner-level research.

**Paired Angel:** `ai-tools/agents/review-funnels-g2-worker-bee.md`
**Command Brief:** `ai-tools/command-briefs/review-funnels-g2-worker-bee-command-brief.md`
**Research:** `ai-tools/skills/review-funnels-g2-stinger/research/` (populated 2026-05-20 by scripture-historian)

---

## Critical 2026 Context

Before reading any guide, internalize these four structural changes that invalidate older advice:

1. **G2 acquired Capterra (February 5, 2026).** G2 now owns Capterra, Software Advice, and GetApp. "Diversify across G2 and Capterra" is obsolete -- they are the same company. Strategy must be built around one G2-family account. See `research/external/2026-05-20-g2-capterra-acquisition-consolidation.md`.

2. **G2 badge policy changed (Summer 2025).** Category Leader and High Performer badges now require a paid G2 Marketing Solutions subscription (~$2,999+/year). Free profiles can only display the "Users Love Us" badge (20 reviews, 4.0+ rating minimum). See `research/external/2026-05-20-g2-badges-social-proof-conversion.md`.

3. **FTC Consumer Reviews and Testimonials Rule took effect October 21, 2024.** Conditioning an incentive on positive sentiment is a civil-penalty violation. Disclosure is required for all incentivized reviews. See `research/external/2026-05-20-ftc-endorsement-guidelines-reviews.md`.

4. **AI citation gate.** Review platform presence (G2 rating, Trustpilot score) is now a prerequisite for AI assistant citations (ChatGPT, Gemini, Perplexity product queries). Platform prioritization should factor in AI citation surface area.

---

## Folder structure

```text
review-funnels-g2-stinger/
+- SKILL.md                              (this file)
+- README.md                             (one-page overview)
+- guides/
|  +- 00-principles.md                   (policy-first principle, happiness-check-first, badge hierarchy)
|  +- 01-platform-selection.md           (G2 vs Trustpilot vs PH vs AppSumo decision matrix)
|  +- 02-g2-incentive-policy.md          (G2 rules, FTC rule, disclosure language)
|  +- 03-review-request-ux.md            (two-step pattern, trigger timing, channel mix)
|  +- 04-product-hunt-launch.md          (00:01 PT, first-6-hours, hunter sourcing, day-of timeline)
|  +- 05-negative-review-response.md     (acknowledge/clarify/resolve/close framework)
|  +- 06-badge-deployment.md             (badge taxonomy, embed specs, conversion placement)
+- examples/
|  +- happy-path-g2-review-funnel.md     (end-to-end from 0 reviews to Leader badge)
|  +- product-hunt-launch-day.md         (hour-by-hour execution of a PH launch day)
+- templates/
|  +- review-request-email.md            (three email variants: milestone, NPS promoter, renewal)
|  +- negative-review-response.md        (fill-in-the-blank by star-rating band)
|  +- product-hunt-launch-timeline.md    (30/14/7/3/1 day + day-of hour-by-hour checklist)
+- reports/
|  +- README.md                          (how reputation audit reports accumulate)
+- research/                             (DO NOT MODIFY -- owned by scripture-historian)
```

---

## Seven actions this Stinger supports

Each action maps to a guide:

| Action | Guide |
|--------|-------|
| Platform audit and recommendation | `guides/01-platform-selection.md` |
| Profile setup checklist | `guides/01-platform-selection.md` (§ Profile setup) |
| Review-request UX design | `guides/03-review-request-ux.md` |
| Incentive-compliance audit | `guides/02-g2-incentive-policy.md` |
| Product Hunt launch playbook | `guides/04-product-hunt-launch.md` |
| Negative-review response | `guides/05-negative-review-response.md` |
| Badge deployment spec | `guides/06-badge-deployment.md` |

---

## First action when this Stinger is loaded

1. Read `guides/00-principles.md` for the non-negotiables.
2. Identify which of the seven actions the user is asking for.
3. Read the corresponding guide.
4. If copy or a structured output is needed, open the relevant template under `templates/`.
5. Check `research/research-summary.md` for any open questions that might affect the advice being given.

---

## Open questions from research (flag to user if relevant)

These were unresolved after the normal-depth research sweep. If they affect the current advisory:

- **G2 third-party gift card platforms (Sendoso, Reachdesk):** Current policy page does not address explicitly. Recommend manual check at `https://documentation.g2.com/help/docs/understanding-gift-card-eligibility`.
- **Capterra post-acquisition review policy:** Post-February 2026, Capterra's own policy page was not fetched. Treat as G2-equivalent rules until confirmed.
- **AppSumo and Software Advice current listing requirements:** Not fetched; flag before advising on those platforms.
- **Trustpilot paid-plan requirements for invitation collection:** Not fetched; some features (invitation API, bulk invitations) may require a paid Trustpilot plan.

---

*Forged by stinger-forge from `review-funnels-g2-worker-bee-command-brief.md` and scripture-historian research (2026-05-20). Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
