# Cascade tracing

Turning N vendor failure alerts into one root cause and one fix.

## The mechanism

Every subscription vendor runs its own smart-retry schedule and its own staged dunning
sequence [research/distilled-saas-spend-leakage.md, section 5]. When one payment
instrument dies, each vendor independently discovers the failure on its own billing date,
retries on its own cadence, and escalates to its own suspension or deletion warning.

The user experiences this as a dozen unrelated emergencies arriving over two weeks. It is
one emergency with a dozen surfaces.

## The statistical argument for looking

Baseline credit card transaction failure rate is 3.9%, and ACH is 2.1%
[research/distilled-saas-spend-leakage.md, section 5]. Independent failures across many
unrelated vendors inside a short window are far outside that baseline. Two or more vendor
failures in the same 14-day span is enough to justify a root-cause search. Do not report
them separately before running this trace.

## Step 1: harvest every failure signal

Run these with `search_user_context`, `filters.data_source: "snapshots"`, windowed 90
days and walked back month by month.

**Vendor-side dunning language:**

```
"payment failed"
"your payment was declined"
"we could not process your payment"
"action required update your payment method"
"past due invoice"
"your subscription has been paused"
"your account will be suspended"
"your data will be deleted"
"final notice before cancellation"
"retrying your payment"
```

**Issuer-side and bank-side language:**

```
"transaction declined"
"card declined alert"
"insufficient funds"
"your card ending in"
"card expired update payment"
"payment method needs attention"
```

Run the messages source too, with `search_queries_messages`, because failure alerts
frequently arrive as SMS or in-app messages rather than email. Remember that message items
carry both a collection time and a send time and the two are different
[littlebird-mcp-reference.md, search_user_context]. The send time governs the timeline
[evidence-standards.md, rule 8].

## Step 2: build the failure timeline

One row per distinct failure event, sorted by event time, not by relevance and not by
collection time.

| Column | Contents |
|---|---|
| `event_time` | When the failure happened, per the notice |
| `vendor` | Who is complaining |
| `amount` | The failing amount, as shown |
| `instrument` | Card name or last four, where the notice shows it |
| `decline_reason` | Verbatim, where given |
| `escalation_stage` | first notice / retry / warning / suspension / deletion threat |
| `receipt` | The evidence receipt |

Deduplicate first. A single dunning sequence from one vendor produces four or five notices
that all say roughly the same thing, and counting them as separate failures inflates the
picture. Collapse a vendor's notice chain to one row per billing cycle and record the
escalation stage reached.

## Step 3: find the common instrument

Sort the timeline and look for the shared factor. In order of how strong the evidence is:

1. **Same last four digits across vendors.** Conclusive. High confidence, and the root
   cause is named.
2. **Same card brand and same decline reason across vendors, no digits shown.** Strong.
   Medium confidence rising to High if the failures also cluster in time.
3. **Failures clustered inside a short window with no instrument shown anywhere.** Suggestive.
   Medium. Report as an inference and name what would confirm it.
4. **Failures spread evenly across months with different reasons.** Probably not a cascade.
   Report as separate problems.

Look also for the leading indicator: a card expiry notice, a bank balance warning, a
declined transaction alert, or a card replacement confirmation that predates the first
vendor failure. That artifact is the root cause in the user's own capture, and finding it
converts an inference into an observation.

## Step 4: state the finding as a cause, not a list

The output shape:

```
ROOT CAUSE (inferred, Medium confidence rising to High if the card is confirmed)
One payment instrument appears to have stopped working around 2026-07-28.
Eleven vendors have since raised failures totalling an observed $1,817.94.

Supporting observations:
- [card alert receipt] card ending 4417 declined, 2026-07-28
- [vendor receipt] Supabase payment failed $700.19, 2026-07-30, retry 3, shutdown warning
- [vendor receipt] maildoso payment failed $499, 2026-08-01
... (full timeline attached)

Counter-evidence considered: two failures on 2026-06-02 predate the card event and
name a different instrument. Those are separate and are reported separately.

ONE FIX
Update the payment instrument. Ten of the eleven vendors resolve on the next retry.

THE EXCEPTION
AudienceLab has reached a data-deletion warning stage and may need direct contact
rather than a passive retry.
```

The counter-evidence line is not optional. A cascade narrative is attractive and will
absorb failures that do not belong to it. State what did not fit.

## Step 5: triage by damage, not by amount

The ordering rule that matters. Rank by what is about to be lost, not by dollar size.

| Tier | Condition | Why it leads |
|---|---|---|
| 1 | Data deletion threatened | Irreversible. Money is recoverable, data is not. |
| 2 | Service shutdown threatened on production infrastructure | Causes an outage. |
| 3 | Account suspension on a tool in active use | Blocks work. |
| 4 | Suspension on a tool with no recent use | May be a free cancellation, see below. |
| 5 | Retry pending, no threat yet | Time remains. |

The archive contains no source on standard grace-period or suspension-to-deletion
timelines by vendor [research/distilled-saas-spend-leakage.md, section 9, gap 3]. Take
every timeline from the vendor's own captured notice and quote it. Do not estimate how
long the user has.

## Step 6: cross the cascade against the zombie list

This is where cascade tracing pays for itself twice.

A failing charge on a vendor whose `usage_verdict` is `no-evidence-90d` is not a problem
to fix. It is a cancellation the vendor has already started. Do not restore payment. Move
it to the cancel list and confirm the account is closed cleanly rather than left in a
suspended state that will resume billing when a card is added.

Split the cascade output into two lists:

- **Restore payment.** Vendors that are used, or that are `background-suspected`, or where
  data loss is threatened. Fix these first regardless of usage, because deletion is
  irreversible and can be undone later by cancelling deliberately.
- **Let it lapse, then close properly.** Vendors that are unused and threaten nothing but
  their own suspension. Note that lapsing is not cancelling. An unpaid account often stays
  open and starts charging again when a working card appears. Cancel it explicitly.

## Step 7: what to hand back

Add these to the ledger:

- `status` set to `failing` for every vendor in the cascade.
- The failure amount and the escalation stage in the evidence column.
- A note where the failing amount differs from the ledger amount, because a failing charge
  that is larger than the known price usually means accumulated arrears or a metered
  overage, and that is its own finding.

## Illustrative example

A general-purpose daily routine, not designed for spend auditing at all, surfaced this
pattern from ordinary capture on a real account: an infrastructure vendor failing
repeatedly at $700.19 with a shutdown warning, an AI coding tool at $216 and again at $90,
an email infrastructure vendor at $499, a data API at $95, a code review tool at $73.75, a
media editor at $65, an AI gateway at $49, a proxy service at $30, plus a secrets manager,
a writing tool, an affiliate platform, and an audience tool threatening data deletion.
Every one of them traced back to a single unfunded business card.

Two lessons from that receipt. First, the signal is present in ordinary capture with no
finance integration, so a dedicated sweep will find considerably more. Second, the daily
routine reported those items as a list of twelve problems. A cascade trace reports one
problem, one fix, and one exception, which is the difference between an alarming report
and an actionable one.

## Empty retrieval

No failure signals in the window is a good outcome and a reportable one. Say the window
searched and the queries run, and state that no payment failures were observed. Do not
infer financial health from that absence: a clean sweep means nothing failed on screen, not
that nothing failed [evidence-standards.md, rule 2].
