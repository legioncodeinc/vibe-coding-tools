# Failure modes of unattended recurring routines

Nine failure modes. Each one was observed in a real production routine or is directly
evidenced by the research archive. Each entry states how to detect it, why it happens, what
it costs, and the specific prompt clause that fixes it.

Read this before `audit-rubric.md`. The rubric scores against these nine.

**Detection principle that governs all nine.** Six of the nine are invisible in the prompt
and only visible in the report history. Auditing a routine by reading its prompt is like
reviewing a monitoring system by reading its config: you will find the typos and miss the
alert fatigue. Always pull the reports
[references/research/distilled-routine-prompt-craft.md section 4.2].

---

## 1. No memory

**What it is.** The prompt never instructs the run to read its own past reports before
writing. Each run starts from zero and rediscovers the same conditions.

**Why it happens.** Because it looks like it should not be necessary. The routine has a
title, a history, and a report list in the product UI, so it reads like a continuing thing.
It is not. Every run is a fresh context window, and agents maintain coherence across context
resets by consulting their own written notes, not by remembering
[references/research/distilled-routine-prompt-craft.md section 5]. The past reports are the
notes. Nothing reads them unless the prompt says to.

**How to detect it.**

- Prompt scan: no mention of past reports, prior runs, history, or the reports tool.
- Report scan: the same item appears in consecutive reports with no acknowledgement that it
  appeared before, or with inconsistent acknowledgement.

**The inconsistency tell.** Some reports may reference earlier ones and some may not. That
is worse than uniform amnesia, because the user sees continuity sometimes and stops being
able to predict the routine. Uninstructed memory is non-deterministic memory
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

**Observed.** A live daily routine flagged the same blocked contact for 16 consecutive days.
Its prompt contains no memory instruction. Some of its reports say "still open from previous
reports" and some do not
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

**The fix, as a prompt clause:**

```
Before writing anything, read your last 7 reports with LB_INTERNAL_GET_ROUTINE_REPORTS
(routine_id: <this routine's id>, limit: 7). Build a list of every item you have already
reported and how many consecutive runs each has appeared in. You will need that count for
the escalation rule below.
```

Name the tool. Name the limit. Name what to do with what comes back. "Consider your previous
reports" is not an instruction, it is a suggestion, and the model is being told to be
explicit about tool use for a reason
[references/research/distilled-routine-prompt-craft.md section 2].

---

## 2. No escalation rule

**What it is.** Nothing tells the routine what to do when an item recurs. It has no move
except to say the same thing again.

**Why it is a separate failure from memory.** Memory without escalation produces a routine
that knows it is repeating and repeats anyway, with more adjectives. Awareness is not a
rule. "Simply noting 'this paged again' is not an action"
[references/research/distilled-routine-prompt-craft.md section 4.4].

**Observed, and this is the sharpest receipt in the archive.** A live routine wrote "It's
been the #1 item for three days straight" and then, the next day, "This has been the #1 item
for four straight days and it's now at the point of actual data loss". The section heading
escalated to CRITICAL. The recommended action never changed once
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

**How to detect it.** Read three or more consecutive reports and compare the recommendations
for any repeated item. If the noun is the same and the verb is the same and only the
adjectives changed, there is no escalation rule.

**The cost.** The user learns that the routine's urgency language carries no information,
because it rises whether or not anything changed. That is the definition of alert fatigue as
declining appropriate response over time
[references/research/distilled-routine-prompt-craft.md section 4.2].

**The fix, as a prompt clause:**

```
Escalation rule. For any item that has now appeared in three or more consecutive reports:
do not restate it in the same form. Instead, say plainly that the previous approach is not
working, name what has been tried, and recommend a different tactic: a different channel, a
different person, dropping it, or a decision the user needs to make in order to unblock it.
If an item reaches seven consecutive reports, move it to a "Stalled, needs a decision"
section and state the decision required in one sentence.
```

**Labelled as a design decision.** The number three is not evidenced by the archive. Failure
thresholds as a design element are evidenced; the specific count is not
[references/research/distilled-routine-prompt-craft.md section 10, gap 4]. Three is chosen
because it is the smallest count that distinguishes a recurring condition from a two-day
coincidence. Say so if a user asks where it came from.

---

## 3. No handoff

