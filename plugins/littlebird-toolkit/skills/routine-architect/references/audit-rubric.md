# The audit rubric

How to score an existing routine. Read `failure-modes.md` first: the rubric scores against
its nine failure modes and does not restate their reasoning.

**The governing rule of this whole guide.** Score from the reports, not from the prompt. Six
of the nine failure modes are invisible in the prompt text. The reports are the evidence of
whether the prompt works
[references/research/distilled-routine-prompt-craft.md section 4.2].

---

## Part 1. Collect before you score

Per routine, in this order.

### Step 1. The list

`LB_INTERNAL_LIST_ROUTINES`. Record for each routine: title, schedule, report count, latest
report date, paused state, and id [references/littlebird-mcp-reference.md, routine tools].

Compute two things immediately, before reading anything else:

- **Staleness.** Latest report date against today and against the schedule interval. More
  than two intervals stale is a liveness finding on its own.
- **Production rate.** Report count against the created date once you have it. A daily
  routine created 90 days ago with 12 reports is not running daily.

### Step 2. The config

`LB_INTERNAL_GET_ROUTINE_CONFIG` per routine. Returns the full prompt, schedule, paused
state, auto-pause setting, push and email notification flags, agent mode, and created date
[references/littlebird-mcp-reference.md, routine tools].

Do not skim past the settings to get to the prompt. Three of them are findings.

| Field | What it tells you |
|---|---|
| `auto-pause when reports go unread` **on**, and the routine is paused | The circuit breaker fired. This is measured disengagement, not an admin state. Failure mode 6. |
| `auto-pause` **off**, and reports are long and repetitive | Nothing will ever stop this routine. The user's only options are read it or ignore it. |
| Both notification channels **off** | The routine produces reports into a place nobody is prompted to look. Ask whether that is deliberate. |
| Created date far from the first report date | The routine was created, then edited, or was paused early. Ask. |

### Step 3. The reports

`LB_INTERNAL_GET_ROUTINE_REPORTS`, `limit` up to 25, default 5
[references/littlebird-mcp-reference.md, routine tools]. **Pull at least 7 where the history
allows it.** Fewer than 3 makes repetition undetectable, which means failure modes 1, 2, and
9 cannot be scored at all. If the history is shorter than 3, say the audit is
liveness-only and score only what the prompt shows.

Reports come back most recent first. Read them oldest to newest when looking for trends,
because fatigue is defined as a change over time
[references/research/distilled-routine-prompt-craft.md section 4.2].

### Step 4. Build the repeat table before scoring anything

This single table drives four of the nine scores. Do it explicitly.

| Item | Runs it appeared in | Consecutive streak | Did the recommendation change? | Resolved? |
|---|---|---|---|---|

One row per distinct item across the whole pulled history. "Did the recommendation change"
means the verb changed, not the adjectives. Escalating language over an unchanged action is
scored as no change
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

### Step 5. The plan check

`LB_INTERNAL_GET_SUBSCRIPTION_STATUS` [references/littlebird-mcp-reference.md]. Returns
plan, active state, renewal date. Slots are plan-limited, and slot scarcity is a standard
product pattern rather than a Littlebird quirk
[references/research/distilled-routine-prompt-craft.md section 8]. You need this before you
recommend creating anything.

---

## Part 2. The score

Nine criteria, 0 to 2 each, 18 total. Score each independently even when they interact.

| # | Criterion | 0 | 1 | 2 |
|---|---|---|---|---|
| 1 | **Memory** | No mention of past reports in the prompt | Mentions past reports vaguely, or reports show inconsistent recall | Names the reports tool, a limit, and what to do with what comes back |
| 2 | **Escalation** | No rule; repeats recur with unchanged recommendations | A rule exists but no threshold, or a threshold with no changed tactic | Explicit threshold, explicit change of tactic, explicit stalled state |
| 3 | **Handoff** | Findings end at the user's attention | Some findings suggest an action in prose | Every item ends with a named next action or a named Cowork skill |
| 4 | **Scope** | Names a topic only | Names sources or a threshold, not both | Names sources, windows, inclusion test, output structure |
| 5 | **False-positive discipline** | No negative rules | An adjective such as "only important things" | Worked negative cases plus an explicit instruction to omit when unsure |
| 6 | **Liveness** | Paused, or stale by more than 2 intervals | Running but reports show declining engagement signals | Running on schedule, reports current |
| 7 | **Output ceiling** | None | Stated once globally, not honored in the reports | Per-section limits, a total, and an overflow rule, honored in the reports |
| 8 | **Schedule fit** | Cadence clearly mismatched to the signal | Plausible but untested, or wrong time of day | Cadence and time match when the finding is actionable |
| 9 | **Anxiety discipline** | No nothing-to-report clause, and zero quiet reports in the history | Clause present but never exercised | Clause present, and quiet reports appear in the history |

### Bands

| Total | Verdict | Recommendation |
|---|---|---|
| 15 to 18 | Working | Leave it. Note the weakest criterion and move on. |
| 10 to 14 | Good prompt, incomplete | Targeted rewrite of the failing criteria. Keep everything else verbatim. |
| 5 to 9 | Weak | Full rewrite from a library pattern, keeping the user's scope and intent. |
| 0 to 4 | Dead weight | Recommend deletion. Name what could take the slot. |

