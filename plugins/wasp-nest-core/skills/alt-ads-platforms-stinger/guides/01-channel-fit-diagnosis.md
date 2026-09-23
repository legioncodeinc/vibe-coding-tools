# 01 — Channel-Fit Diagnosis

The single most important guide in this stinger. Run this before any platform setup work.

---

## The fundamental taxonomy: demand capture vs demand creation

The most useful framing for alternative paid channels comes from the demand capture vs demand creation split.

**Demand capture** channels reach buyers who are actively researching a solution. They have high intent; conversion rates are higher; CPLs are lower.
- Examples: Bing/Microsoft Ads (search intent), Quora Ads (question-intent targeting).

**Demand creation** channels reach buyers before they are actively searching. Awareness must be built first; conversion rates are lower; CPLs appear higher but the TAM is larger.
- Examples: LinkedIn Ads, TikTok Ads, Reddit community ads, Pinterest Ads, podcast ads.

**Why it matters:** Many teams waste budget running demand-creation platforms (LinkedIn) with demand-capture KPIs (direct CPL targets). LinkedIn CPLs will always look bad vs Google Search CPLs. The right comparison is pipeline influenced and brand recall, not same-session form fills.

*Source: `research/external/2026-05-20-b2b-paid-media-channel-selection-framework.md`*

---

## The ICP-to-platform scoring matrix

For each candidate platform, score across 5 dimensions on a 1-3 scale. Total max: 15. Platforms scoring ≥10 are fit for testing; below 7 are misfit and should not be launched.

| Dimension | Weight | Score 1 (poor fit) | Score 2 (potential fit) | Score 3 (strong fit) |
|---|---|---|---|---|
| **Audience density** — does enough of my ICP exist on this platform? | 3x | <5% of ICP is reachable | 5-30% of ICP is reachable | >30% of ICP is reachable |
| **Intent signal** — are they in a buying mindset on this platform? | 2x | Casual browsing / entertainment | Research / professional | Actively searching for solution |
| **CPL viability** — is the platform CPL within 3x of our acceptable CPL? | 2x | CPL >5x acceptable | CPL 3-5x acceptable | CPL within 3x acceptable |
| **Creative fit** — do we have the creative format this platform needs? | 1x | Can't produce this format | Could produce with effort | Already have this format |
| **Tracking feasibility** — can we measure conversion properly? | 2x | Cannot close the loop | Workaround possible | CAPI or direct pixel available |

### Quick ICP-to-platform mapping table

| ICP profile | Recommended primary | Recommended test | Avoid |
|---|---|---|---|
| B2B SaaS, VP/Director buyer, $50K+ ACV | LinkedIn Ads | Reddit (technical subreddits) + Bing with LPT | TikTok (wrong intent), Pinterest |
| B2B SMB, founder buyer, <$10K ACV | Reddit Ads, Microsoft Bing | LinkedIn (watch CPL), Quora | TikTok (unless founder has creator presence) |
| D2C e-commerce, 25-44 audience | TikTok Ads (Smart+) | Pinterest (if visual category) | LinkedIn, Quora |
| Mobile app, 18-34 audience | TikTok Ads | Reddit (niche interest), YouTube Shorts | LinkedIn |
| Enterprise software, >$100K ACV | LinkedIn Ads (ABM) | Bing with LPT | Reddit, TikTok, Pinterest |
| Developer tools / technical audience | Reddit Ads | Quora (comparison queries) + Bing | Pinterest, Spotify |
| Brand awareness / thought leadership | LinkedIn (Thought Leader Ads) | YouTube TrueView | Quora (scale too small) |

*Source: `research/external/2026-05-20-b2b-paid-media-channel-selection-framework.md`, `research/external/2026-05-20-emerging-b2b-paid-channels-2026-lever-digital.md`*

---

## The investment ladder: what order to add channels

From the B2B paid media channel selection framework research, the recommended sequencing for adding alternative channels:

1. **Demand capture first** (Google Search, Bing Search) — if not already running, these produce the fastest CPL signal.
2. **LinkedIn Ads** — if B2B ICP with job title targeting need. Entry point is Lead Gen Forms.
3. **Reddit Ads or Quora Ads** — if technical/professional audience exists in community context.
4. **Microsoft Bing + LinkedIn Profile Targeting** — overlaps demand capture and B2B targeting; strong complement to LinkedIn Ads.
5. **TikTok, YouTube, Pinterest** — for brand awareness, D2C, or when budget allows demand-creation investment.
6. **Podcast/Spotify** — for brand at scale; requires $3K+/month for meaningful reach.

**Shortcut for founders with <$3K/month budget:** Start with one channel only. Pick the one with the highest audience density score for your ICP. Master it. Add the second channel when CPL is stable and optimization velocity drops below 15% improvement per quarter.

*Source: `research/external/2026-05-20-powerful-b2b-ad-channels-framework-2026.md`*

---

## Channel diagnosis output format

When completing a channel-fit diagnosis, produce output in this structure:

```
## Channel-fit diagnosis for [Company Name / ICP description]

**ICP:** [1-2 sentence description]
**Budget:** $X/month total ad spend
**Conversion goal:** [leads / signups / purchases / installs]

### Platform scores
| Platform | Score /15 | Verdict |
|---|---|---|
| LinkedIn | 13 | Primary: launch |
| Reddit | 9 | Test: $500/month |
| TikTok | 5 | Misfit: do not launch |
| [etc.] | | |

### Recommended stack
**Primary:** [platform] — [2-sentence rationale]
**Test:** [platform] — [2-sentence rationale]
**Hold:** [remaining platforms] — [1-sentence reason to hold]

### Budget allocation
- Primary: $X/month
- Test: $X/month
```

See `examples/b2b-saas-channel-fit.md` for a worked example.
See `templates/channel-fit-scorecard.md` for the fillable template.