**What it is.** Every finding is a notification and every notification terminates at the
user's attention. Nothing names what resolves the finding.

**Why it matters.** A report that needs a timely response but not an interruption is a valid
design, "but only with clear accountability systems"
[references/research/distilled-routine-prompt-craft.md section 4.4]. A daily report with no
owner and no named next action is not a control, it is a feed.

**Observed.** Nineteen reports from a live routine name conditions. Not one names what
resolves the condition, who does it, or which session to open
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

**How to detect it.** Take any finding from any report and ask what the user does in the
next 60 seconds. If the answer is "decide what to do about it", there is no handoff.

**The structural reason this failure is so common in Littlebird specifically.** A routine
cannot do the resolving work itself. It cannot get approval, cannot send on the user's
behalf, cannot produce a file, and cannot create or edit routines
[references/littlebird-mcp-reference.md, routine tools]. So the resolution has to happen in
a Cowork session, and the only way the user knows which one is if the report says.

**The fix, as a prompt clause:**

```
Every item you report ends with a handoff line in this exact form:
  Next: open Cowork and run <skill-name> on <the specific target>.
If no skill resolves it, write:
  Next: <the single physical action the user takes>, roughly <time estimate>.
Never end an item without one of these two lines.
```

Full pattern in `observe-act-wiring.md`.

---

## 4. Vague scope

**What it is.** The prompt names a topic instead of naming what to look at, what counts,
what to produce, and in what shape. "Summarize my day." "Let me know about anything
important."

**Why it produces slop.** Both vendors independently say the same thing: be explicit about
what you want, specify the output format and constraints exactly, and decompose into
concrete steps where each step corresponds to a specific action or output
[references/research/distilled-routine-prompt-craft.md section 2]. The clarity test is the
fastest audit tool available: show the prompt to a colleague with minimal context and ask
them to follow it; if they would be confused, the model will be too
[references/research/distilled-routine-prompt-craft.md section 2].

