# Research archive for client-health-radar

Domain: customer health scoring, churn warning signals for B2B services and agencies, scope
creep in professional services, account management cadence, and the measured limits of
automated sentiment analysis on conversational and transcribed text. Swept 2026-08-17 with web
search, direct page fetches, and full-text retrieval of three research papers.

## How to use this folder

Read `distilled-client-health.md` first. It is the only file the skill's guides cite directly,
and every claim in it ends in a bracketed pointer to a file in `raw/`. If a domain claim appears
anywhere in this skill without a trail through the distillation to a raw file, it is a defect.

## Contents

| File | Type | What it supports |
|---|---|---|
| `distilled-client-health.md` | distillation | Every domain claim in the guides |
| `raw/sentiment--asr-wer-benchmark--li-edinburgh-2025.md` | academic | How much accuracy transcription costs a sentiment model, and the conflict between two readings |
| `raw/sentiment--classifier-failure-modes--barnes-oslo-2019.md` | academic | The enumerated phenomena that break sentiment classifiers, with error counts |
| `raw/sentiment--asr-word-substitution--wu-hit-2022.md` | academic | The 17.6 percent sentiment-word substitution rate and its measured cost |
| `raw/scope--change-control--pmi-abramovici-2000.md` | official-docs, outside window | Scope creep causes split internal vs external, and the separate-cost-account control |
| `raw/scope--consultancy-margin--projectworks-2026.md` | vendor-blog | The professional-services form of scope creep and the per-change triage questions |
| `raw/health-score--predictive-shift--tsia-2026.md` | vendor research body | Health score failure modes, and the owner-sentiment bias finding |
| `raw/health-score--failure-modes--vandfort-2026.md` | vendor-blog, second-hand stats | The five failure modes, the per-customer-baseline principle |
| `raw/agency--why-clients-fire--almcorp-2026.md` | community / practitioner | The behavioral warning-sign list that backs the skill's signal set |
| `raw/agency--retention-practice--parakeeto-2026.md` | vendor-blog | The abandonment diagnosis, and an example of second-hand statistics |
| `raw/agency--month-six-churn--agencydashboard-2026.md` | vendor-blog | Decision-precedes-cancellation timing, ranked departure reasons, a default cadence shape |
| `raw/agency--churn-benchmarks--focusdigital-2026.md` | vendor-blog, LOW TRUST | Negative finding: the most-cited agency churn benchmark discloses no methodology |
| `raw/cadence--qbr-practice--gainsight-guide.md` | vendor-docs | Tiered cadence, review content elements, the executive-engagement data point |

## Source count

Twelve raw sources. Three academic, one professional-body publication, one membership research
body, six vendor or practitioner blogs, one of those archived specifically as a negative finding
about evidence quality. The contract minimum is five and the assignment minimum is six.

## Window

Default window was the last six months. Sources outside it, each flagged in its own header:

- `scope--change-control--pmi-abramovici-2000.md`, January 2000. Retained as the
  professional-body statement of the mechanism after the recent-window search returned only
  vendor content restating it without attribution.
- `sentiment--classifier-failure-modes--barnes-oslo-2019.md`, June 2019. Retained because it is
  the paper that enumerates the failure phenomena with counts, and no newer replacement was
  found.
- `sentiment--asr-word-substitution--wu-hit-2022.md`, March 2022. Retained for the measured
  substitution rate, which no newer source supplies.
- `sentiment--asr-wer-benchmark--li-edinburgh-2025.md`, revised March 2025, just outside six
  months. It is the most recent benchmark of its kind.
- `cadence--qbr-practice--gainsight-guide.md` is an undated evergreen vendor guide with no
  publication date on the page.

## The honest headline about this archive

The sentiment half has real measurements. The client-health half is almost entirely vendor
assertion with unlinkable second-hand statistics, and all of it is written for subscription
software rather than for project-based services. Sections 1, 2 and 8 of the distillation say so
in detail. The skill is built to work despite that, by deriving every threshold from the user's
own client history rather than from anything published here.

## The one exception to fresh research

Littlebird MCP mechanics are not researched here. That work is already done and lives in
`../littlebird-mcp-reference.md`, copied verbatim from the forge foundation.
