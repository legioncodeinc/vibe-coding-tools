# Research archive for said-it-already

Stages 2 and 3 of the Queen Bee forge pipeline for this skill.

## What is here

```
research/
├── README.md                                        this file
├── distilled-content-mining-and-repurposing.md      stage 3, every claim cited
└── raw/                                             stage 2, one file per source
```

14 sources archived on 2026-08-17. Every file in `raw/` carries a title, URL, publication
date, fetch date, and source type in its header, plus a "Claims this source supports"
block that the distillation cites by filename.

## Source mix

| Type | Count | Sources |
|---|---|---|
| academic | 3 | Biber 2012 (register variation), Bortfeld et al. 2001 (disfluency rates), Green and Appel 2024 (narrative transportation) |
| official-docs | 2 | LinkedIn newsroom feed announcement, Mayer Brown LLP client publication on AI notetakers |
| community / professional craft | 2 | Global Investigative Journalism Network, The Open Notebook |
| vendor-blog | 7 | Content Allies, RepurposeYourContent, AttentionClaw, Lilach Bullock, Slideworks, TrueFuture Media, GoTranscript |

TrueFuture Media is filed as vendor-blog but carries links to four named academic papers
(Itti and Baldi 2009, Loewenstein 1994, Kang et al. 2009, Lang 2000). The distillation
separates its cited layer from its asserted layer rather than treating the whole piece as
one quality tier.

## Research window

Default window was the last 6 months, roughly 2026-02 to 2026-08. Six sources fall outside
it deliberately, and each states so in its own header:

| Source | Year | Why kept |
|---|---|---|
| Biber, register variation | 2012 | Foundational corpus measurement of spoken versus written register. Nothing recent replaces it. |
| Bortfeld et al., disfluency rates | 2001 | The standard measured baseline for how disfluent ordinary speech is. |
| Green and Appel, narrative transportation | 2024 | Current review summarizing several meta-analyses in one place. |
| GIJN, story openings | 2019 | Structured taxonomy of opening types from a professional journalism body. |
| The Open Notebook, ledes | 2015 | Working editors quoted directly on what a first line must do. |
| Slideworks, SCR framework | 2023 | Stable business narrative structure. No newer authority surfaced. |

Everything in the fast-moving layer, meaning platform behavior, repurposing practice,
content bank design, and legal exposure, is from 2026.

## Honest read on evidence quality

This domain is thin. Section 0 of the distillation is a full quality table, but the short
version:

- **Real research exists** for how speech differs from writing, why narrative persuades,
  and why surprise and curiosity capture attention.
- **Craft consensus exists**, and converges across unrelated traditions, for what an
  opening has to do. Journalism craft and B2B video marketing independently arrive at
  "lead with the strongest line, never with context-setting", which is worth weighting.
- **Almost everything about platform engagement is unsourced vendor marketing.** The one
  vendor piece with format-level engagement percentages gives no study, no sample, and no
  methodology. The only first-party platform source found is a corporate announcement with
  no numbers in it.

The skill states platform claims as claims and attributes them to whoever claimed them.

## Known gaps, stated rather than padded

1. **No first-party technical description of feed ranking.** LinkedIn's engineering blog
   post on dwell time is blocked by robots.txt.
2. **No sourced engagement data by post format.**
3. **No evidence on optimal posting cadence or content bank size.** The one working figure
   in the archive is a single practitioner's unsourced report.
4. **Nobody has measured whether repurposed spoken content outperforms content written
   from scratch.** Every repurposing source assumes the value and sells the service. This
   is the biggest missing study in the domain and the skill says so to the user.
5. **SCR provenance is unresolved.** Two sources describe it, neither names an originator.
6. **No source addresses multi-speaker attribution in transcripts as a publishing risk.**
   The closest is a legal observation that transcript accuracy is uneven across speakers.
   This skill's attribution rules are built from the repo's own evidence standards plus
   that observation, and are labeled as unsourced craft where they go beyond it.
7. **No source names objection-handling or analogy as extractable moment types.** Both are
   this skill's own additions and are marked as such in the extraction guide.

## Retrieval failures worth recording

- `https://www.linkedin.com/blog/engineering/feed/understanding-feed-dwell-time` returned
  a robots.txt disallow. This would have been the strongest platform source in the archive.
- `https://www.repurposemywebinar.com/blog/linked-in-content-strategy-for-b-2-b-2026`
  302-redirected to `repurposeyourcontent.com`. The archived file records both URLs.
