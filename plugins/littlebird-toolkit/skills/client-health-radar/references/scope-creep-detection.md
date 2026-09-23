# Scope creep detection

Scope creep is the margin half of this skill. It is the reason a client can be delighted and
still be the worst account on the roster.

## Why a capture-based detector has a job here at all

The professional services definition: "the gradual, uncontrolled expansion of a project's
original requirements without a corresponding adjustment in budget, timeline, or resource
allocation", showing up as unbilled favor-based work
(`references/research/distilled-client-health.md`, section 5).

The mechanism is accumulation below the escalation threshold. Changes start as a sponsor asking
for "one more feature" and then "quietly accumulate" because boundaries expand "slowly, often
unnoticed" (`references/research/distilled-client-health.md`, section 5).

Every individual ask is small enough that nobody escalates it. Nobody has the record. The record
is the entire product here.

## The rule that keeps this honest

**Every flagged item carries the quote where the ask actually happened, with its meeting name
and date. No quote, no item.**

An out-of-scope item without its originating quote is an accusation, and the user will bring it
to a client conversation and be wrong about it. If the transcript does not contain a locatable
ask, the item does not go in the report; it goes in a separate list called Possible, unconfirmed
with a note saying what was found and what was missing.

## Where the asks come from, both directions

The professional body splits causes into external and internal, and the internal column is as
large as the external one (`references/research/distilled-client-health.md`, section 5):

| External to the delivery team | Internal to the delivery team |
|---|---|
| Customer requirement changes | Inclination to improve the product |
| Environment and platform changes | Desire to exceed the minimum requirement |
| Poor initial understanding of requirements | No change control procedure |
| Vague specifications and statements of work | Undocumented modifications with no impact assessment |

A detector that only looks for client demands misses half the problem. Look for both:

- **Client-originated:** an ask in a meeting or a thread for something not previously agreed.
- **User-originated:** work the user volunteered. In the summary structure this shows up in the
  `## For You` section and in `## Action Items` tagged to the user, for deliverables that were
  never in any earlier scope discussion. This one is uncomfortable to report and it is the one
  users most need to see.

## Detection procedure

### 1. Establish what in-scope means for this client

Search for the scope-defining moment before hunting for departures from it.

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      client name plus "scope" or "statement of work" or "kickoff" or "deliverables"
  start_date: engagement start if known, else 180 days ago
  end_date:   today
  limit:      10
```

Also sweep snapshots for a written scope document on screen:

```
search_user_context
  search_queries: [client name plus "statement of work",
                   project codename plus "scope",
                   client name plus "proposal"]
  filters:        {data_source: "snapshots"}
```

**If no scope baseline is found, say so and stop this family for that client.** Report: "No
captured scope definition found for this client in the window searched, so out-of-scope work
cannot be distinguished from agreed work." That is an honest and useful finding. It is not a
reason to guess. Offer the user the option to state the scope in one line via `AskUserQuestion`,
which then gets stored in the roster file and reused.

### 2. Harvest candidate asks

Run these as separate narrow calls per client.

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      one phrase per call from the list below
  attendees:  the client's contact names
  start_date: window start
  end_date:   today
  limit:      10
```

Phrases that surface asks:

| Phrase family | Examples |
|---|---|
| Additive | "can you also", "while you're in there", "one more thing", "small ask" |
| Minimizing | "quick", "just", "shouldn't take long", "tiny tweak" |
| Assumptive | "I assumed that was included", "we thought this was part of" |
| Expansive | "and for the other brand", "and the same for", "can we extend this to" |
| Post-hoc | "actually, could it also", "one revision more" |

The minimizing family is the highest-yield one. The size adjective in front of an ask is the
mechanism by which it stays below the escalation threshold.

Then take from every meeting summary in the window:

- `## Action Items` tagged to the user that do not map onto any scope-baseline deliverable
- `## Decisions` that changed a deliverable
- `## Risks / Open Questions` mentioning timeline, budget or extra work

### 3. Locate the quote

For each candidate, pull the transcript of the specific meeting and find the actual sentence.

```
LB_INTERNAL_GET_MEETING_TRANSCRIPT
  meeting_id: the meeting the candidate came from
```