**The band that matters most is 10 to 14**, because it is where the live grounding example
sits and because it is the least intuitive. A routine can be genuinely well written, with
scope, false-positive discipline, a length ceiling, and an anti-anxiety clause, and still
repeat itself for sixteen consecutive days, because it is missing exactly two criteria that
do not show up in the prompt
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md]. Say
this out loud in the audit. Users whose routine scores 12 assume it scored 12 because it is
badly written, and it is not.

---

## Part 3. Report-side diagnostics

Six checks run against the reports themselves. Each produces evidence you must quote back,
because a diagnosis without a receipt is an opinion
(`references/evidence-standards.md` rule 1).

### D1. The repeat streak

From the repeat table. Any item with a streak of 3 or more, where the recommendation did not
change, is failure mode 2 with hard evidence. Quote the two reports side by side. The
strongest form of this receipt is when the routine names its own repetition, because then the
finding is not your inference, it is the routine's own words
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

### D2. The language ratchet

For a repeated item, track the intensity words across runs. Rising intensity with an
unchanged recommended action is the signature of awareness without a rule
[references/research/distilled-routine-prompt-craft.md section 6].

### D3. The quiet-day count

Count reports that said, in substance, nothing needs you. Zero across twenty runs is failure
mode 9 regardless of what the prompt says. Real weeks contain quiet days.

### D4. The ceiling check

Measure the actual length of the three longest reports against the stated ceiling. A ceiling
in the prompt is not evidence of a ceiling in the output
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

### D5. The handoff check

Take three findings at random. For each, name what the user does in the next 60 seconds. If
the answer is "decide what to do about it", score criterion 3 at zero.

### D6. Engagement trend

The one diagnostic that measures fatigue directly rather than by proxy. Look for: the routine
auto-pausing on unread, reports going unread in the product, the user saying they stopped
opening it. Alert fatigue is defined as "a statistically significant, sustained decrease in
appropriate response rates over time relative to a previously established baseline"
[references/research/distilled-routine-prompt-craft.md section 4.2]. You cannot compute that
statistic from this data. You can observe its qualitative form, and you should label it as an
inference when you do (`references/evidence-standards.md` rule 2).

---

## Part 4. Two things the rubric must not do

### Do not treat an ignored finding as proof the finding was wrong

An inappropriate finding and an appropriate finding the user chose not to act on are
different failures with different fixes. The alert literature reports this split least often
of all its metrics, at 13.6% of reviews, and warns that interventions aimed at proxies "may
be ineffective if alert fatigue is not actually present"
[references/research/distilled-routine-prompt-craft.md section 4.3]. When you cannot tell
which one you are looking at, ask the user rather than assuming. This is the single most
common way an audit produces a confident wrong answer.

### Do not score a routine you have not read the reports of

If `GET_ROUTINE_REPORTS` returns nothing or the history is too short, say the audit is
liveness-only and score criteria 4, 5, 7 and 9 from the prompt alone, marking 1, 2, 3, 6 and
8 as not assessable. Do not infer report content from prompt quality. A failed or empty
retrieval ends the run (`references/evidence-standards.md` rule 9).

---

## Part 5. The audit table the user sees

One row per routine, sorted worst first.

| Routine | Schedule | Reports | Last run | Score | Top failure | Recommendation |
|---|---|---|---|---|---|---|

Followed, per routine scoring below 15, by a diagnosis block:

```
<Routine title> (id <id>) - <score>/18

What it does well:
  <name the criteria scoring 2, specifically. Do this first and mean it. Users disengage
   from an audit that opens with a list of failures, and where a routine scores 12 the
   working parts are usually the majority of the prompt.>

What is failing, with evidence:
  <failure mode name>: <one sentence>
    Evidence: <quoted report line, with its date>
    Evidence: <quoted report line, with its date>

What it costs:
  <the concrete consequence, in the user's terms>

Fix: <targeted rewrite | full rewrite | delete | reschedule>
```

Never present a score without the evidence lines. The score is an opinion; the quoted report
lines are the argument.

---

## Part 6. Portfolio-level findings

After scoring every routine individually, produce three portfolio findings. These are often
worth more than the individual scores.

1. **Slot accounting.** Routines in use, dead routines, and the plan limit. State it as a
   budget: "You are running 2 routines. One has produced nothing since May. Adding the
   routine you want means either an upgrade or reclaiming that slot."
   [references/research/distilled-routine-prompt-craft.md section 8]

2. **Coverage gaps.** What the portfolio does not watch, against `routine-library.md` for the
   user's job function. Name at most three, ranked, each with the slot cost.

3. **Overlap.** Two routines reporting the same underlying condition on different schedules
   double the interrupt volume without adding information. "The problem is not notification
   volume. It is notification interrupt volume."
   [references/research/distilled-routine-prompt-craft.md section 7.5]

---

## Part 7. Recommendation order

Always in this order, and say why.

1. **Delete** dead routines. Frees a slot at zero cost and zero risk.
2. **Fix** routines scoring 10 to 14. Highest value per unit of work: the scope and
   discipline are already there, and two clauses close the gap.
3. **Rewrite** routines scoring 5 to 9.
4. **Add** new routines, one at a time, only after 1 to 3, and only if a slot is free.

Under-monitoring is the cheaper error to correct
[references/research/distilled-routine-prompt-craft.md section 4.4]. A user who ends the
session with one excellent routine is better served than one who ends it with five mediocre
ones, and the second user will stop reading all five.
