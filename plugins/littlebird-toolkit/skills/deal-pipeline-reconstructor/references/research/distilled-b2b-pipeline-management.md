# Distilled: B2B sales pipeline management, stage inference, and deal decay

Written 2026-08-17 from a fresh read of the 17 files in `raw/`. Every claim ends in a
bracketed citation to the raw file it came from. Nothing here is authored from training
data. Where sources disagree, both readings are stated and the preferred one is named with
a reason.

**Read the source-quality note first.** Nine of the seventeen files are vendor-published.
The vendor sources in this domain routinely publish statistics with no attribution, no
year, or both. The archive's own exhibit for this is a piece titled "CRM Implementation
Failure Rate: Real Numbers" in which eleven of thirteen extracted statistics carry no
source at all and the headline failure range is stated three incompatible ways within one
article [raw/pipeline--crm-hygiene--lowcode-crm-failure-rate-2026.md]. Treat every vendor
number below as a CLAIM attributed to a named party. Where a vendor claim is corroborated
by a peer-reviewed source, that is said explicitly, and those are the only claims strong
enough to carry a user-facing assertion.

---

## 1. The premise: why the CRM is empty

The skill's target user sells without maintaining a CRM. The archive supports the
mechanism, not a headcount.

| Finding | Reading | Citation |
|---|---|---|
| "34% of a sales rep's time is actually spent selling. The rest goes to admin, meetings, and searching for information." Attributed to Salesforce State of Sales, 2024 | Administrative load is the reported majority of a seller's week even inside staffed organisations | [raw/pipeline--crm-hygiene--superoffice-crm-statistics-2026.md] |
| "13 hrs the average salesperson spends on manual data entry per week. That is 28% of a full working week." Self-published by the CRM vendor reporting it | Directional only, and the publisher benefits from the number being large | [raw/pipeline--crm-hygiene--superoffice-crm-statistics-2026.md] |
| "47% of CRM users say their satisfaction is significantly impacted by data quality issues." Attributed to Salesforce State of CRM, 2024 | Even funded, staffed CRM deployments report a data-quality problem | [raw/pipeline--crm-hygiene--superoffice-crm-statistics-2026.md] |
| Where a cause of CRM failure is named at all, it is people and adoption rather than software | Direction is consistent across the archive; magnitudes are not usable | [raw/pipeline--crm-hygiene--lowcode-crm-failure-rate-2026.md] |
| Vendor guidance ties HIGH STAGE COUNT to REDUCED ADOPTION: "too many stages make the pipeline harder to scan and reduce adoption" | A reconstructed board must be small or it will not be maintained either | [raw/pipeline--stage-definitions--pipedrive-pipeline-design-2026.md] |

**The named gap that matters most.** The only adoption figure in the archive is scoped to
"companies with more than 11 employees", which explicitly excludes the solo founders and
small agency owners this skill serves
[raw/pipeline--crm-hygiene--superoffice-crm-statistics-2026.md]. There is NO archived
statistic describing CRM usage among sub-10-person businesses. The skill therefore must not
tell a user how common their situation is. It can say the mechanism is documented. It
cannot say what fraction of operators share it.

---

## 2. Stage definitions: names are published, criteria are not

### What the official documentation actually supplies

| Source | Stage ladder | Definitions supplied? |
|---|---|---|
| HubSpot default Sales Pipeline: Appointment scheduled, Qualified to buy, Presentation scheduled, Decision maker bought-in, Contract sent, Closed won, Closed lost | Seven, with a Won and Lost tail | NO. The page states no entry or exit criteria [raw/pipeline--stage-definitions--hubspot-pipelines-docs-2026.md] |
| Pipedrive default pipeline | Five, customisable; names not enumerated on the page read | NO [raw/pipeline--stage-definitions--pipedrive-pipeline-design-2026.md] |

**This absence is the central finding of section 2.** The two most widely deployed SMB
pipelines ship stage LABELS with no published definition of what moves a deal across a
boundary. The user's mental model of "proposal stage" therefore has no authoritative
referent, which is exactly why a reconstructed board must publish its own criteria and show
its evidence rather than assuming a shared meaning.