**Attribution discipline.** Transcript chunks are weakly diarized and often tagged `[Others]`
(`references/littlebird-mcp-reference.md`). Quote the transcript for the WORDING of the ask. Take
the owner attribution from the summary's Action Items block, not from the transcript. If the
report needs to say which client-side person asked, and only the transcript has it, write "a
client-side participant asked" and rate the attribution Low
(`references/evidence-standards.md`, rules 3 and 4).

### 4. Triage each candidate

Four questions, adapted from the consulting guide's five by dropping the one a capture tool
cannot answer (`references/research/distilled-client-health.md`, section 5):

1. Does the ask align with the original engagement goals?
2. What is the impact on schedule, budget and resources?
3. Is it necessary to achieve the core deliverables?
4. Are there alternatives?

Classify into four buckets:

| Bucket | Definition | What the report does with it |
|---|---|---|
| **In scope** | Maps onto a scope-baseline deliverable | Dropped, not reported |
| **Out of scope, absorbed** | Not in the baseline, evidence it was delivered anyway, no evidence of a change order | The margin finding. Reported with quote, date and estimate |
| **Out of scope, open** | Not in the baseline, asked for, no evidence of delivery or refusal | Reported as a live decision the user still gets to make |
| **Out of scope, handled** | Not in the baseline, evidence of a change order, a quote, or an explicit decline | Reported in the count only, as evidence the user's change control is working |

That last bucket matters. A report that only shows leakage teaches the user nothing about what
they are already doing right, and the count of handled versus absorbed is the single most useful
ratio this family produces.

### 5. Estimate the accumulation

The archive contains no method for valuing out-of-scope work
(`references/research/distilled-client-health.md`, section 8, gap 6). The skill therefore does not
model a cost. It reports what it counted and asks the user for the hours.

Report, per client, in this order:

1. **Count of out-of-scope asks** in the window, split absorbed / open / handled. Fully
   observed, High confidence.
2. **The dated list**, each with its quote and receipt. Fully observed.
3. **Hours**, which the skill does not know. Present the absorbed list and ask the user via
   `AskUserQuestion` to put an hours figure on each item or on the group. Their estimate, not the
   skill's.
4. **Currency figure**, computed only if the roster carries a rate for that client and the user
   supplied hours. Present it as `hours the user estimated x the rate on file`, showing both
   inputs, so it reads as arithmetic on the user's own numbers rather than as a finding.
5. **The ratio**, absorbed asks to handled asks, over the window.

Never produce a currency figure from a hours estimate the skill invented. That is exactly the
false precision this skill is built to avoid, and it will be the first number a user checks and
the first one that destroys their trust.

## The trend, which is the real finding

One out-of-scope ask is noise. The finding is the rate and its direction.

Split the window into thirds and count absorbed out-of-scope asks per third. A client going from
one to two to five is a different report from a client sitting flat at two. Present the three
counts, the dates spanned, and nothing else. Do not fit a curve to three points.

Cross-reference with the promise ledger from `references/signal-extraction.md`. The pattern worth
naming explicitly: **rising absorbed scope while the client owes the user approvals or payment.**
That combination is the margin killer and the churn risk arriving together, and it is the single
most useful cross-signal this skill produces. Report it as a named combination with both
underlying evidence sets shown, and mark the combination as an inference
(`references/evidence-standards.md`, rule 2).

## What this family reports when it finds nothing

Two distinct empty cases and they mean opposite things:

| Case | What to write |
|---|---|
| Scope baseline found, no out-of-scope asks detected | "No out-of-scope asks detected against the scope defined in [meeting, date], across N meetings and M threads searched." This is a genuinely good result and should be said as one |
| No scope baseline found | "No captured scope definition found, so out-of-scope work cannot be distinguished from agreed work." Not a good result and not a bad one. It is a gap in the record |

Never report the second case as if it were the first.

## The one thing this family must never do

Do not draft a message to the client about scope. Not a gentle one, not a template. Scope
conversations are the highest-stakes conversation in an agency relationship, and a draft written
from a partial record and sent under time pressure will be wrong in front of the person who is
paying. The skill surfaces the record, ranked and dated, and hands it to the user.

If the user explicitly asks for drafted language, it goes through the approval gate in SKILL.md
like everything else: full text shown, evidence shown, `AskUserQuestion` with send / edit / hold
/ drop, and the skill hands the approved text back rather than sending it
(`references/evidence-standards.md`, rule 6).
