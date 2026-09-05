# Stage inference

How to place a deal on the board, and how to show the reasoning so the user can overrule
it.

**Stage is inferred, never observed.** Every placement this skill makes is an inference
under `evidence-standards.md` rule 2, and is marked as one. A wrong stage that makes the
user think a deal is closer than it is has a real cost: they stop working it, or they count
revenue that is not coming.

---

## 1. Why inference from evidence is defensible here

Three findings from the archive, together, make this workable rather than reckless.

**Nobody publishes stage criteria anyway.** The two most widely deployed SMB pipelines ship
stage LABELS with no published definition of what moves a deal across a boundary
(`research/distilled-b2b-pipeline-management.md`, section 2). HubSpot supplies seven stage
names and a fixed probability for each, and states no entry or exit criteria at all. So the
user's own idea of "proposal stage" has no authoritative referent either. A board that
publishes its criteria and its evidence is MORE defined than the CRM it replaces, not less.

**The recommended practice is to name stages after observable actions.** Pipedrive's own
documentation says to "Align stages with real actions, such as 'Meeting scheduled' or
'Proposal sent,' instead of broad labels like 'In progress'"
(`research/distilled-b2b-pipeline-management.md`, section 2). Those are exactly the
artifacts capture can see. Inferring stage from a scheduled call or a proposal on screen is
closer to the vendor's own recommendation than a hand-maintained subjective field is.

**Human stage assignment is documented as arbitrary.** A peer-reviewed paper describes
existing human lead and opportunity qualification as carrying "a high degree of
arbitrariness caused by professional expertise and experiences"
(`research/distilled-b2b-pipeline-management.md`, section 3). The alternative to inference
is not accuracy, it is a different kind of guess.

**But the literature does not say the machine should decide.** The recurring prescription
in judgmental forecasting research is COMBINATION of judgment with mechanical method rather
than replacement of one by the other
(`research/distilled-b2b-pipeline-management.md`, section 3). Hence the design: the skill
proposes a placement with its evidence, the user confirms or overrides, and the confirmed
board is the artifact.

---

## 2. The board's stages, and what they mean here

Six live stages plus a Won and Lost tail. A Won and Lost tail is required, not optional
(`research/distilled-b2b-pipeline-management.md`, section 2). Keep the count small: vendor
guidance ties high stage counts to reduced adoption
(`research/distilled-b2b-pipeline-management.md`, section 1).

| Stage | What it means on this board |
|---|---|
| **Lead** | A named person or company has surfaced with some indication of interest. No qualifying conversation has happened yet. |
| **Qualified** | A real two-way conversation has happened or is scheduled. There is a specific thing they might buy and some indication they can buy it. |
| **Proposal** | A written offer with scope, or a price, has gone to them, or is visibly being prepared for them. |
| **Negotiation** | They are engaging with the terms rather than the concept. Price, scope, timing, or contract language is under discussion. |
| **Closing** | Commercial agreement is substantially reached and what remains is signature, paperwork, or a start date. |
| **Won / Lost** | Terminal. Include both. Lost includes explicit declines and deals the user marks dead. |

---

## 3. The evidence-to-stage table

Each row maps an OBSERVABLE artifact to the stage it indicates. This mapping is the
skill's own reasoning, built by taking published stage exit criteria
(`research/distilled-b2b-pipeline-management.md`, section 2) and asking what artifact each
one would leave in capture. **It has no external validation, and that gap is named in
`research/README.md`.** Present it to the user as a starting definition they can adjust,
never as an industry standard.

| Observed artifact | Indicated stage | Strength | Notes |
|---|---|---|---|
| Name appears in a DM or thread with a question about what the user does | Lead | Medium | Interest, not qualification |
| Inbound enquiry with no reply yet | Lead | High for Lead, and a next-action trigger | |
| A discovery or intro call is SCHEDULED on the calendar | Qualified | High | The published qualification exit criterion is that the "prospect agrees to next steps" (`research/distilled-b2b-pipeline-management.md`, section 2). A booked call IS the agreed next step. |
| A discovery or demo call HAS BEEN HELD, with a meeting summary | Qualified at minimum | High | Read the summary for stronger signals before settling here. See section 4. |
| The prospect states a budget, an authority, or a timeline in a call | Qualified | High | Maps to "Budget path identified, decision-making authority confirmed, timeline established" (`research/distilled-b2b-pipeline-management.md`, section 2) |
| A proposal, quote, SOW, or estimate document is on screen with this prospect's name on it | Proposal | High | The clearest single artifact on the board |
| A message from the user containing a price or a scope for this prospect | Proposal | High | Marked as quoted, not agreed |
| A proposal template or blank quote on screen with no prospect name | Nothing | n/a | Do not attach this to a deal |
| A thread where the prospect responds to a number: asks for a discount, questions a line item, proposes different terms | Negotiation | High | This is the stage boundary that matters most. Discussing THE price is negotiation. Being SENT a price is proposal. |
| Legal, procurement, MSA, or redline language appears | Negotiation | High | Maps to "Legal or procurement review initiated" (`research/distilled-b2b-pipeline-management.md`, section 2) |
| Contract, agreement, or e-signature UI on screen for this prospect | Closing | High | |
| Onboarding, kickoff scheduling, invoicing, or deposit discussion | Closing, or Won | High | Check for an explicit confirmation before calling it Won |
| An explicit "yes", a signed document, or a first payment | Won | High | |
| An explicit decline, or "we went with someone else" | Lost | High | |

### The two boundaries that go wrong most often

**Qualified to Proposal.** Preparing a proposal is not the same as sending one. If the
evidence is a document on the user's own screen with no evidence it reached the prospect,
that is Proposal-in-preparation, and it should be flagged for the user to confirm whether
it was actually sent. Capture shows what the user was VIEWING
(`evidence-standards.md`, rule 4), which for an outbound document is genuinely ambiguous.