### The design licence: stages should be named after observable actions

Pipedrive's own guidance is explicit: "Align stages with real actions, such as 'Meeting
scheduled' or 'Proposal sent,' instead of broad labels like 'In progress'"
[raw/pipeline--stage-definitions--pipedrive-pipeline-design-2026.md]. A stage "represents a
step your deals go through before they're won or lost"
[raw/pipeline--stage-definitions--pipedrive-pipeline-design-2026.md].

This is the most important sentence in the archive for this skill. The vendor recommending
action-named stages is recommending stages defined by exactly the artifacts screen and
message capture can observe: a scheduled meeting, a sent proposal. Stage inference from
captured activity is not a workaround for a missing CRM. It is closer to the recommended
practice than a hand-maintained subjective stage field is.

### Exit criteria, where anyone states them

The only stage-by-stage exit criteria in the archive are editorial and uncited, from a
contact-data vendor [raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md]:

| Stage | Stated exit criteria (verbatim) | Externally observable? |
|---|---|---|
| Prospecting | "ICP fit confirmed, verified contact data in hand, initial engagement signal" | Partly |
| Qualification | "Budget path identified, decision-making authority confirmed, timeline established, success criteria defined, prospect agrees to next steps" | Partly; the agreed next step is observable |
| Discovery | "Confirmed business pain articulated by prospect in their own words, buying roles mapped, specific next step agreed" | Yes, in a call transcript |
| Demo / Presentation | "Prospect confirms solution fit, agrees to decision process and timeline, key stakeholders identified" | Yes, in a call transcript |
| Proposal | "Budget confirmed in writing, stakeholders aligned on solution, decision timeline agreed, pricing reviewed" | Yes; "in writing" and "pricing reviewed" are artifacts |
| Negotiation | "Legal or procurement review initiated, commercial terms largely agreed, clear path to signature" | Yes; redlines and terms discussion are artifacts |
| Closing | "Signed agreement received, handoff to customer success initiated, first value milestone scheduled" | Yes |

Note the pattern: almost every criterion is a BUYER-SIDE OBSERVABLE EVENT rather than a
seller's internal judgment [raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md].
That is what makes them inferable from evidence at all. The criteria are uncited editorial
content and should be presented to a user as a reasonable starting definition to adjust,
never as an industry standard.

### Stage probability is a lookup table, not a model

HubSpot ships fixed win probabilities per stage: 20, 40, 60, 80, 90, then 100 or 0, and
"Stage probability is used to determine the weighted amount shown in board view, which is
calculated by multiplying the total amount in each stage by the stage probability"
[raw/pipeline--stage-definitions--hubspot-pipelines-docs-2026.md]. These are defaults, not
fitted values. Multiplying an unknown or guessed deal amount by a default probability
produces a number with two fabricated inputs. A reconstructed board should not compute
weighted pipeline value at all.

---

## 3. Why a self-reported stage is unreliable

This is the section where a peer-reviewed source and a vendor source agree, which is the
strongest evidentiary position available in this domain.

### The vendor-independent statement

A peer-reviewed HICSS paper describes existing human lead and opportunity qualification as
carrying "a high degree of arbitrariness caused by professional expertise and experiences"
[raw/pipeline--forecast-reliability--hicss-pipeline-ml-2019.md]. That is an academic source
stating, in its own words, that the stage a human assigns is arbitrary to a meaningful
degree. It is the load-bearing citation for this skill's stage-inference guardrail.

The same paper finds that "the probability of either winning or losing a sales deal in the
early lead stage is more difficult to predict than analyzing the lead and opportunity
phases separately" [raw/pipeline--forecast-reliability--hicss-pipeline-ml-2019.md]. Early
placement is harder than late placement. A board should express LOWER confidence at Lead
and Qualified than at Proposal and Negotiation.

### The cognitive mechanism

