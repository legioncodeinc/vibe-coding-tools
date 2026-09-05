# Action pack and negotiation

Turning the ledger into five lists and a set of drafts the user approves before anything
leaves the building.

## The five lists

Every vendor on the confirmed ledger lands in exactly one list. A vendor in two lists is a
decision the skill failed to make.

| List | Entry condition |
|---|---|
| **Cancel** | `no-evidence-90d`, not `background-suspected`, no data the user needs held inside it. |
| **Downgrade** | `fading` or `dormant`, or observed use far below the paid tier, or a metered plan with consistent underuse. |
| **Consolidate** | Two or more vendors serving the same job, where one can absorb the other. |
| **Renegotiate** | Active, used, and either above a price the capture shows rising, or approaching a renewal. |
| **Keep** | Active, used, priced as expected. Named explicitly so the user sees the audit considered it. |

The Keep list is not padding. An audit that only shows problems reads as a sales pitch for
its own findings.

## Ordering, and why downgrade usually beats cancel

The research is unambiguous that underutilization is the larger pool. 51% of licenses are
underutilized against 14% entirely unused, and combined waste sits at 65%
[research/distilled-saas-spend-leakage.md, section 1]. The Vertice framing is that
right-sizing "is one of the single largest savings opportunities available without cutting
a single tool entirely" [raw/spend--shelfware--vertice-unused-2026.md].

A skill that produces a long cancel list and a short downgrade list is addressing the
smaller bucket and asking the user to take the more painful action to get it. Build the
downgrade list first.

Note the definitional limit: that 51% is seat-based, meaning under 50% of purchased seats
in use, and a single-seat operator has no seat dimension
[research/distilled-saas-spend-leakage.md, section 9, gap 2]. For a solo operator the
equivalent question is tier utilization, and the archive holds no benchmark for it. Ask
the tier question from observed usage instead of applying the seat statistic.

## Building the consolidate list

Cluster the ledger by job to be done. Seed with the categories the research names as most
commonly duplicated [research/distilled-saas-spend-leakage.md, section 4]:

1. Communication: Slack, Teams, Zoom, Meet, Loom, Discord
2. AI assistants: ChatGPT, Claude, Copilot, Gemini, Perplexity
3. Project management: Asana, Notion, Jira, Linear, ClickUp, Monday
4. Note-taking and meeting AI: Otter, Fathom, Fireflies, Granola, native tools
5. Whiteboards and canvas: Miro, FigJam, Mural, Lucid, Excalidraw

Then extend past that list with clusters a small operator actually accumulates: email
sending and deliverability, data enrichment and lead APIs, scheduling, form builders,
password and secrets management, analytics, hosting and deploy targets, CRM, and
automation platforms.

For each cluster, report:

- Every vendor in it, with monthly cost and usage verdict.
- Which one shows the most use.
- What the others are doing that the leader cannot.
- Total cluster spend and the spend remaining if the cluster collapsed to one.

**Two rules that keep this honest.** First, do not recommend consolidation onto a tool
whose feature coverage you have not observed. Capture shows which tool the user opens, not
which features they depend on. Ask. Second, migration has a cost the audit does not see:
export effort, integration rewiring, and retraining. Present the saving and name the
migration cost as an unknown rather than netting it out to zero.

**The AI bundling cluster gets its own pass.** Roughly 70% of AI interaction now happens
through features embedded in already-approved SaaS, and ungoverned stacks carry up to 5x
more redundant AI subscriptions [research/distilled-saas-spend-leakage.md, section 4]. A
standalone AI tool sitting idle next to a bundled AI feature in active use is the single
highest-yield consolidation available in 2026.

## Building the renegotiate list, and timing it

Two different clocks. Route by contract type, because the sources appear to disagree and
do not [research/distilled-saas-spend-leakage.md, section 6].