**Proposal to Negotiation.** The test is who is engaging with the number. A price going out
is Proposal. The prospect pushing back on the price, the scope, or the terms is
Negotiation. A prospect saying "thanks, reviewing this" is still Proposal.

---

## 4. Mine the meeting summary before the transcript

`LB_INTERNAL_GET_MEETING` returns a structured summary with `## Decisions`,
`## Action Items` with owners, and `## Risks / Open Questions`
(`littlebird-mcp-reference.md`). For stage inference this is the single richest source on
the whole MCP surface, and it is cheaper and more reliable than re-deriving from raw
transcript.

| Summary section | What to take from it |
|---|---|
| `## Decisions` | The strongest stage evidence available. A decision tagged with who made it is close to an exit criterion being met. |
| `## Action Items` | Owner attribution, and the next action per deal. An open item owned by the prospect is a different kind of stall from one owned by the user. |
| `## Risks / Open Questions` | What is blocking the deal, in the participants' own framing. Feeds the going-cold reasoning. |
| `## For You` | What the user specifically was expected to do. Directly usable as the next-action line. |

Take ATTRIBUTION from the summary, never from raw transcript. Transcript chunks are weakly
diarized and frequently tagged `[Others]`; quote them for WORDING only
(`littlebird-mcp-reference.md`, known limitations).

---

## 5. Confidence per placement, and where to be humble

Rate every placement High, Medium or Low per `evidence-standards.md` rule 3.

| Rating | What earns it here |
|---|---|
| **High** | An unambiguous primary artifact (a proposal document naming this prospect, a scheduled call, a signed contract), or two independent observations agreeing |
| **Medium** | One clear observation with no corroboration, or several weak observations pointing the same way |
| **Low** | A single item the retrieval scored 3, an OCR fragment, or a reading that depends on interpreting ambiguous UI |

**Early stages get lower confidence by default.** The archive finds that "the probability
of either winning or losing a sales deal in the early lead stage is more difficult to
predict than analyzing the lead and opportunity phases separately"
(`research/distilled-b2b-pipeline-management.md`, section 3). Placements at Lead and
Qualified are more provisional than placements at Proposal and beyond. Say so on the board.

A Low-confidence placement never drives an irreversible action
(`evidence-standards.md`, rule 3). On this board that means: a Low-confidence Proposal-stage
deal does not get a next action that assumes a proposal was sent.

---

## 6. Show the reasoning, and show the competing reading

Every deal on the board carries a reasoning line. The format:

```
Stage: Proposal (inferred, High)
Because: quote document titled "Northwind retainer v2" visible on screen
  [Wednesday, July 22, 2026 14:10 EDT | chrome]
  plus message from user to Dani containing a monthly figure
  [collected Thursday, July 23, 2026 09:14 EDT | whatsapp | Dani Thompson]
  (sent Jul 23, 8:52 AM)
Not Negotiation because: no observed response from Dani engaging with the number
Would change this: any reply from Dani discussing the price, scope or start date
```

Four parts, all four mandatory:

1. **The stage, marked as inferred, with a confidence.**
2. **The evidence**, each item with its receipt (`evidence-standards.md`, rule 1).
3. **The competing reading that was rejected, and why.** The forecasting literature's
   documented remedies for overconfidence include considering alternatives explicitly and
   listing reasons the forecast might be wrong
   (`research/distilled-b2b-pipeline-management.md`, section 3). This line applies both.
4. **What would change the placement.** Makes the inference falsifiable and tells the user
   what to look for.

---

## 7. Ambiguous placements: say so and ask

Where the evidence supports two stages roughly equally, do NOT pick one and move on. Put
the deal in the LOWER stage, mark it ambiguous, and raise it in the confirmation pass with
both readings and both evidence sets.

Bias toward the lower stage. The asymmetry is the whole point: a deal placed too high makes
the user stop working it and count revenue that is not coming. A deal placed too low costs
them a moment of correction.

Common ambiguities to expect:

- Proposal drafted versus proposal sent (section 3).
- A call was held but the summary shows no decision and no next step. Qualified or still
  Lead depending on whether anything specific was discussed.
- Pricing appears in a thread but it is unclear which party introduced it.
- A long-quiet deal where the last artifact was strong. Stage is high, the deal may be
  dead. Stage and health are separate columns, see `recency-and-going-cold.md`.

---

## 8. Things this skill does not do

**No win probability per deal, and no weighted pipeline value.** Two academic sources
jointly forbid it. The named obstacles to modelling a B2B pipeline are low transaction
volume, noisy data, and a fast-changing environment
(`research/distilled-b2b-pipeline-management.md`, section 3), and all three are worse for a
solo operator than for the enterprises those papers studied. Separately, a serious
predictive treatment of B2B deal outcome used 20 features and did not use sales stage at
all (`research/distilled-b2b-pipeline-management.md`, section 3). A single operator's deal
history is far too small to fit anything on.

If the user asks for a forecast number, say what the board CAN support: the count of deals
per stage, the known amounts, the count of unknown amounts, and the recency picture. Note
that win propensity in the literature is defined over a specified time window
(`research/distilled-b2b-pipeline-management.md`, section 3), so any forecast without a
window attached is under-specified.

**No conversion rates quoted.** Published stage conversion figures in the archive conflict
roughly twofold on the same metric within a single article, and it is unresolved
(`research/distilled-b2b-pipeline-management.md`, section 5). Quote none of them.

**No stage assigned without evidence.** If a candidate survived the deal-or-not pass in
`deal-identity-and-dedupe.md` but has no artifact indicating any stage, it sits in Lead with
the reasoning line "no stage evidence found", not in a stage that feels right.
