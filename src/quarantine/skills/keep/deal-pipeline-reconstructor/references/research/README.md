# Research archive for deal-pipeline-reconstructor

Stage 2 and stage 3 of the Queen Bee forge pipeline for this skill.

## What is here

```
research/
├── README.md                                this file
├── distilled-b2b-pipeline-management.md     stage 3, every claim cited to a raw file
└── raw/                                     stage 2, one file per source
```

17 sources archived on 2026-08-17. Every file in `raw/` carries a title, URL, fetch date,
and source type in its header, a source-quality caveat where the publisher has a commercial
interest in its own conclusion, and a "Claims this source supports" block that the
distillation cites.

## Source mix

| Type | Count | Files |
|---|---|---|
| official-docs | 3 | HubSpot object pipelines, Pipedrive pipeline design, Pipedrive Rotting feature |
| academic | 6 | HICSS 52 pipeline ML (2019), Arkes on overconfidence (2001), Lawrence et al. judgmental forecasting review (2006), Yan et al. win propensity (2015), Rezazadeh B2B predictive modeling (2020), Binette and Steorts entity resolution (2022) |
| vendor-blog | 8 | Prospeo, Zeliq, Clari, SuperOffice, LOW/CODE Agency, HubSpot blog, HummingDeck, Gong |

## Research window

The default window is the last 6 months, meaning roughly 2026-02 to 2026-08. Ten sources
fall inside it. Seven fall outside it, deliberately, and each states its age and the reason
in its own header:

- Six academic sources: Arkes (2001), Lawrence et al. (2006), Yan et al. (2015), HICSS
  (2019), Rezazadeh (2020), Binette and Steorts (2022). These are foundational treatments of
  forecaster overconfidence, judgmental forecasting, B2B pipeline modelling, and entity
  resolution. The sweep surfaced no fresher vendor-independent replacement for any of them.
- One vendor source: `raw/pipeline--ghosting--hubspot-prospect-ghosting-2025.md`, last
  updated 2025-05-08. Kept because it is the only source in the archive that enumerates
  causes of prospect silence and honestly declines to attach statistics to them.

## How to read the vendor sources in this archive

Be skeptical of the numbers. This was an explicit instruction for this skill and the sweep
justified it. Findings on the state of the evidence:

- `raw/pipeline--crm-hygiene--lowcode-crm-failure-rate-2026.md` is titled "Real Numbers" and
  supplies thirteen statistics of which eleven have no attribution whatsoever. It states
  the CRM failure range three incompatible ways in one article. It is archived as the
  category's exhibit, and nothing in the distillation rests on it.
- `raw/pipeline--ghosting--hummingdeck-proposal-followup-2026.md` attributes every figure to a
  named party with a stated sample size, and not one attribution carries a year.
- `raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md` cites two sources for the
  same MQL to SQL conversion metric that differ roughly twofold, and resolves neither.
- `raw/pipeline--forecast-reliability--clari-forecast-accuracy-2026.md` disparages
  stage-weighted forecasting; the publisher sells the replacement for it.
- `raw/pipeline--deal-signals--gong-sales-insights-2026.md` publishes the largest sample in the
  archive over a self-selected customer base, with no causal design.

The only claims promoted to load-bearing status in the distillation are ones where a
peer-reviewed source and a vendor source agree independently, and those are flagged as such.

## Access limitations encountered, stated

Five fetches failed or were blocked. They are recorded rather than worked around:

1. The HICSS full-text PDF endpoint returned a robots.txt block. Only the record page with
   the abstract was retrieved, and the author names were not present in it.
2. The Aalto thesis on data-augmented judgmental sales forecasting returned HTTP 403 and
   was not archived at all.
3. The Science Advances published version of the entity resolution review returned HTTP
   403; the arXiv preprint of the same work was archived instead.
4. The Springer chapter on overconfidence is paywalled beyond its abstract, so its
   quantitative results on prediction-interval width were not retrieved. No number from it
   appears anywhere.
5. Salesforce's official opportunity-stages help article returned a 404 at the expected
   URL, so the archive has HubSpot and Pipedrive official documentation but no Salesforce
   equivalent.

## Known gaps, stated rather than padded

The full list with citations is section 8 of the distillation. In brief:

1. **No data on sub-10-person sales operations.** The only CRM adoption figure found is
   scoped to firms above 11 employees, which excludes this skill's entire target user base.
2. **No CRM vendor publishes stage entry or exit criteria in official documentation.** Stage
   names ship without definitions. The only stage-by-stage criteria found anywhere are
   uncited editorial content.
3. **No primary source was read for any cycle-length or conversion benchmark.** Every such
   figure is secondhand from a vendor aggregation.
4. **The academic sources on stage reliability are old and partly inaccessible.** No claim
   in the distillation rests on unread full text.
5. **Nothing found on inferring deal stage from ambient activity capture.** The skill's
   stage-inference table maps published exit criteria onto observable artifacts. That
   mapping is the skill's own reasoning, is labelled as inference throughout, and has no
   external validation.
6. **No data on deal-value recall accuracy.** The refusal to fabricate amounts rests on the
   evidence standards, not on domain research.