**Negotiated contracts with an order form and an account manager.** Begin 90 to 120 days
before expiration [research/distilled-saas-spend-leakage.md, section 6]. Standard
auto-renewal notice is 30 days, which covers around 84% of standardized SaaS agreements;
60 days appears in buyer-protective negotiated deals; 90 days is aggressive and forces a
decision before the term can be evaluated [same].

**Self-serve subscriptions on a card.** Approach 5 to 10 days before renewal
[research/distilled-saas-spend-leakage.md, section 6]. The reasoning from the source:
before renewal you are a customer they are about to lose; after it you are a refund
request [raw/negotiation--price-reduction--subspend-2026.md].

**Urgency rule.** Any vendor whose next charge is inside 30 days may already be past its
cancellation notice window. Flag those at the top of the action pack with the date, and say
plainly that the window may have closed.

## Price increase thresholds

From the contract research [research/distilled-saas-spend-leakage.md, section 6]:

- Buyer-protective cap: the lesser of 5% or CPI, applied once, with a ceiling on CPI.
- What vendors typically seek: approximately 12% annually.

So a captured renewal notice showing an increase above roughly 5% exceeds the
buyer-protective norm and belongs on the renegotiate list. Above 12% it exceeds even the
typical vendor ask and belongs at the top of it. Both thresholds come from the same
source [research/distilled-saas-spend-leakage.md, section 6] and are vendor-survey
figures, not a legal ceiling.

Structural asks worth making at any renewal, from the same source: fixed annual renewals
rather than evergreen clauses or multi-year re-locks, and renewal-pricing protection
raised before any discount discussion.

## What is realistically obtainable

Ranges for an individual buyer [research/distilled-saas-spend-leakage.md, section 7]:

| Lever | Range | Best for | Source |
|---|---|---|---|
| Percentage discount | 10% to 50%, typically 15% to 30% | consumer and prosumer SaaS | [research/distilled-saas-spend-leakage.md, section 7] |
| Free months | 1 to 3 added | annual plans | [research/distilled-saas-spend-leakage.md, section 7] |
| Tier downgrade | $5 to $12 per month | services with a lower tier | [research/distilled-saas-spend-leakage.md, section 7] |
| Annual prepay | roughly 15% to 20%, about 2 months free | software and productivity tools | [research/distilled-saas-spend-leakage.md, section 7] |

Carry the caveat the archive records: that sample is consumer-weighted, so the $5 to $12
downgrade range is low for B2B tooling and must not be quoted as a B2B expectation
[research/distilled-saas-spend-leakage.md, section 7].

## Working the cancel flow deliberately

Cancellation flows follow a fixed structure: exit survey, then segmentation on the answer,
then a personalized offer matched to the stated reason
[research/distilled-saas-spend-leakage.md, section 7]. They recover 10% to 34% of users
who explicitly try to cancel, and where pause is offered, 25% of would-be churners pause
instead [same].

The operative point for a buyer: **the offer is selected from the reason given.** A price
reason routes to a discount. A usage reason routes to a downgrade or a pause. That is a
controllable input, and it means the reason should be chosen to match the outcome wanted:

- Want a discount, give a price reason.
- Want a smaller plan, give a usage reason.
- Want a pause because the work is seasonal, say the work is seasonal. Pause is often not
  advertised until cancellation is initiated.

Note the scope limit the archive records: this describes consumer and prosumer self-serve
flows. An enterprise contract with a signed order form has no self-serve cancel flow, and
the equivalent path is a renewal conversation
[raw/negotiation--cancel-flows--userpilot-2026.md].

**If the vendor declines, cancel for real**
[research/distilled-saas-spend-leakage.md, section 7]. A bluff that is not executed
teaches the vendor the threat carries no weight, and it leaves the charge in place.

## Legal reality, so the user is not promised a fast path

- The Eighth Circuit vacated the FTC Click-to-Cancel Rule in full in 2025
  [research/distilled-saas-spend-leakage.md, section 8].
- The FTC reopened rulemaking with an ANPRM around 2026-03-10, comments closed 2026-04-13
  [same].
