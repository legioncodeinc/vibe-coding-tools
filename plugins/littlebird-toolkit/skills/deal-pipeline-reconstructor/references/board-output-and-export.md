# Board output and export

The shape of the deliverable, the confirmation gate that makes it real, and how to get it
out of this session without assuming a CRM connector exists.

---

## 1. The artifact

One file: **`pipeline-board-YYYY-MM-DD.md`**, dated to the day the board was built, in the
user's working directory unless they name another location.

Optionally one companion file: **`pipeline-board-YYYY-MM-DD.csv`**, only if the user asks
for an export. See section 6.

**The board is internal.** Nothing in it goes to a prospect. It contains inferred stages,
confidence ratings, and candid notes about people who have not replied. Say this at the top
of the file.

---

## 2. Sections, in this order

### 1. Header

Date built, retrieval window used, deal count, and one line stating that stages are
inferred from observed activity and were confirmed by the user on DATE, or are UNCONFIRMED.

### 2. Confirmation status

Second, so nobody misses it. Either:

- "Confirmed by you on DATE. Stage changes you made: N. Merges you rejected: N. Candidates
  you excluded: N." Or:
- "NOT CONFIRMED. Every stage on this board is an inference and has not been checked. Do
  not act on it as a pipeline until you run the confirmation pass."

### 3. The board

Stage by stage, in order: Lead, Qualified, Proposal, Negotiation, Closing, then the Won and
Lost tail. Within each stage, order by going-cold severity
(`recency-and-going-cold.md`, section 5).

Per stage, a header line with the deal count, the sum of KNOWN amounts, and the count of
unknown amounts. Never a weighted value (`stage-inference.md`, section 8).

Per deal, a block:

```
### Dani Thompson, Northwind Systems
Opportunity: monthly retainer, content + community
Amount: 4,200 USD per month (quoted, not agreed)
  [Wednesday, July 22, 2026 14:10 EDT | chrome]
Contacts observed: at least 2 (Dani Thompson, Marco Ruiz)
First touch: 2026-06-30   Last touch: 2026-07-23 (outbound)
Days silent: 25   Stage threshold: 10 days (Proposal, default)
Status: COLD

Stage: Proposal (inferred, High)
Because: quote document titled "Northwind retainer v2" visible on screen
  [Wednesday, July 22, 2026 14:10 EDT | chrome]
  plus message from user to Dani containing a monthly figure
  [collected Thursday, July 23, 2026 09:14 EDT | whatsapp | Dani Thompson]
  (sent Jul 23, 8:52 AM)
Not Negotiation because: no observed response from Dani engaging with the number
Would change this: any reply from Dani discussing price, scope or start date

Next action: Send Dani the two-tier version she asked about on the Jul 18 call,
  and name a start date.

Evidence trail:
- 2026-06-30  Intro DM from Dani asking about retainer availability
  [collected Monday, June 30, 2026 11:02 EDT | instagram | Dani Thompson]
  (sent Jun 30, 10:47 AM)
- 2026-07-18  Discovery call held, 42 min
  [Dani Thompson and user, 2026-07-18, Decisions]
- 2026-07-22  Quote document on screen
  [Wednesday, July 22, 2026 14:10 EDT | chrome]
- 2026-07-23  Figure sent to Dani
  [collected Thursday, July 23, 2026 09:14 EDT | whatsapp | Dani Thompson]
  (sent Jul 23, 8:52 AM)

Merge basis: tier 1, identical name plus company across DM and calendar. Not queried.
```

Every deal block carries: the four-part stage reasoning
(`stage-inference.md`, section 6), the recency columns
(`recency-and-going-cold.md`, section 8), one next action, and the full evidence trail
sorted by event time.

### 4. Going-cold list

The same deals, extracted and ranked across ALL stages by severity
(`recency-and-going-cold.md`, section 5). Deals with an upcoming hold are excluded and
listed separately as Waiting.

Head this section with one sentence: this is a work queue, not a write-off list, because
every documented cause of a prospect going quiet is about the buyer's own situation rather
than a decision against the seller
(`research/distilled-b2b-pipeline-management.md`, section 6).

Columns: rank, deal, stage, days silent, threshold, ratio, direction of last touch, next
action.

### 5. Ambiguous stage placements

Deals where the evidence supported two stages roughly equally. Both readings, both evidence
sets, and how the user resolved it if they did. Deals still unresolved sit in the LOWER
stage on the board (`stage-inference.md`, section 7).

### 6. Ambiguous merges

Pairs the skill did not resolve, with both fragments and both receipts, and the user's
answer if given (`deal-identity-and-dedupe.md`, section 3).

### 7. Excluded candidates

Every name that surfaced and did not become a deal, with its bucket (partner, vendor,
existing client, ambiguous, not a deal) and the evidence and reason
(`deal-identity-and-dedupe.md`, section 5). **Never silently drop a candidate.** A real deal
disappearing without a trace is the failure the user cannot detect.

### 8. Waiting

Deals suppressed from the cold list because a future meeting is on the calendar, with the
hold date and the caveat that upcoming events carry no id, no summary and no transcript and
were matched by attendee name and title only
(`recency-and-going-cold.md`, section 4).

### 9. Method and gaps

Which queries ran, over which window, with which filters. What came back empty. What the
skill could not determine. Where the thresholds came from (defaults or the user's own
history). Explicitly: the stage-inference mapping is the skill's own reasoning built from
published exit criteria and has no external validation
(`research/README.md`, gap 5).

### 10. What this board is not

Four short lines, stated plainly:

- No win probability per deal and no weighted pipeline value. Both inputs would be
  manufactured (`stage-inference.md`, section 8).
