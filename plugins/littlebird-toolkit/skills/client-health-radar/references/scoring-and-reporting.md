# Scoring and reporting

How the five signal families become a band, a rank and one recommended action, without producing
a number that pretends to be a measurement.

## The governing decision: bands, not a score

A health score is a conversation starter, not a verdict. Do not produce a 73 out of 100.

Three reasons, all from the archive.

1. **The single-score failure is named by two independent sources.** TSIA calls it the Swiss Army
   knife problem: a score "trying to measure everything, but accurately predicting almost
   nothing", and the recommendation is explicitly to replace one composite with "multiple focused
   models". A second source states the same failure as "One score is trying to do everything"
   (`references/research/distilled-client-health.md`, section 3).
2. **No number in this domain is checkable.** Every published churn percentage, retention
   benchmark and predictive-lift figure found in the sweep is attributed at second or third hand
   with no linkable primary (`references/research/distilled-client-health.md`, section 1). There
   is nothing to calibrate a score against.
3. **All of it is SaaS-shaped.** The inputs a health score is built from, product usage, support
   tickets, seat counts, do not exist in an agency relationship
   (`references/research/distilled-client-health.md`, section 2). A number derived from a
   different set of inputs than the literature assumes, calibrated against benchmarks that are
   not checkable, is decoration.

A weighted composite would also inherit the stale-weights failure: "Your weights were set once
and never recalibrated" (`references/research/distilled-client-health.md`, section 3). Bands with
named evidence have no weights to go stale.

## The four bands

| Band | Meaning | Entry condition |
|---|---|---|
| **Green** | No flagged signals this window | No signal reached flag level in any family |
| **Amber** | One flagged signal, or two watch-level signals | See the table below |
| **Red** | Two or more flagged signals, or any single escalate-level signal | See the table below |
| **Unknown** | Not enough captured evidence to say | Fewer than two recorded meetings AND fewer than three thread exchanges in the window |

**Unknown is a real band and it is used.** A client the skill cannot see is not a green client.
Reporting thin coverage as green is the same error as reporting an absence as a negative finding
(`references/evidence-standards.md`, rule 2). Unknown clients appear in the report with the
queries run and the coverage counts, and with one recommended action: get the next conversation
recorded.

### What counts as a flag, by family

| Family | Watch | Flag | Escalate |
|---|---|---|---|
| Unmet promises, client owes user | Any item open 8 to 14 days | An approval, access, asset or payment item open 15 days or more | Any item open 30 days or more, or restated 3 or more times and still open |
| Unmet promises, user owes client | Any item open 8 to 14 days | Any item open 15 days or more | Any item open 30 days or more, or restated 3 or more times |
| Silence gap | Gap above baseline, below twice baseline | Gap at or above twice baseline | Gap at or above three times baseline, or a recurring call skipped twice consecutively |
| Room composition | Headcount change of one on the client side | A regular attendee absent across 2 or more consecutive instances, or a new senior name appearing | A partner review, procurement, legal or security review appearing |
| Register and asks | Question count per meeting down by half | Asks shift from direction and reasoning to confirmation, documentation or access | An explicit request for exports, source files, asset inventories or account access |
| Scope creep | Any absorbed out-of-scope ask | Absorbed asks rising across window thirds | Rising absorbed scope while the client owes the user approvals or payment |
| Commercial | Renewal within 60 days | Late invoice, or a budget-reduction or pause discussion | Renewal conversation postponed, or a downgrade discussion with a named number |

These thresholds are not derived from research and must not be presented as if they were. They
are a defensible starting shape, and the report says so once: "These bands are a triage aid, not
a measurement. The evidence under each one is the actual finding." The only quantity in this
skill that is genuinely derived from data is the per-client cadence baseline, and that is derived
from the user's own history, which is the one baseline with receipts
(`references/research/distilled-client-health.md`, sections 1 and 2).

Let the user override any band. Store overrides in `client-roster.md` so the next run respects
them.

## The ranked risk list

Rank by, in order:

1. Red before amber before unknown before green.
2. Within a band, by revenue exposure if the roster carries a rate and engagement type,
   otherwise by count of escalate-level signals.
3. Within that, by proximity of the next commercial checkpoint.

Present at most five clients in the ranked list even if more qualify. A list of twelve at-risk
clients does not get acted on. Say how many more exist below the cut and where to see them.

## One recommended action per at-risk client

Exactly one. Not a plan, not three options, one next physical action the user could do today.

Rules for the action:

- It names a person and a channel. "Call Dana" not "re-engage the stakeholder".
- It is derived from the highest-severity signal, not from an average of the signals.
- It never sends anything. See the approval gate in SKILL.md.
- Where the top signal is a silence gap, the action is a conversation, not a written update. Where
  the top signal is an unmet promise the user owes, the action is either doing it or renegotiating
  the date, presented as a choice.
- Where the top signal is scope creep, the action is to look at the record before saying anything,
  because scope conversations from a partial record go badly
  (`references/scope-creep-detection.md`).

The literature's actionability failure is the one to avoid here: scores that fail to answer
"What's causing the issue. Who should take action. What the next best step is."
(`references/research/distilled-client-health.md`, section 3). One named action against one named
cause is the answer to all three.

## The named output artifact

A deep run writes one file:

```
client-health-YYYY-MM-DD.md
```

in the working directory, or the directory the user names. A single-client deep dive writes:

