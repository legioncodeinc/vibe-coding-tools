# Domain research for this stinger

Every stinger carries its own research archive. This folder is stages 2 and 3 of the forge pipeline, and the stinger's guides are not allowed to make domain claims that do not trace back here.

Layout:

```
references/research/
├── README.md                                  This file
├── distilled-competitive-research.md          Stage 3: the cited distillation
└── raw/                                        Stage 2: one file per archived source
    ├── competitive-research--battlecards--klue-battlecard-101.md
    ├── competitive-research--landscape-mapping--umbrex-framework.md
    └── competitive-research--session-build--ospry-xlsx-pdf-case-study.md
```

Each raw file starts with a metadata header naming its URL (or "internal" for the first-party build log), fetch date, and source type.

Notes specific to this archive: `competitive-research--session-build--ospry-xlsx-pdf-case-study.md` is a first-party, field-tested build log, a real deliverable built end to end in a Cowork session, including every defect actually hit in production and the exact fix. It outranks the two vendor-blog sources on procedural claims (how to build the XLSX/PDF, what breaks and why) because it is verified execution, not advice; the vendor-blog sources are used for the framing claims (battlecard structure, competitor taxonomy) where an established external methodology is the better citation. Research window: last 6 months, refreshed 2026-08-26. Re-run the sweep if this stinger is revised more than 6 months after that date, per the standard forge-pipeline rule.