**Observed.** A live routine's entire prompt is 31 words: scan my emails every day and let me
know if there are any critical to-dos, meeting requests, and things I need to be aware of,
ignore marketing and spam. "Critical" is never defined. It produced 12 reports and then went
quiet [references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

**How to detect it.** Four questions against the prompt. Does it name the sources to search?
Does it define the threshold for inclusion? Does it specify the output structure? Does it set
a length ceiling? A prompt missing three or four of these is vague regardless of how long it
is. Length is not specificity.

**The clinical parallel, which is exact.** The identified cause of alert fatigue in the ED
study was an algorithm that "operates as a rule base without reflecting the individual
condition of the patient"
[references/research/distilled-routine-prompt-craft.md section 4.1]. A general rule applied
without the context that decides whether it matters here. That is what a vague routine
prompt is.

**The fix.** Replace the topic with four named parts: the sources and windows to search, the
inclusion test, the output structure, the length ceiling. Worked rewrites in
`prompt-rewriting.md`.

---

## 5. No false-positive discipline

**What it is.** The prompt does not define what counts and, more importantly, what does not.
The routine flags everything that is arguably relevant.

**Why it is the most damaging of the nine.** This is the failure the research archive is
built on. In 382 reviewed clinical alerts, 92.7% were inappropriate and 92.9% were
overridden, and in 89% of all cases the alert was wrong and the human was right to ignore it
[references/research/distilled-routine-prompt-craft.md section 4.1]. The authors' conclusion:
"Alert fatigue is unavoidable when a large number of irrelevant alerts are generated in
response to a small number of useful alerts."

**The asymmetry that decides the tradeoff.** "Err on the side of removing noisy alerts,
over-monitoring is a harder problem to solve than under-monitoring"
[references/research/distilled-routine-prompt-craft.md section 4.4]. A routine that misses
something occasionally can be tuned. A routine the user has stopped opening cannot be tuned,
because the tuning signal is gone.

**The honest caveat, stated because the archive contains a real conflict.** A 2009 air
traffic control study found a 45% false alert rate did not produce measurable cry wolf
behavior in expert controllers who were independently watching the underlying condition
[references/research/distilled-routine-prompt-craft.md section 4.5]. That result narrows the
claim rather than overturning it. The tolerance depends on an expert operator already
monitoring the signal, which is precisely the case a routine does not cover. Prefer the
pessimistic reading, and say why if challenged.

**How to detect it.** Look for negative rules in the prompt. A prompt with only positive
inclusion criteria has no discipline. Then read the reports and count items the user
demonstrably did not act on across several runs.

**Distinguish two things before scoring.** An inappropriate finding and an appropriate
finding the user chose not to act on are different failures with different fixes. The alert
literature itself reports this split least often, at 13.6% of reviews, and warns that
tuning a proxy can miss
[references/research/distilled-routine-prompt-craft.md section 4.3]. If unsure which one you
are looking at, ask the user.

**The fix, as a prompt clause.** Give worked negative cases, not an adjective:

```
What counts: <the positive test, stated as a condition you could check>.
What does not count, and do not flag these even when they look relevant:
  - <negative case 1, drawn from something the routine actually got wrong>
  - <negative case 2>
  - <negative case 3>
When you are not confident an item passes the test, leave it out. A missed item is
recoverable. A report the user stops reading is not.
```

The three-to-five example guidance applies here directly, including the instruction that
examples should be diverse and cover edge cases
[references/research/distilled-routine-prompt-craft.md section 2].

---

## 6. Dead or paused routines occupying a plan slot

**What it is.** A routine that is paused, or that has produced no report in a long time, or
that produces reports nobody reads. It still counts against the plan limit.

**Why it is a real cost and not housekeeping.** Slot scarcity is a standard product pattern,
not a Littlebird quirk. ChatGPT caps active tasks at 3 to 15 depending on tier; Gemini caps
scheduled actions at 10
[references/research/distilled-routine-prompt-craft.md section 8]. Littlebird's limit is
plan-based [references/littlebird-mcp-reference.md, routine tools]. Every dead routine is a
routine the user cannot create.

**The auto-pause signal, which is the most underread field in the config.** Both competing
products ship auto-pause on inactivity
[references/research/distilled-routine-prompt-craft.md section 8]. Littlebird exposes an
auto-pause-when-unread setting [references/littlebird-mcp-reference.md, routine tools]. A
routine that auto-paused because its reports went unread did not fail administratively. It
is the product's alert-fatigue circuit breaker having fired, which is the operational
definition of fatigue as sustained declining engagement
[references/research/distilled-routine-prompt-craft.md section 4.2]. Report it that way.

**Observed.** A live account holds a routine created 2026-05-08, paused, last report
2026-05-18, twelve reports total, auto-pause on unread enabled and triggered. Three months
of holding a slot and producing nothing
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

**How to detect it.** From the routine list alone: paused state, latest report date more than
two schedule intervals old, report count that stopped growing. No prompt reading required.

**The fix.** Not a prompt clause. A recommendation, in priority order: delete it, or rewrite
it to fix the reason it went unread, or leave it paused and accept that the slot is spent.
Never recommend adding a routine without first naming which dead one it replaces.

---

## 7. Unbounded output

**What it is.** No length ceiling, so the report grows until nobody reads it.

**Why a ceiling is a quality mechanism and not a formatting preference.** A ceiling forces
ranking. Without one, the routine has no reason to decide what matters most, and the
report's first item is whatever it found first. Detail should scale down as item count rises:
full detail at 1 to 3 items, headlines at 4 to 10, top 3 to 5 plus a count at 11 or more
[references/research/distilled-routine-prompt-craft.md section 7.2].

**The subtle version, which is more common than the obvious one.** A ceiling stated once in
the prompt and never restated as part of the output contract does not hold. In the live
account, a routine whose prompt says "Keep the total output under 200 words" produced reports
that run past it
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md]. Also
note that current model guidance says default response length is not reliably controlled by
effort settings and should be prompted for explicitly
[references/research/raw/routine--prompt-craft--claude-platform-docs-prompting.md].

**How to detect it.** Check whether a ceiling exists, then check whether the reports honor
it. Both. A ceiling in the prompt is not evidence of a ceiling in the output.

**The fix, as a prompt clause.** Put the ceiling in the output structure, per section, not
only as a global sentence:

```
Output format, and stay inside these limits:
  Bottom line: 1 sentence, the single most important thing.
  Section 1: at most 3 items, at most 2 lines each.
  Section 2: at most 3 items, at most 2 lines each.
  Total: under 200 words. If you have more than 3 items for a section, report the top 3 by
  urgency and end the section with "plus N more". Do not list them all.
```