```
client-health-<client-slug>-YYYY-MM-DD.md
```

Sections, in this order.

### 1. Header

Window covered. Roster file path. Number of clients on the roster, by status. The limitation note
verbatim from `references/sentiment-limits.md`. One line stating that bands are a triage aid and
the evidence is the finding.

### 2. Coverage

Per client: recorded meetings found, unrecorded calendar events found, thread exchanges found,
snapshot items found, aliases used, and whether a cadence baseline was derivable and from how many
intervals. This section is what makes every other section checkable, and it is where thin coverage
gets admitted rather than hidden.

### 3. What changed since the last report

The most important section, and the reason the routine reads its own past reports. Four
subsections, each of which may be empty:

- **Moved worse.** Client, previous band, current band, and the specific new signal that moved it.
- **Moved better.** Same shape. Say what resolved it.
- **Held.** Clients in the same band as last time, with a count of how many consecutive reports
  they have held it. Anything held for three or more reports gets its own line saying so, because
  a client amber for six weeks is a different problem from one that went amber this week.
- **New and departed.** Clients added to or removed from the roster.

On a first run there is no previous report. Say that explicitly and label the whole report a
baseline rather than silently presenting standing state as change.

### 4. Ranked risk list

Up to five clients. Per client, on one screen:

```
1. Acme Industrial            RED   (was AMBER, 2 reports)
   Top signal:  No captured substantive contact in 26 days.
                Baseline gap for this client is 7 days, from 11 intervals.
                Last contact: Acme weekly, 2026-07-22.
   Also:        Source-file access requested 2026-07-15 [Acme weekly, Risks / Open Questions]
                Approval on phase 2 open 31 days, restated 3 times [Acme weekly, Action Items]
   Commercial:  Retainer. Next checkpoint 2026-11-01, 76 days out.
   Confidence:  High. Three independent observations agree.
   Do this:     Call Dana Reyes. Do not email. Ask for a date on the phase 2 approval,
                not for the approval.
```

The band, the previous band, and the hold count are always visible together.

### 5. Per-client detail

One section per active client, including green ones, in roster order rather than risk order so a
user can find a specific client. Each contains:

- The band and its evidence, item by item, each with a receipt and a confidence rating.
- The promise ledger, two columns plus the unassigned list.
- The cadence baseline, the number of intervals it came from, and the current gap.
- The register comparison, early third versus late third, in the two-column quote format from
  `references/sentiment-limits.md`.
- Scope: counts by bucket, the dated absorbed list with quotes, and the trend across window
  thirds.
- Commercial: what was found, and what was looked for and not found.
- Open gaps: what the skill looked for and could not see, named explicitly
  (`references/evidence-standards.md`, rule 2).

### 6. Possible unlisted clients

Counterparties that surfaced and are not on the roster, one line and one receipt each, with an
offer to add them. Never reported on.

### 7. Method

The queries run, the windows, and the definitions used for substantive contact and for the band
thresholds. This is what lets a user reproduce or challenge any line in the report.

## Evidence formatting, non-negotiable

Every factual line carries a receipt in the canonical form
(`references/evidence-standards.md`, rule 1):

```
[Acme weekly sync, 2026-08-11, Action Items]
[collected Sunday, June 14, 2026 13:57 EDT | slack | Dana Reyes] (sent Jun 8, 6:30 PM)
[Tuesday, August 11, 2026 23:40 EDT | chrome]
```

Every line is observed, inferred, external or unknown, and the kind is visible
(`references/evidence-standards.md`, rule 2). Every actionable claim is rated High, Medium or Low
(`references/evidence-standards.md`, rule 3). A Low-rated claim never drives an irreversible
action.

Sort every sequence by event time, not by retrieval relevance
(`references/evidence-standards.md`, rule 8).

Raw retrieved capture is working data and does not ship in the artifact
(`references/evidence-standards.md`, rule 7). Process it, distill it, drop the rest.

## Numbers this skill is forbidden to produce

| Forbidden | Why |
|---|---|
| A composite health score out of 100, or any single scalar | The Swiss Army knife failure, named by two sources (`references/research/distilled-client-health.md`, section 3) |
| A sentiment score of any kind | `references/sentiment-limits.md` |
| A churn probability | Nothing in the archive supports estimating one for a project-based services relationship (`references/research/distilled-client-health.md`, section 2) |
| A comparison of the user's churn to an industry average | The most-cited agency benchmark table discloses no methodology at all (`references/research/distilled-client-health.md`, section 1) |
| A currency figure for absorbed scope built on hours the skill estimated | `references/scope-creep-detection.md`. Hours come from the user |
| Any percentage quoted from the retention literature | Every one found is second-hand and unlinkable (`references/research/distilled-client-health.md`, section 1) |

Numbers this skill DOES produce, because they are arithmetic on the user's own captured history:
days since last contact, the median cadence gap and the interval count behind it, item ages in
days, restatement counts, counts of out-of-scope asks by bucket, attendee counts per meeting, and
days to the next commercial checkpoint. Every one of those is checkable against the receipts in
the same report.

## Nothing goes to the client

This skill produces an internal view. No message, summary, update or status report generated here
is client-ready, and none of it leaves without the approval gate in SKILL.md. Any drafted outreach
is marked, at the top of the draft, as held for approval and not sent
(`references/evidence-standards.md`, rule 6).
