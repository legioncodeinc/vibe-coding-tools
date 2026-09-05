# Rollup and fallbacks: read, do not re-derive

This is the defining property of `weekly-review`. Nearly everything in the scorecard was
already produced by a sibling routine. **The primary retrieval of this skill is
`LB_INTERNAL_LIST_ROUTINES` plus `LB_INTERNAL_GET_ROUTINE_REPORTS` across the user's other
routines, not a fresh sweep of raw capture.**

The pattern and its argument are established in the `daily-brief` skill, in its reference
guide named `rollup-composition`. **Read that guide for the general case where the
`daily-brief` skill is installed alongside this one.** It covers discovery, the freshness
gate, the three attribution rules, and the pointer discipline, and none of that is restated
here. This file covers what is different when the rollup is weekly and the output is a
scorecard, and it stands alone where `daily-brief` is not installed.

Three things change at the weekly cadence.

1. **The stakes of re-deriving go up.** A daily brief that re-derives a commitment produces a
   slightly different sentence. A weekly scorecard that re-derives a commitment produces a
   different **number**, printed next to a trend line, contradicting a number the sibling
   already published. The user then has to reconcile two versions of their own week from two
   reports that both claim to be authoritative. For a scorecard that is the worst available
   outcome, worse than omitting the section, because the archive is direct that one
   mismatched figure undermines confidence in every other number on the surface
   [research/distilled-weekly-review-design.md, section 7].
2. **The rollup is nearly the whole retrieval.** In `daily-brief` the rollup runs first and
   then the brief retrieves what the siblings missed. Here, exactly one scorecard section is
   retrieved fresh in every run regardless of what siblings exist: meetings and hours. Every
   other section is a rollup with a reduced fallback.
3. **A missing section reads as a zero.** A daily brief can suppress an empty section
   silently. A scorecard cannot, because a scorecard is a set of counts and a blank cell in a
   set of counts is read as nought. Absence is stated, always, with the reason.

---

## 1. Discovery, once per run, before anything else

```
LB_INTERNAL_LIST_ROUTINES
  limit: 25
```

Returns title, schedule, report count, latest report date, paused state, and id
[littlebird-mcp-reference.md]. Titles are user-chosen, so match on substance, not on an exact
string, and record which title matched which section so the scorecard attributes correctly.

Then, per matched sibling:

```
LB_INTERNAL_GET_ROUTINE_REPORTS
  routine_id: [the sibling's id]
  limit:      2
```

Two reports, not one, for the same reason `daily-brief` takes two: the second makes the
sibling's own delta visible, which is what tells this skill whether a rolled-up item is new
this week or carried.

## 2. The mapping, by scorecard section

| Scorecard section | Sibling routines, by substance of title | What weekly-review takes | What it never takes |
|---|---|---|---|
| **Meetings held and hours** | none | Nothing. This section is always retrieved fresh. | |
| **Commitments closed, dropped, open** | commitment tracker, follow-ups, action items | The three counts and the named items that changed state this week. The dropped list in full, because it is the section most likely to be softened. | The full ledger. Point at it. |
| **Owed replies** | who am i ghosting, unanswered messages | The count and the oldest item only. Folds into the commitments section as a sub-line. | The per-thread drafting. |
| **Leads captured and what happened** | lead harvester, comment to crm piper, deal pipeline | Count captured this week, count with a next step recorded, count with nothing since capture. | The ranked roster, the CRM writes. |
| **Money: leaks** | money leak auditor | Findings raised this week, and the projected saving with its error bar exactly as the sibling stated it. | The vendor ledger. The cancellation drafts. |
| **Money: renewals approaching** | renewal sentinel | Items whose decision deadline falls inside 14 days. | The 90-day calendar. |
| **Money: receivables aged** | invoice chaser | Total outstanding, count of invoices, and any invoice that crossed a bucket boundary this week. | The chase drafts. |
| **Content shipped** | said it already, content repurposer | What actually shipped, by name and date. Nominations and drafts are not shipped content. | The content bank. |
| **What moved and what did not, per project** | client health radar, deal pipeline, meeting scribe, daily brief | Band changes, stage changes, and decisions recorded. State changes only. | Per-client detail, per-meeting detail. |

**The general test for whether a sibling feeds the scorecard:** does its report contain a
count, a state change, or an item that entered or left a list during the review window? A
sibling reporting the same steady state as last week contributes its number to the series and
nothing to the prose.