- No federal rule currently requires cancellation to be as easy as signup. Enforcement
  continues under Section 5 and ROSCA [same].
- Roughly 30 states have auto-renewal statutes, but most are consumer-only, so B2B
  protection comes from negotiated terms [same].
- California's ARL requires annual renewal reminders that disclose price and available
  cancellation mechanisms [same]. Those reminders are excellent capture targets, because
  they carry both a price and a date.

Budget real time per cancellation. Phone-only cancellation and retention gauntlets remain
legal in most B2B contexts.

## Record the revert date

Any negotiated rate has an expiry. Record the discounted rate, its duration, and its
revert date in the ledger's `discount_revert_date` column the moment it is agreed. The
revert date is when the negotiation has to happen again
[research/distilled-saas-spend-leakage.md, section 7]. A discount that silently reverts is
a future leak the audit created.

## Projected savings, with error bars

Report savings by action, never as one number.

| Action | Saving basis |
|---|---|
| Cancel | Full monthly equivalent, from the observed amount. |
| Downgrade | Difference between current tier and target tier. Only where both prices were observed. |
| Consolidate | Sum of absorbed vendors, minus any tier increase on the survivor. |
| Renegotiate | Do not book a number. Present the range and label it as a range. |

Rules that keep the total honest:

- A saving inherits the confidence of the amount it came from. A Medium amount produces a
  Medium saving, and it says so beside the number.
- Never book a negotiation outcome as a saving before it happens. The 15% to 30% typical
  discount range [research/distilled-saas-spend-leakage.md, section 7] is what other
  people got, not what this user will get.
- Never book a downgrade saving where the target tier's price was not observed. Mark it
  `price unknown` and say what would confirm it.
- Present three totals: confirmed savings from High-confidence cancels, probable savings
  including Medium, and a negotiation range presented separately and not added in.

## Drafting cancellation and negotiation emails

Draft them. Do not send them. This is absolute.

Nothing generated from capture goes to another human without explicit approval of the
actual text, not a summary of it [evidence-standards.md, rule 6]. The skill writes every
draft into the drafts file and stops. It does not call an email tool. It does not open a
compose window and fill it. It does not offer to send.

Each draft carries a header before the body:

```
TO: billing@vendor.example
SUBJECT: Cancellation request, account [account identifier if observed]
BASIS: no evidence of use in 94 days; observed $65/month, Medium confidence
STATUS: HELD FOR APPROVAL. Not sent.
UNKNOWNS: account number not observed in capture, user must supply
```

Draft structure for a cancellation, kept short because short requests get processed:

1. State the account and the subscription being cancelled.
2. State the effective date wanted.
3. Ask for written confirmation of cancellation and of the final charge date.
4. Ask what happens to stored data and how long it is retained.
5. Nothing else. No justification, no apology, no opening for a retention pitch.

Draft structure for a negotiation, following the source's script shape
[research/distilled-saas-spend-leakage.md, section 7]:

1. State how long the user has subscribed.
2. State why the current price no longer fits the observed usage, using the actual usage
   evidence from the ledger.
3. Name exactly what would keep them: a specific tier, a specific rate, a pause of a
   specific length.
4. Stop. Do not negotiate against yourself in the first message.

**Never put raw capture in a draft.** Retrieved material is working data and does not ship
[evidence-standards.md, rule 7]. A cancellation email does not quote the user's screen,
name other vendors, or reveal anything about their stack beyond the account being
cancelled.

**Confidence gate on drafts.** A Low-confidence claim never drives an irreversible action
[evidence-standards.md, rule 3]. Do not draft a cancellation for a vendor whose existence
or price rests on a Low-rated read. Ask first.

## The approval gate

Before the action pack is considered delivered, run `AskUserQuestion` covering:

1. The cancel list. Approve each line, or move it.
2. Any `background-suspected` vendor. These are the ones that break something when
   cancelled.
3. Each drafted email, by its text.

Then stop. The user sends. The skill does not.
