# Domain research for this stinger

Every stinger carries its own research archive. This folder is stages 2 and 3 of the forge pipeline, and the stinger's guides are not allowed to make domain claims that don't trace back here.

Layout:

```
references/research/
├── README.md                 This file
├── distilled-{topic}.md      Stage 3: the cited distillation. Dense, tabular, every claim ends with [raw/<file>]
└── raw/                      Stage 2: one file per archived source
    └── {topic}--{subtopic}--{source-slug}.md
```

Each raw file starts with a metadata header:

```
# {Title}
- URL: {url}
- Fetched: {YYYY-MM-DD}
- Source type: official-docs | vendor-blog | community
```

Rules: research window defaults to the last 6 months, never past 12 without explicit user consent. Official docs outrank vendor blogs outrank community posts. Conflicts between sources get flagged in the distillation, not silently resolved. Thin coverage gets named as a gap, never padded with training-data guesses. When the domain shifts under you, re-run the sweep and refresh this folder instead of hand-patching claims in the guides.