- No conversion rates. Published figures conflict roughly twofold on the same metric
  (`research/distilled-b2b-pipeline-management.md`, section 5).
- Amounts marked Unknown are unknown, not zero
  (`deal-identity-and-dedupe.md`, section 7).
- "No contact observed" is a statement about the capture, not proof that no contact
  happened (`evidence-standards.md`, rule 2).

**Raw retrieved capture does not go in this file.** Process it in temp space and let it go
(`evidence-standards.md`, rule 7).

---

## 3. The confirmation gate

The board is a DRAFT until the user confirms it. This is `evidence-standards.md` rule 6,
confirm before you encode, and it is not optional: the board is about to become the durable
record of who owes what to whom.

It is also what the research prescribes. The judgmental forecasting literature's recurring
finding is that combining human judgment with mechanical method beats either alone
(`research/distilled-b2b-pipeline-management.md`, section 3). The skill's inference plus the
user's correction IS that combination.

Run the gate with `AskUserQuestion`, in batches, in this order:

1. **Is this even a deal.** The ambiguous candidates from
   `deal-identity-and-dedupe.md` section 5, each with its strongest receipts and the five
   buckets as options.
2. **Ambiguous merges.** Both fragments side by side with receipts.
3. **Ambiguous stage placements.** Both readings, both evidence sets, and the reason each
   is plausible.
4. **Low-confidence placements at Proposal or later.** These are the ones with real cost if
   wrong. A Low-rated claim never drives an irreversible action
   (`evidence-standards.md`, rule 3).
5. **The thresholds.** Show the stage thresholds in force and ask whether the user's own
   cycle is faster or slower (`recency-and-going-cold.md`, section 3).

Do not ask about High-confidence placements with clean evidence. Asking about everything
trains the user to click through, which destroys the gate.

After the gate, write the confirmed board and record the answers so the next run does not
re-ask the same questions.

---

## 4. Never send anything

The draft-never-send law applies in full. Nothing in this board goes to a prospect, no
matter how good a next-action line looks and no matter which connectors are available.

If the user asks the skill to send a follow-up, that is a separate act requiring approval of
the actual final TEXT through `AskUserQuestion`, not approval of the plan or of the board.
Approving a board is not approving a message.

---

## 5. List available tools before offering any export

Before offering a CRM export, LIST the tools actually available in this session. Do not
assume a connector exists and do not name one you have not seen.

Gmail, HubSpot, Salesforce, Pipedrive, GoHighLevel, Airtable, Notion and the rest are
SEPARATE MCP servers that may or may not be connected. They are not part of Littlebird.

| What you find | What to offer |
|---|---|
| A CRM connector is present | Offer an import into it, describe exactly what would be created or updated, and get explicit approval before writing anything. Never overwrite an existing record without showing the before and after. |
| A spreadsheet or notes connector is present but no CRM | Offer to write the board there instead. |
| Nothing relevant is connected | Offer the CSV in section 6, or a copy-paste block. Say plainly that no connector was found. |

Degrade gracefully. An honest "no CRM connector is connected in this session, here is a CSV
you can import" is a correct outcome, not a failure.

---

## 6. The CSV fallback

Write `pipeline-board-YYYY-MM-DD.csv` with these columns, in this order. They are chosen to
map onto a generic CRM deal import without transformation.

| Column | Notes |
|---|---|
| `deal_name` | Canonical display name plus company |
| `contact_name` | Primary contact |
| `additional_contacts` | Semicolon separated |
| `company` | |
| `stage` | Lead, Qualified, Proposal, Negotiation, Closing, Won, Lost |
| `stage_confidence` | High, Medium, Low |
| `stage_basis` | One line, the evidence summary |
| `amount` | Number, or empty. NEVER a guess. |
| `amount_status` | known, quoted, stale, range, unknown |
| `currency` | Only if observed |
| `first_touch` | ISO date, or empty |
| `last_touch` | ISO date, or empty |
| `last_touch_direction` | inbound, outbound, unknown |
| `days_silent` | Integer, or empty |
| `status` | active, going_cold, cold, waiting |
| `upcoming_hold` | ISO date, or empty |
| `next_action` | One line |
| `notes` | Ambiguities and caveats |

Rules for the CSV:

- **Empty means unknown.** Never write `0` for an unknown amount and never write today's
  date for an unknown last touch. A zero imports as a real zero and corrupts every total
  downstream.
- **No probability column and no weighted value column.** Mainstream CRM will apply its own
  fixed default probability per stage on import
  (`research/distilled-b2b-pipeline-management.md`, section 2), which is that tool's
  choice to make, not this skill's.
- **Keep `stage_basis` in the file.** The reasoning is the point. A stage imported without
  its evidence becomes exactly the unexamined stage field this skill exists to replace.

If the user prefers, offer the same table as a markdown copy-paste block instead of a file.

---

## 7. Re-running the board

On a repeat run, read the previous board file if it is available, and produce a DELTA
section at the top:

- Deals that moved stage, with the new evidence that moved them.
- Deals that crossed a cold threshold since the last run.
- Deals that went quiet since the last run.
- New deals.
- Deals the user previously confirmed, so the confirmation gate skips them.

The delta is what makes the board a feedback loop rather than a snapshot. Making explicit
predictions and then obtaining feedback on them is one of the documented remedies for
forecaster overconfidence
(`research/distilled-b2b-pipeline-management.md`, section 3). A board re-run weekly and
compared against its own prior placements is that remedy in practice.

Where a previous placement turned out to be wrong, say so in the delta. That is the
feedback.
