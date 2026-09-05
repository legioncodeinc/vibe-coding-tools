# Research archive for meeting-scribe

Domain: meeting follow-up practice, decision documentation, the internal-versus-shareable
split, and AI notetaker consent and disclosure norms. Swept 2026-08-17 with web search and
direct page fetches.

## How to use this folder

Read `distilled-meeting-followup.md` first. It is the only file the skill's guides cite
directly, and every claim in it ends in a bracketed pointer to a file in `raw/`. If a
domain claim appears anywhere in this skill without a trail through the distillation to a
raw file, it is a defect.

Section 7 of the distillation is the list of things this archive does NOT support. Read it
before adding a confident sentence to any guide.

## Contents

| File | Type | What it supports |
|---|---|---|
| `distilled-meeting-followup.md` | distillation | Every domain claim in the guides |
| `raw/followup--recap-contents--granola-2026.md` | vendor-blog | Recap element list, the 150 word ceiling, the 24 hour norm |
| `raw/followup--email-length--boomerang-hubspot-2016.md` | vendor-blog reporting a 40M email dataset | The 50 to 125 word band, and its genre mismatch |
| `raw/followup--client-recap-rules--sakas-2019.md` | practitioner consulting | Decisions plus owned actionables, per-owner split, send timing |
| `raw/decisions--adr-original--nygard-cognitect-2011.md` | practitioner primary source | Decision record fields, explicit status, supersession, short entries |
| `raw/decisions--decision-log-fields--projectmanager-2025.md` | vendor-blog | Alternatives and Contributors fields, the defensibility purpose |
| `raw/decisions--organizational-memory--conklin-cognexus-1997.md` | research institute monograph | Rationale loss, the case against single-viewpoint minutes, the one quantified return |
| `raw/unresolved--parking-lots--nngroup-2019.md` | practitioner research organization | Deferred items as live obligations, the who-does-what-when handling rule |
| `raw/consent--all-party-states--circleback-2026.md` | vendor-blog | The bot-visibility finding, disclosure norms, an 11 state list |
| `raw/consent--state-law-map--recordinglaw-2026.md` | specialized legal reference | A conflicting 13 jurisdiction list, ECPA baseline, the capability test |
| `raw/confidentiality--notetaker-risks--mltaikins-2025.md` | law firm advisory | Auto-circulation to attendees, the three inaccuracy categories |
| `raw/confidentiality--privilege-and-review--aba-gpsolo-2025.md` | professional association | Durable discoverable records, vendor-side exposure |
| `raw/confidentiality--client-meeting-ethics--2civility-palmer-2026.md` | professional regulator | The verify-before-relying rule, undisclosed recording as a trust failure |
| `raw/distribution--summary-sharing-defaults--stonybrook-zoom-2025.md` | institutional IT documentation | The auto-share-to-all-invitees default, with no review step |

## Source count

Thirteen raw sources. One professional regulator, one professional association, one law
firm advisory, one specialized legal reference, one institutional IT documentation, one
research institute monograph, two practitioner sources, four vendor blogs (one of which
reports a 40 million email dataset). The contract minimum is five and the assignment
minimum is six.

## Window

Default window was the last six months. Five sources sit outside it and each says so in
its own header:

| Source | Date | Why retained |
|---|---|---|
| `raw/decisions--organizational-memory--conklin-cognexus-1997.md` | 1997 | Foundational, not superseded, only quantified return in the archive |
| `raw/decisions--adr-original--nygard-cognitect-2011.md` | 2011 | Origin of a format still in active use; every 2026 piece restates it |
| `raw/followup--email-length--boomerang-hubspot-2016.md` | 2016 data | Only large-sample word count dataset found; 2026 results recycle it uncredited |
| `raw/followup--client-recap-rules--sakas-2019.md` | 2019, updated 2022 | Clearest practitioner statement of the recap norm; 2026 equivalents were vendor content marketing |
| `raw/unresolved--parking-lots--nngroup-2019.md` | 2019, publisher-reviewed 2024-12 | Publisher's own review date is current |

## Unresolved conflicts

1. **Which states require all-party consent.** Eleven per the vendor source, thirteen per
   the legal reference, ten in common, four disputed. Distillation section 6. Not resolved.
2. **Recap length.** Under 150 words (uncited vendor claim) against 50 to 125 words (2016
   data, likely a different genre). Distillation section 1. The two roughly corroborate and
   neither measured meeting recaps.

## Named gaps

Seven, enumerated in distillation section 7. The three that most constrain this skill: no
study links sending a recap to follow-through, no source documents producing different
recaps for different parties, and no source gives a rule for what to strip from a
client-facing recap.

## The one exception to fresh research

Littlebird MCP mechanics are not researched here. That work is already done and lives in
`../littlebird-mcp-reference.md`, copied verbatim from the forge foundation.