The overflow instruction matters as much as the number. A ceiling with no overflow rule
tells the model to truncate, and it will truncate the end, which is often where the ranking
put nothing important but sometimes is not.

---

## 8. Schedule mismatch

**What it is.** The cadence does not match the signal, or the report lands after the moment
it was useful.

**Four distinct versions, which have different fixes.**

| Version | Symptom | Fix |
|---|---|---|
| Too frequent for the signal | Most reports say nothing changed | Lengthen the interval, or add a "report only on change" clause |
| Too slow for the signal | Findings are already stale or already handled when reported | Shorten the interval, or split the urgent class into its own routine |
| Wrong time of day | The report arrives after the window where acting on it was possible | Move the time to just before the user's decision point |
| Urgent class trapped in a slow digest | The most valuable finding is one that cannot wait for the next run | Move that class out. It does not belong in this routine |

**Evidence for the fourth version, which is the one people miss.** Critical items bypass
batching entirely, and the digest literature stresses this is "not an edge case"
[references/research/distilled-routine-prompt-craft.md section 7.4]. If a routine's best
finding is one that needed to be known four hours ago, no amount of prompt work fixes it.

**Also relevant.** Competing products document real scheduling constraints: a minimum
interval of one run per hour, and pre-prepared content that may not reflect the latest
information at delivery time
[references/research/distilled-routine-prompt-craft.md section 8]. A scheduled agent is
structurally unsuited to fast-moving data, and Gemini's documentation says so outright.

**How to detect it.** Compare report timestamps against the events they describe. Count how
many consecutive reports contained no new information. Ask the user when they actually read
it.

**The fix.** Change the schedule, not the prompt. `LB_INTERNAL_UPDATE_ROUTINE` replaces the
whole schedule object, so send the complete shape
[references/littlebird-mcp-reference.md, routine tools].

---

## 9. Anxiety manufacturing

**What it is.** No clause telling the routine that "nothing to report" is a valid and
complete answer. So it finds something, because it was asked a question and answering is
what it does.

**Why the fix works.** Giving the model explicit permission to say the evidence is
insufficient reduces fabrication, and the vendor guidance gives the exact pattern: "If the
data is insufficient to draw conclusions, say so rather than speculating"
[references/research/distilled-routine-prompt-craft.md section 2]. Without that clause, a
daily routine has an implicit daily quota.

**Why it is worse in a recurring routine than in a one-off prompt.** A manufactured finding
in a single response is a bad answer. A manufactured finding every day for a month is a
training program teaching the user that the routine's findings do not mean anything, which
is the fatigue mechanism
[references/research/distilled-routine-prompt-craft.md section 4.2].

**How to detect it.** Count reports across the history that said, in substance, everything is
fine. If that number is zero across twenty runs, the routine is manufacturing. Real weeks
contain quiet days.

**The fix, as a prompt clause:**

```
If nothing meets the bar, say exactly that and stop. A report that reads "Nothing needs you
today" is a correct and complete report. Do not lower the bar to fill the sections, do not
promote a minor item to fill a gap, and do not add hedged possibilities. Reporting nothing
is the expected outcome on a quiet day.
```

**Note the near miss.** A live routine's prompt contains "If everything's under control, just
tell me that - don't manufacture anxiety", which is exactly right, and its reports still ran
long and escalated in tone
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md]. The
anxiety clause suppresses invented findings. It does not suppress escalating language about
real ones. That is failure mode 2's job, and it is why the nine are scored separately.

---

## The teaching contrast

Hold these two side by side when explaining the audit to a user.

**Routine A**, 31 words, vague, no ceiling, no memory, no escalation, no handoff, no
definition of its own key term. It failed the obvious way: twelve reports, then unread, then
auto-paused, then three months of holding a slot
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

**Routine B**, carefully written. It has explicit scope with worked negative cases, a stated
zero-false-positive target, three numbered questions, a 200-word ceiling, and an anti-anxiety
clause. It is better than most routines anyone writes. It flagged the same item for 16
consecutive days
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

Routine B is missing exactly two of the nine: memory and escalation. Both are invisible in
the prompt and both are obvious in the reports.

**A good prompt is not the same thing as a complete prompt.** That sentence is the skill.