**Two skills are never rolled up.** `routine-architect` audits routines, including this one,
and rolling it up would let the scorecard grade its own instrument. `osint-investigator`,
`sop-forge`, `testimonial-miner`, `competitor-watch`, `brand-voice-guardian` and
`pre-call-prep` are on-demand or produce no weekly countable, so they appear only if their
report names something with a date inside the window.

## 3. The freshness gate, weekly version

The general gate is in the `daily-brief` skill's `rollup-composition` guide, section 3. The weekly
adaptation, because sibling schedules differ from this skill's:

| Sibling's latest report age, measured in the sibling's own schedule intervals | Behavior |
|---|---|
| Within one interval | Use it. Cite it with its report date. Do not re-run its retrieval. |
| Within two intervals | Use it, and print the sibling's report date next to every number taken from it. |
| Older than two intervals | Do not use it. Run the fallback in section 5, and print the stale line from section 4. |
| Routine is paused | Do not use it. Run the fallback, and print the paused line from section 4. |

A daily sibling therefore goes stale to a weekly review in two days, which means a daily
sibling that skipped the last two days contributes nothing even though it reported five times
this week. That is correct. Check the latest report date, not the report count.

**A monthly sibling is never stale to a weekly review inside its own month, but it is also
not weekly news.** Take a monthly sibling's numbers as a standing figure, print the report
date, and do not put a monthly figure in the weekly trend series. A monthly number repeated
four times is a flat line that means nothing.

## 4. Stale and paused are printed, never omitted

This is the rule that makes the scorecard readable at all, and it comes straight out of the
research: a last-updated marker on every view removes freshness doubt, and one figure the
reader cannot trust undermines every other figure on the surface
[research/distilled-weekly-review-design.md, section 7].

Exact lines. Use them verbatim, substituting the real values.

**Stale sibling:**

```
[Section name]: covered by reduced check only. [Sibling title] last reported [date],
which is [N] of its own intervals ago. Not a zero.
```

**Paused sibling:**

```
[Section name]: covered by reduced check only. [Sibling title] is paused. Not a zero.
Run routine-architect if the pause was not deliberate.
```

**No sibling exists:**

```
[Section name]: reduced check only. No [substance] routine found. Run [skill name] for the
real figure.
```

**Sibling exists, ran, and reported nothing in this area:**

```
[Section name]: [count]. [Sibling title] reported no [items] this week. [report date]
```

That last case is a real zero and is the only case where a zero is printed as a zero. The
difference between "the sibling looked and found none" and "nobody looked" is the whole
point of this section.

**Never print a section heading with an empty value and no explanation.** Under it, a reader
supplies the zero themselves and the scorecard has lied by omission.

## 5. Per-section fallbacks

Each fallback is deliberately narrower than the sibling's real work, and each carries a line
saying so. The scorecard never pretends a fallback is equivalent to the sibling.

Total fallback budget: **at most 5 calls per run.** If more than five sections need fallbacks,
run the three highest-value ones, and for the rest print the no-sibling line from section 4
and stop. A weekly review that re-derives the whole marketplace from raw capture is the exact
failure this skill exists to avoid.

Priority order when the budget binds: commitments, money, leads, content, projects.

### Commitments, fallback

```
LB_INTERNAL_LIST_MEETINGS
  start_date: [window start minus 21 days]
  end_date:   [window end]
  limit:      40
```

Take the recorded entries that carry an id. For each, up to a cap of 8 meetings:

```
LB_INTERNAL_GET_MEETING
  meeting_id: [id]
```

Read only `## Action Items` and `## For You`. Those sections already carry owner attribution
[littlebird-mcp-reference.md]. Count items owned by the user. An item is **closed** only where
there is an observation of it being done; otherwise it is **open**. **Nothing is counted as
dropped from a fallback**, because dropping requires knowing an item passed its date, and a
21-day meeting sweep is not a ledger.

Line to print:

```
Reduced check only: counted from Action Items in [N] recorded meetings, 21-day lookback.
Closure rate not computed. Run commitment-tracker for the real ledger.
```

### Money, fallback

One call, covering all three money sections:

```
search_user_context
  search_queries:   ["subscription renewal charge", "invoice overdue payment", "annual plan renews on",
                     "payment failed card declined", "your card will be charged"]
  standalone_query: "Billing, renewal, invoice and payment notices that appeared on screen this week"
  date_range:       {"start": "[window start]", "end": "[window end]"}
  filters:          {"data_source": "snapshots"}
```

Report only what is observed with a receipt: named vendor, named amount, named date. **Never
compute a run rate, never project a saving, and never total a receivables figure from a
fallback.** Those are the sibling skills' outputs and a fallback version of them would be a
number the user could not act on.

Line to print:

```
Reduced check only: named billing observations from screen capture, no ledger, no totals.
Run money-leak-auditor, renewal-sentinel and invoice-chaser for real figures.
```

### Leads, fallback

```
search_user_context
  search_queries_messages: ["interested in", "send me the details", "how much is it", "can we talk",
                            "dropped you a DM", "want to learn more"]
  standalone_query:        "New people who expressed interest in what I sell during this week"
  date_range:              {"start": "[window start]", "end": "[window end]"}
  filters:                 {"data_source": "messages"}
```

Report the named count only, and state it as a floor rather than a total, because platform
UIs collapse lists and any roster built from that capture is partial by construction
[evidence-standards.md, rule 5].

Line to print:

```
Reduced check only: [N] named, a floor not a count. Run lead-harvester for coverage.
```

### Content shipped, fallback

```
search_user_context
  search_queries:   ["published post", "just posted", "newsletter sent", "video uploaded", "went live"]
  standalone_query: "Things I actually published or sent this week, as opposed to drafted"
  date_range:       {"start": "[window start]", "end": "[window end]"}
  filters:          {"data_source": "summaries"}
```

The summaries source is the cheapest way to get a compressed view of a day
[littlebird-mcp-reference.md], which is the right instrument for a shipped-or-not question.

**Drafted is not shipped.** A composer window on screen is evidence of writing, not of
publishing [evidence-standards.md, rule 4].

Line to print:

```
Reduced check only: publication events from activity summaries. Drafts excluded.
Run said-it-already for the content bank.
```

### Projects, fallback

No fallback. If no client health, pipeline or scribe sibling reported, the per-project section
prints:

```
What moved, per project: no project-level routine reported this week. This section is empty
because nothing was measured, not because nothing moved.
```

Reconstructing a project roster from raw capture inside a weekly run is a deep-run job and
attempting it produces a partial roster presented as complete, which is the fastest way to
make the whole scorecard untrustworthy [evidence-standards.md, rule 5].

## 6. Provenance on every number

Every figure in the scorecard carries where it came from and whether it is exact.

```
Commitments closed: 7 of 11 [from Commitment tracker, 2026-08-16] (exact)
Hours in meetings: 14.5 [LB_INTERNAL_LIST_MEETINGS, 2026-08-10 to 2026-08-16] (bounded: scheduled duration, not attendance)
Leads captured: at least 4 [from Lead harvester, 2026-08-15] (bounded: named only, unnamed gap 9)
Leaks found: 2, projected saving 340 to 520 per month [from Money leak auditor, 2026-08-14] (bounded, sibling's own range)
```

Three marks, and every number carries exactly one:

| Mark | Meaning |
|---|---|
| `(exact)` | A count of discrete named items, all of which are listed or listable |
| `(bounded: reason)` | A floor, a ceiling, or a range. The reason is stated in the parenthesis. |
| `(reduced check)` | Produced by a fallback, not by the sibling that owns it |

**A number with no mark does not go in the scorecard.** If the run cannot determine which
mark applies, the number is not ready and the section prints the reason instead.

The three attribution rules from the `daily-brief` skill's `rollup-composition` guide,
section 4, apply
unchanged and are the most important thing in this file after the mapping table: never
restate a sibling claim more confidently than the sibling did, never silently contradict a
sibling, never collapse a sibling's hedge. A scorecard compresses, and compression is exactly
where a hedge gets dropped.

## 7. Call budget

| Phase | Calls |
|---|---|
| Own history | 1 |
| Sibling discovery | 1 |
| Sibling reports | 1 per matched sibling, typically 4 to 7 |
| Meetings and hours, always fresh | 1 |
| Fallbacks | 0 to 5, hard cap |

Steady state in a well-populated account is about 8 calls, of which one touches raw capture.
That is the intended shape. A run that makes twenty retrieval calls has stopped being a
rollup and become a re-derivation.