Overconfidence is "a common finding in the forecasting research literature", with three
named consequences: forecasters "neglect decision aids", "make predictions contrary to the
base rate", and "succumb to 'groupthink'"
[raw/pipeline--forecast-reliability--arkes-overconfidence-judgmental-forecasting-2001.md].
Predicting contrary to the base rate is precisely the mechanism by which a deal gets placed
one stage further along than its evidence supports.

The judgmental forecasting literature treats overconfidence and optimistic bias as
established themes, and its recurring prescription is COMBINATION of judgment with
mechanical method rather than replacement of one by the other
[raw/pipeline--forecast-reliability--lawrence-judgmental-forecasting-review-2006.md].

**This is the design justification for the confirmation pass.** The literature does not say
the machine should decide. It says combining beats either alone. So: the skill proposes a
placement with its evidence, the human confirms or overrides, and the two together beat
either the operator's memory or the skill's inference used alone
[raw/pipeline--forecast-reliability--lawrence-judgmental-forecasting-review-2006.md].

The documented remedies for overconfidence are procedural: consider alternatives, list
reasons the forecast might be wrong, make the prediction explicit and obtain feedback
[raw/pipeline--forecast-reliability--arkes-overconfidence-judgmental-forecasting-2001.md].
A board that shows a competing stage reading, names what would falsify its placement, and
is re-run weekly against its own prior output is applying three of those six remedies
directly.

### The vendor claim, and what it is worth

Clari asserts that reps "mark deals as healthy in the CRM long after buyer engagement
signals have gone cold, push close dates to protect their pipeline", and that "Rep optimism
bias is the most persistent driver of forecast inaccuracy in most revenue organizations"
[raw/pipeline--forecast-reliability--clari-forecast-accuracy-2026.md]. Clari sells the
product that replaces stage-weighted forecasting, so it has a direct commercial interest in
this conclusion. The MECHANISM is corroborated independently by the academic sources above.
The MAGNITUDE is not corroborated anywhere.

Specifically unsupported and not to be repeated: the claim that stage-based forecasting
accuracy "tops out" around 60 to 75%, and the claim that deal-level machine learning
reaches 75 to 90% [raw/pipeline--forecast-reliability--clari-forecast-accuracy-2026.md].
No independent confirmation exists in this archive.

### The ceiling on quantification

Two academic sources jointly forbid attaching a win probability to a deal on this skill's
board.

- The named obstacles to modelling a B2B pipeline are "the relatively small number of B2B
  transactions (compared with the volume of B2C transactions), noisy data, and the
  fast-changing market environment"
  [raw/pipeline--forecast-reliability--yan-win-propensity-arxiv-2015.md]. All three are
  worse for a solo operator with a handful of live deals than for the top-500 enterprise
  that paper studied.
- A serious predictive treatment of B2B deal outcome used 20 features and did not use sales
  stage at all; temporal features were absent too
  [raw/pipeline--forecast-reliability--rezazadeh-b2b-predictive-modeling-arxiv-2020.md].

Read together: a single operator's deal history is far too small to fit anything on, and
the one paper that could have used stage as a feature did not. Stage is a communication
device with evidence attached, not a prediction. Win propensity in the literature is defined
over "a specified time window"
[raw/pipeline--forecast-reliability--yan-win-propensity-arxiv-2015.md], so any forecast
claim without a window is under-specified.

One more contrast worth keeping: the enterprise dataset in the Rezazadeh paper had "Less
than 1% of the dataset contained missing values" and the authors could afford to drop every
incomplete record [raw/pipeline--forecast-reliability--rezazadeh-b2b-predictive-modeling-arxiv-2020.md].
Published pipeline modelling assumes a data condition that does not exist in the target
user's business.

---

## 4. Deal identity is an entity resolution problem

Merging fragments of a person or organisation across inconsistent sources is a named,
studied problem: "record linkage, de-duplication, or entity resolution"
[raw/pipeline--deal-identity--binette-steorts-entity-resolution-2022.md]. Four consequences
for this skill:

