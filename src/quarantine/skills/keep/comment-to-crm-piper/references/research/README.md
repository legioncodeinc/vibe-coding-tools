# Research archive for comment-to-crm-piper

Stage 2 and stage 3 of the Queen Bee forge pipeline for this skill.

## What is here

```
research/
├── README.md                                    this file
├── distilled-lead-capture-and-crm-intake.md     stage 3, every claim cited
└── raw/                                         stage 2, one file per source
```

17 sources archived on 2026-08-17. Every file in `raw/` carries a title, URL, fetch date,
and source type in its header, plus a "Claims this source supports" block that the
distillation cites by filename.

## Source mix

| Type | Count | Files |
|---|---|---|
| official-docs | 8 | HighLevel CSV import, HighLevel import existing contacts, HighLevel deduplication preferences, HighLevel Add Contact Tag action, HighLevel API Upsert Contact, ICO collect information and generate leads, ICO choosing your lawful basis, FTC CAN-SPAM guide |
| primary study | 1 | Oldroyd / InsideSales / Kellogg Lead Response Management executive summary |
| vendor-blog | 6 | Lead Source evidence review, Digital Applied speed-to-lead benchmarks, Digital Applied CRM dedupe framework, Data Ladder matching types, Improvado UTM naming, Growthable GoHighLevel import walkthrough |
| community | 1 | GHL Builds custom fields guide |
| regulator, counted inside official-docs | 3 | Two ICO pages and the FTC guide |

## Research window

Default window was the last 6 months, roughly 2026-02 to 2026-08. Four archived sources
fall outside it, deliberately, and each says so in its own header:

- `piper--speed-to-lead--oldroyd-mit-insidesales-2007.md` is from 2007. It is the ORIGINAL
  source of nearly every speed-to-lead figure still quoted in 2026, and the evidence base
  cannot be assessed honestly without it.
- The 2011 Harvard Business Review studies are recorded secondhand inside
  `piper--speed-to-lead--leadsource-evidence-review.md`, because the primary documents are
  paywalled. They are cited as secondhand and never as primary.
- The ICO direct marketing guidance pages and the FTC CAN-SPAM compliance guide are
  standing regulator guidance with no publication window. They are current as of the fetch
  date.

## Where sources conflict

Three conflicts are carried into the distillation rather than smoothed:

1. **GoHighLevel import file size**, 30 MB in one official article, 50 MB in another.
   Design to the stricter number.
2. **GoHighLevel dedupe match order**, Contact ID then Email then Phone in the import
   article, versus a configurable primary-then-secondary field with no Contact ID in the
   deduplication settings article. The API documentation supports the settings article.
3. **Speed-to-lead magnitude**, 100x and 21x odds ratios from six companies in 2007 versus
   a 32% against 12% close rate from 939 companies in 2026. Both are archived. The modern,
   larger sample is the one to quote.

The US and UK consent regimes also differ at the root. That is a jurisdictional difference
rather than a research conflict, and the distillation presents both.

## Known gaps, stated rather than padded

1. **No channel-segmented speed-to-lead data.** Every archived figure describes web-form
   leads worked by phone or B2B demo requests. Not one measures a social commenter answered
   by direct message. The skill applies the DIRECTION and refuses to quote the MAGNITUDE at
   a social hand-raiser.
2. **No exhaustive CSV header list from HighLevel.** Neither official article publishes the
   exact header strings, and column mapping is manual at import time regardless. The skill
   emits headers matching the documented field labels and tells the user to verify the
   mapping screen.
3. **No HighLevel API rate limits or OAuth scopes captured.** The rendered upsert
   documentation did not expose them.
4. **No regulator guidance on platform direct messages.** The ICO covers electronic mail,
   calls, and post. Platform DM rules live in the sibling skill's `platform-rules.md`.
5. **No EU-level regulator source.** UK ICO plus a vendor summary of GDPR, no EDPB
   guidance.
6. **No measured study behind the dedupe confidence tiers.** They are practitioner
   consensus published by a marketing agency.
