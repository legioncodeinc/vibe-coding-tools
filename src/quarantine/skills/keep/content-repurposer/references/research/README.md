# Research archive for content-repurposer

Stages 2 and 3 of the Queen Bee forge pipeline for this skill.

## What is here

```
research/
├── README.md                                          this file
├── distilled-repurposing-and-format-adaptation.md     stage 3, every claim cited
└── raw/                                               stage 2, one file per source
```

13 sources archived on 2026-08-17. Every file in `raw/` carries a title, URL, publication
date, fetch date, and source type in its header, plus a "Claims this source supports" block
that the distillation cites by filename.

## Source mix

| Type | Count | Sources |
|---|---|---|
| academic (peer-reviewed) | 1 | Schumann, Petty and Clemons, Journal of Consumer Research 1990 |
| tertiary reference | 1 | Wikipedia, repetition variation (archived only as the pointer to the primary paper) |
| vendor-official | 1 | Buffer Help Center character limits, meaning the limits a scheduling product actually enforces |
| community / trade press | 2 | Content Marketing Institute, carouselpost.io digest |
| vendor-blog | 8 | AuthoredUp, Buffer resources, Oktopost, Knak, SocialBee, EasyContent, Docswrite, PostEverywhere |

The imbalance is the finding. This domain is written almost entirely by the companies
selling the service, and section 0 of the distillation says so in the first paragraph.

## Research window

Default window was the last 6 months, roughly 2026-02 to 2026-08. Four sources fall outside
it, each stating why in its own header:

| Source | Date | Why kept |
|---|---|---|
| Schumann, Petty and Clemons, advertising variation | 1990 | The only controlled experiment located that tests whether changing the packaging or changing the argument sustains an engaged audience. Nothing recent tests it. |
| Buffer, LinkedIn posting frequency | 2025-08 | The only cadence analysis with a stated sample and statistical method. |
| CMI, remix and recycle | 2025-08 | The only trade-press rather than vendor treatment of repurposing craft. |
| EasyContent, repurposing without repeating | 2025-11 | The only source whose entire subject is this skill's core problem. |
| Docswrite, repurposing statistics | 2024-10 | Archived as an exhibit of unsourced statistics, not as a source of claims. |

Everything about platform format constraints, which is the fast-moving layer, is from 2026
except the Buffer help center page, which carries no date at all.

## Honest read on evidence quality

Short version. The long version is section 0 of the distillation.

- **One real experiment exists** on the question that decides this skill's design: whether
  varying presentation or varying argument sustains an engaged audience. It is from 1990,
  uses undergraduates, and is about print advertising. Its mechanism is used as reasoning.
  Its effect sizes are not used at all.
- **One credible cadence measurement exists**, with a within-account statistical design over
  2 million posts. It covers LinkedIn only.
- **Format constraints are moderately well established and entirely second-hand.** No
  first-party platform documentation was obtained for any surface in this sweep.
- **Every performance statistic in this domain failed a provenance check.** The archive keeps
  one article as the worked exhibit of that failure.

## Known gaps, stated rather than padded

The full list is section 7 of the distillation. The four that most affect what the skill can
claim:

1. **Nobody has measured whether repurposed content outperforms originals.** Everyone
   selling the service assumes it.
2. **No first-party platform docs.** Instagram's own help page returned metadata with no body
   content. X's ranking repository was not independently retrieved.
3. **No sourced angle taxonomy.** The best available in the literature is three opening
   devices, which vary the door and not the room. This skill's seven-angle taxonomy is
   authored craft and is labeled as authored wherever it is used.
4. **No fold or truncation figures for Facebook, Instagram, or X.** Only LinkedIn and email
   were pinned down, and the fold is the constraint that governs a draft.

## Retrieval failures worth recording

- `https://help.instagram.com/1638251932708206`, the official Instagram carousel help page,
  returned page metadata only with no body content. This would have been the archive's only
  first-party Meta source.
- `https://www.tandfonline.com/doi/full/10.1080/23311975.2025.2480474`, a 2025 open-access
  paper on ad variation, repetition and memory recall, returned HTTP 403. It would have been
  the modern replication of the 1990 experiment and is the single most valuable missing
  source in this archive.
- `https://researchrepository.wvu.edu/.../2010_Exploring_wearin_and_wearout_in_web_advertising_3_1_2010.pdf`
  returned HTTP 403. It would have brought the wearout literature into a web context.
- `https://buffer.com/resources/character-limits-social-media/` and
  `https://help.x.com/en/using-x/how-to-tweet` both returned 404.
- `https://blog.docswrite.com/...` 302-redirected to `docswrite.com`. The archived file
  records both URLs.

## Deliberate non-duplication with the sibling skill

The sibling skill `said-it-already` carries a researched archive on spoken-to-written
register conversion and opening craft, built on corpus linguistics, disfluency measurement,
narrative transportation research, and journalism-body opening taxonomies. **This sweep did
not re-run any of that.** Where this skill needs the spoken-to-written rebuild or the
opening-craft taxonomy, it points at that archive rather than shipping a thinner copy.