1. **Matching is probabilistic by construction.** The field's mature methods trace to
   probabilistic record linkage developed from the 1940s and 1950s
   [raw/pipeline--deal-identity--binette-steorts-entity-resolution-2022.md]. A match carries
   a degree of belief. A skill that merges silently is asserting a certainty the underlying
   discipline does not grant.
2. **Canonicalization is a separate step from matching.** Choosing the single representative
   form of a resolved entity is named as its own stage
   [raw/pipeline--deal-identity--binette-steorts-entity-resolution-2022.md]. The display
   name on a board row is a CHOICE, and it should be shown as one, with the variants it
   subsumes listed.
3. **Supervision requires labels, and the operator is the only source of them.** Reviewed
   methods span unsupervised, semi-supervised, and fully supervised
   [raw/pipeline--deal-identity--binette-steorts-entity-resolution-2022.md]. A solo
   operator's pipeline supplies no labelled examples at the start. Human confirmation of
   uncertain merges is not a courtesy, it is the only available supervision signal.
4. **The identity unit is account plus opportunity, not contact.** The features actually
   used to describe a real B2B opportunity are Account and Account Location plus Opportunity
   Type, Project Duration and Total Contract Value
   [raw/pipeline--forecast-reliability--rezazadeh-b2b-predictive-modeling-arxiv-2020.md].
   That supports modelling a deal as person plus company plus opportunity rather than as a
   bare contact record.

---

## 5. Recency, going cold, and the stage-weighted threshold

### Per-stage staleness is shipped product practice

Pipedrive's Rotting feature "provides visibility into deals that have been idle for too
long", and the rotting period is configured INDIVIDUALLY PER PIPELINE STAGE, with stages
able to carry different thresholds or opt out entirely
[raw/pipeline--going-cold--pipedrive-rotting-feature-2026.md]. The timer resets on any
recorded touch, including "Marking activities as done", "Adding notes and files to a deal",
and sending or receiving email [raw/pipeline--going-cold--pipedrive-rotting-feature-2026.md].

**Pipedrive publishes no recommended default day count**, stating that the right timeframe
depends on the company's workflow [raw/pipeline--going-cold--pipedrive-rotting-feature-2026.md].
Any specific number this skill uses is a starting point the user must tune, and must be
labelled as such.

### What the deal-age evidence says

| Claim | Attribution | Reading |
|---|---|---|
| "Beyond 14 days without interaction, close rate drops 38%" | RAIN Group, quoted secondhand [raw/pipeline--velocity--zeliq-sales-cycle-2026.md] | 14 days is the most frequently cited inflection point in the archive |
| "Deals closed within 50 days have a 47% win rate. After that threshold, win rates drop to roughly 20% or lower." | Outreach, quoted secondhand [raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md] | Total deal AGE, distinct from silence duration |
| "Set a stale-deal threshold at 2x the average stage duration and enforce it." | No source cited [raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md] | A relative rule, which is more portable than an absolute day count |
| "42.5% of closed-won proposals close within 24 hours of first open" | Proposify, 1.3 million proposals, no year stated [raw/pipeline--ghosting--hummingdeck-proposal-followup-2026.md] | If directionally true, proposal-stage signal decays fast |

**Preferred reading, and why.** Use the RELATIVE rule (a multiple of typical stage duration)
rather than any single absolute day count. Reason: the absolute figures are all
vendor-attributed, none carries a verifiable year, and the underlying cycle lengths differ
by nearly an order of magnitude across segments, from SMB at "30-45 days" to strategic at
"9-18 months" [raw/pipeline--velocity--zeliq-sales-cycle-2026.md]. A single day count cannot
be right across that range. A multiple of typical stage duration can be stated honestly as a
heuristic and tuned.

### Typical stage durations, for calibrating the multiplier

Stated durations, from a vendor aggregation with no primary source fetched
[raw/pipeline--velocity--zeliq-sales-cycle-2026.md]:

| Stage | Typical duration |
|---|---|
| Discovery | 7 to 14 days to confirm |
| Demo | 7 to 21 days after discovery |
| Technical evaluation | 7 to 14 days after demo |
| Proposal | 7 to 14 days for a reply |
| Negotiation | 14 to 30 days |
| Closing | 7 to 21 days |

