# guides/

Runtime guides. The agent loads these on demand, not all at once.

## For the agent

Load order for a normal job:

1. **01** always, first. It runs the gate and classifies the job.
2. **03 and 04 together** for any generation. 04 is not optional; it is where
   the realism comes from, and 03 without 04 produces the plastic look.
3. **05, 06, 07, 08, 09** as lookup tables while filling prompt slots. Read
   the rows you need, not the whole file.
4. **10** instead of 03 when retouching an actual captured frame.
5. **11** before writing any metadata. Always. Never hand-roll exiftool.
6. **12** when choosing or calling a platform.
7. **13** only on scheduled or unattended runs.
8. **14** before delivering anything to the user.

Every guide opens with "What this guide is for" and "Load this when" so you
can decide from the first two lines whether you need it.

## Cost discipline

Guide bodies stay in context once loaded. Guides 05 through 09 are reference
tables and are written to be read partially: find your row, use it, move on.
Guide 11 is 528 lines and only the case you classified into is relevant, so
read that section rather than the file.

## Index

| # | Guide | Lines | Type |
|---|---|---|---|
| 01 | preflight-and-model-gate | 122 | Procedure |
| 02 | model-ingestion | 370 | Procedure |
| 03 | prompt-construction | 447 | Procedure |
| 04 | authenticity-imperfection | 388 | Procedure and tables |
| 05 | shot-types-and-angles | 250 | Reference |
| 06 | camera-and-lens-reference | 322 | Reference |
| 07 | lighting-reference | 330 | Reference |
| 08 | skin-tone-rendering | 304 | Reference |
| 09 | wardrobe-registers | 255 | Reference |
| 10 | editing-real-frames | 296 | Procedure |
| 11 | metadata-and-exif | 528 | Procedure and reference |
| 12 | model-selection-and-api | 474 | Reference |
| 13 | recurring-and-scheduled-runs | 350 | Procedure |
| 14 | quality-review-checklist | 259 | Checklist |

## For the human

These are the skill's working knowledge, separated from its instructions so
each one can be read, corrected and extended on its own.

Everything in them traces back to `references/research/`. A claim in a guide
carries a citation like `[distilled-photographic-craft.md]`, and that file
carries a citation to a specific file in `references/research/raw/`, which
carries the URL it was fetched from and the date. If a number looks wrong,
that chain is how you check it.

The guides also state their own gaps. Where the research was thin or two
sources disagreed, the text says so rather than picking one silently. Guide
07 has no Kelvin value for sodium street lighting because the corpus did not
establish one, and it says that instead of inventing a number.