The two shortest expected windows are discovery response and proposal reply. This is the
empirical basis for the skill's core recency claim: **the same silence duration means
different things at different stages.** Fourteen days of silence sits at the far end of the
expected proposal reply window and well inside the expected negotiation window.

### Segment calibration

Median mid-market cycle is claimed at "92 days, versus 68 days in 2019, a 35% increase",
attributed to a RAIN Group 2025 benchmark [raw/pipeline--velocity--zeliq-sales-cycle-2026.md].
SMB is claimed at "30-45 days" [raw/pipeline--velocity--zeliq-sales-cycle-2026.md]. Two
consequences: thresholds calibrated on enterprise cycles are far too slow for a solo
operator, and cycle lengths have LENGTHENED over time, so older benchmarks understate
current durations.

### Unresolved conflict: published conversion rates

One vendor cites a FirstPageSage dataset for MQL to SQL at 38%; the same page cites a
Digital Bloom analysis putting typical performance at roughly 15 to 21%
[raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md]. The page presents both and
resolves neither. **Preferred handling: quote no conversion rate at all.** The spread is
roughly twofold on the same metric within one article, and the skill has no way to tell the
user which applies to them.

---

## 6. Silence is not a decision

Every stated cause of a prospect going quiet, across two independent vendor sources, is
about the buyer's own situation rather than a decision against the seller.

HubSpot's six stated causes: decision paralysis from too many choices, competing
priorities, lack of perceived value or urgency, unclear workflow fit, incomplete discovery
that missed core needs, and information overload from jargon
[raw/pipeline--ghosting--hubspot-prospect-ghosting-2025.md]. Note that this article contains
NO statistics at all, and says so honestly by framing itself as expert commentary
[raw/pipeline--ghosting--hubspot-prospect-ghosting-2025.md].

HummingDeck agrees on mechanism: silence "doesn't mean a prospect dislikes the proposal or
chose a competitor. Rather, it often signals internal committee dynamics, overwhelm,
internal politics, price shock, or fear of delivering bad news"
[raw/pipeline--ghosting--hummingdeck-proposal-followup-2026.md].

**Consequence for the board: a going-cold list is a work queue, not a write-off list.** Not
one archived cause of silence is "they chose someone else"
[raw/pipeline--ghosting--hubspot-prospect-ghosting-2025.md].

A second consequence: cause 5, incomplete discovery, means silence can be diagnostic of a
defect in an EARLIER stage
[raw/pipeline--ghosting--hubspot-prospect-ghosting-2025.md]. A deal that went quiet after a
proposal may be a deal that was never properly qualified. That argues for showing the whole
evidence trail per deal rather than only the last touch.

### Unresolved conflict: how fast to re-approach

| Reading | Source | Prescription |
|---|---|---|
| Slow | HubSpot: "sometimes it's best to let them be for a while, then check back in after a few weeks or months" [raw/pipeline--ghosting--hubspot-prospect-ghosting-2025.md] | Wait weeks to months, re-approach with value, do not escalate |
| Fast | HummingDeck: a dense cadence across roughly 18 days after a proposal [raw/pipeline--ghosting--hummingdeck-proposal-followup-2026.md] | Multi-touch, multi-channel, within under three weeks |

Both are vendor sources. Both have a commercial interest: one sells CRM and marketing
software, one sells proposal software with tracking. **The conflict is not resolvable from
this archive and must not be smoothed.** Preferred handling for the skill: present the
timing decision to the user rather than encoding one cadence, and note that the two
prescriptions differ by an order of magnitude in tempo.

One wording constraint IS usable, because it is a large-sample, negatively-signed finding
of the kind least likely to be publication-biased: saying "I never heard back" is claimed to
DECREASE meetings booked by 14%, attributed to Gong over 304,174 emails, year not stated
[raw/pipeline--ghosting--hummingdeck-proposal-followup-2026.md]. A next-action line should
not be phrased as a complaint about being ignored.

---

## 7. A health signal that does not depend on stage at all

The largest-sample finding in the archive: "deals that close successfully have twice as
many buyer contacts as those that don't", over 1.8 million opportunities, and
multi-threading "boosts win rates by 130% in deals over $50K"
[raw/pipeline--deal-signals--gong-sales-insights-2026.md].

This is useful because buyer-side contact count is partially observable from capture:
distinct named people appearing in the same company's message threads and calls. It gives a
board a risk flag independent of any inferred stage.

**Three limits, all of which must be stated wherever this is used.** The sample is
self-selected to companies that bought a revenue-intelligence platform, which skews larger
and more process-mature than a solo operator
[raw/pipeline--deal-signals--gong-sales-insights-2026.md]. The finding is correlational and
Gong publishes no causal design, so contact count partly proxies for deal size and maturity
rather than causing the win [raw/pipeline--deal-signals--gong-sales-insights-2026.md]. And
the 130% figure is scoped to deals over 50,000 USD
[raw/pipeline--deal-signals--gong-sales-insights-2026.md], which is above the typical deal
size for many of this skill's users. Report thread count as an observation, flag
single-threading as a risk, and do not promise that adding a contact raises the win rate.

---

## 8. Named research gaps

Stated rather than padded, per the authoring contract.

1. **No data on sub-10-person sales operations.** The only adoption figure found is scoped
   to firms above 11 employees [raw/pipeline--crm-hygiene--superoffice-crm-statistics-2026.md].
   Nothing in this archive describes pipeline behaviour, cycle length, or CRM usage for the
   solo founder or small agency owner the skill targets. Every benchmark here is imported
   from a larger context.
2. **No published stage entry or exit criteria from any CRM vendor's official
   documentation.** HubSpot supplies names and probabilities but no criteria
   [raw/pipeline--stage-definitions--hubspot-pipelines-docs-2026.md]; Pipedrive supplies
   design principles but no criteria [raw/pipeline--stage-definitions--pipedrive-pipeline-design-2026.md].
   The only stage-by-stage criteria found are uncited editorial content from a contact-data
   vendor [raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md].
3. **No primary source was read for any cycle-length or conversion benchmark.** Every such
   figure in this archive is quoted secondhand from a vendor aggregation citing another
   party, frequently with no year
   [raw/pipeline--velocity--zeliq-sales-cycle-2026.md] [raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md].
   The RAIN Group, Forrester, Outreach, Proposify, Salesloft and PandaDoc reports were not
   fetched.
4. **The academic sources on stage reliability are old and partly inaccessible.** The
   strongest vendor-independent statement is from a 2019 conference paper whose full text
   was blocked by robots.txt [raw/pipeline--forecast-reliability--hicss-pipeline-ml-2019.md].
   The overconfidence chapter is from 2001 and paywalled beyond its abstract
   [raw/pipeline--forecast-reliability--arkes-overconfidence-judgmental-forecasting-2001.md].
   The judgmental forecasting review is from 2006 with no abstract available on the record
   page [raw/pipeline--forecast-reliability--lawrence-judgmental-forecasting-review-2006.md].
   No claim in this distillation rests on unread full text.
5. **Nothing found on inferring deal stage from ambient activity capture.** The sweep
   returned no source, academic or vendor, studying whether observed artifacts (a calendar
   hold, a proposal on screen, a pricing thread) reliably indicate a stage. The skill's
   stage-inference table is therefore constructed by mapping published EXIT CRITERIA
   [raw/pipeline--stage-definitions--prospeo-exit-criteria-2026.md] onto observable
   artifacts, licensed by the action-named-stage guidance
   [raw/pipeline--stage-definitions--pipedrive-pipeline-design-2026.md]. That mapping is
   this skill's own reasoning, is labelled as inference throughout, and has no external
   validation.
6. **No data on deal-value recall accuracy.** Nothing in the archive addresses how often a
   remembered or screen-observed deal amount is stale or wrong, which is the direct
   evidential basis the skill would want for its refusal to fabricate amounts. The refusal
   stands on the evidence standards rather than on domain research.
