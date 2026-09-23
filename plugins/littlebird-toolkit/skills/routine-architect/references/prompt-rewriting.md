# Rewriting a routine prompt

How to turn a diagnosis into replacement text, show it, get approval, and apply it. Read
`failure-modes.md` and `audit-rubric.md` first.

---

## The mechanical rule that governs everything here

`LB_INTERNAL_UPDATE_ROUTINE` replaces the **entire** prompt. There is no patch, no append, no
fragment. The same is true of `schedule`, which replaces the whole schedule object
[references/littlebird-mcp-reference.md, routine tools].

Three consequences, and violating any of them silently destroys the user's work:

1. **Always call `LB_INTERNAL_GET_ROUTINE_CONFIG` immediately before writing a replacement.**
   Not from memory of an earlier call in the session. The user may have edited it in the app
   while you were talking.
2. **Always hand back full text.** Every clause you intend to keep must be present in what
   you send, character for character where you are not deliberately changing it.
3. **Never send a schedule field you did not intend to change.** If the schedule is fine,
   omit it entirely rather than reconstructing it.

Before sending, run this check: does the replacement contain every rule from the original
that the diagnosis did not name as a failure? If a rule vanished and you cannot say which
diagnosis removed it, you dropped it by accident. Restore it.

---

## The seven-part shape of a complete routine prompt

Every rewrite lands in this shape. Sections in this order, because the order matters:
identity and purpose first, then rules, then examples, then context, is the published
ordering [references/research/distilled-routine-prompt-craft.md section 2], and long inputs
belong above the instructions
[references/research/raw/routine--prompt-craft--claude-platform-docs-prompting.md].

```
1. ROLE AND PURPOSE       one or two sentences: who this is for and what decision it serves
2. MEMORY                 read past reports, build the repeat count
3. WHAT TO LOOK AT        named sources, named windows, named queries
4. WHAT COUNTS            the positive test, then the worked negative cases
5. ESCALATION             the threshold and the required change of tactic
6. OUTPUT CONTRACT        structure, per-section limits, total ceiling, overflow rule
7. QUIET DAYS AND HANDOFF the nothing-to-report clause and the next-action line
```

Use Markdown headers or numbered sections rather than heavy XML scaffolding. The reasoning is
in [references/research/distilled-routine-prompt-craft.md section 3], including the honest
note that Anthropic's own sources disagree about XML tags and that this is a preference
between defensible options, not a settled fact. The practical argument: a routine prompt
lives in a small product text box that the user will read and edit by hand, and the report
renders as Markdown, so matching prompt style to output style points the same way.

**Keep it as short as the job allows.** "The best prompt isn't the longest or most complex.
It's the one that achieves your goals reliably with the minimum necessary structure"
[references/research/distilled-routine-prompt-craft.md section 2]. A complete routine prompt
generally lands between 150 and 400 words. Past that, check whether you are writing rules for
cases that will never occur.

---

## The seven clauses, with text you can use

### 1. Role and purpose

State the decision the report serves, not the topic it covers. Providing motivation behind an
instruction measurably helps the model handle cases the prompt did not anticipate
[references/research/distilled-routine-prompt-craft.md section 2].

```
You are my safety net for commitments I have personally made. The purpose of this report is
to let me decide, in under two minutes each morning, what I do first today. Everything below
serves that decision.
```

### 2. Memory

```
Before writing anything, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 7.
Read the reports oldest to newest. For every item you are about to report, count how many of
those runs already contained it. Carry that count into the escalation rule below. If an item
you previously reported no longer appears, say so in one line: it closed.
```

The closure line is not decoration. A routine that only ever adds items reads as a growing
debt. Naming closures is the only way the report ever gets shorter for a good reason.

### 3. What to look at

Name sources, windows, and queries. Parallel narrow queries beat one broad query, and an
unbounded search dilutes relevance [references/littlebird-mcp-reference.md, retrieval
patterns 1 and 2].

```
Search the last 24 hours. Cover, as separate searches rather than one combined search:
  1. direct messages and email addressed to me by name
  2. threads where I said I would do something
  3. calendar events in the next 48 hours that need preparation
Use the daily activity summaries first to find the shape of the day, then search snapshots
and messages for the specific items.
```

### 4. What counts

The positive test, then three or more worked negative cases. Negative cases carry more weight
than the positive test, because the positive test is usually obvious and the negative cases
are where the false positives live
[references/research/distilled-routine-prompt-craft.md section 4.1 and section 2].

```
An item counts only if I am clearly the person who owes the next action.

Do not flag these, even when they look relevant:
  - a message to a group I am in where I was not asked specifically
  - an email where I was CC'd and someone else is the primary recipient
  - cold sales outreach, however personalized
  - a task where I am one contributor and someone else is accountable
  - anything already resolved in a later message in the same thread

When you are not confident an item passes the test, leave it out. A missed item is
recoverable. A report I stop reading is not.
```

That last sentence gives the model the reasoning behind the constraint, which is the
difference between a rule it applies and a rule it can extend to a case you did not list.

### 5. Escalation

```
For any item that has now appeared in three or more consecutive reports: do not restate it in
the same form. Say plainly that the previous approach is not working, name what has already
been tried, and recommend a different tactic. A different channel, a different person,
dropping it, or a decision I need to make to unblock it. Do not simply repeat the item with
stronger language.

At seven consecutive reports, move the item to a section called "Stalled, needs a decision"
and state the decision required in one sentence.
```

The prohibition in the second-to-last sentence is doing real work. Without it, the model
satisfies "change your approach" by rewriting the same recommendation more forcefully, which
is the observed live behavior
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

### 6. Output contract

Lead with the decision. A bottom line is not a summary: it captures the decisive point in one
or two sentences so the reader can respond immediately
[references/research/distilled-routine-prompt-craft.md section 7.1]. Scale detail down as
item count rises [same, section 7.2].

```
Format exactly this way:

  THE ONE THING: one sentence. What I do first today, and why it beats everything else here.

  Waiting on me: at most 3 items, 2 lines each. If more than 3, give the top 3 by urgency and
  end with "plus N more".

  Overdue: at most 3 items, 2 lines each, same overflow rule.

  Stalled, needs a decision: only if something has hit seven runs.

Total under 200 words. Count before you send. If you are over, cut the lowest-ranked item
rather than shortening every line.
```

The overflow rule and the cut rule are the parts people leave out, and they are why stated
ceilings do not hold
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

### 7. Quiet days and handoff

```
If nothing meets the bar, write exactly "Nothing needs you today" and stop. That is a
correct and complete report. Do not lower the bar to fill the sections and do not add hedged
possibilities.

End every item with a next line in one of these two forms:
  Next: open Cowork and run <skill-name> on <target>.
  Next: <the single physical action>, roughly <time>.
```

---

## Preserve what works

A routine scoring 10 to 14 has a prompt that mostly works. The rewrite is surgical.

**Keep verbatim, always:**

- The user's own scope language, especially worked negative cases. Those came from real false
  positives the user got annoyed by. You do not know which ones, and rewriting them for style
  loses information you cannot recover.
- Numbers the user chose. A 200-word ceiling is a preference, not a defect. Keep it unless
  the diagnosis was that the ceiling is wrong.
- Their voice. A prompt that reads like the user wrote it gets edited by the user later. A
  prompt that reads like a specification gets abandoned.

**Change only what a named failure mode requires.** If the diagnosis is memory and escalation,
add two sections and touch nothing else. Then say exactly that in the read-back: "Two
sections added. Everything else is your original text, unchanged."

That sentence is what makes a user approve a rewrite of their own automation.

---

## The read-back and approval gate

**Never call `LB_INTERNAL_UPDATE_ROUTINE` without explicit approval of the actual replacement
text.** Not a description of the change. The text
(`references/evidence-standards.md` rule 6). Modifying someone's live automation is an
operation visible in its effects and not trivially reversible, and first-party guidance puts
exactly that class behind a confirmation
[references/research/raw/routine--prompt-craft--claude-platform-docs-prompting.md].

Show, in this order:

1. **The diagnosis in one line per failure**, with the report quote that proves it.
2. **The full current prompt**, verbatim, in a code block. The user has probably not read it
   since they wrote it.
3. **The full replacement prompt**, verbatim, in a code block. Complete text, exactly what
   will be sent.
4. **A change list.** What was added, what was removed, what was kept. Three bullets is
   usually enough, and "kept" is the most important of the three.
5. **What changes in the reports.** One or two sentences of concrete prediction. "The
   16-day item will appear once more in the current form, then move to a changed
   recommendation on the next run."

Then `AskUserQuestion`, with real options and no default-yes framing:

| Option | Meaning |
|---|---|
| Apply this rewrite | Send the replacement as shown |
| Apply memory and escalation only | The minimum viable fix, if the user is nervous |
| Edit first | The user changes wording before it is applied |
| Leave it | No change. Record the diagnosis and move on |

"Leave it" must be a real option that you accept without arguing. This is the user's
automation.

---

## Applying it

1. `LB_INTERNAL_GET_ROUTINE_CONFIG` again, immediately before the write.
2. Diff against the version you showed. If it changed, stop and re-show. Do not overwrite an
   edit the user made in the app while you were talking.
3. `LB_INTERNAL_UPDATE_ROUTINE` with `routine_id` and only the fields you are changing
   [references/littlebird-mcp-reference.md, routine tools].
4. `LB_INTERNAL_GET_ROUTINE_CONFIG` once more and confirm the stored prompt matches what the
   user approved, character for character. Report the confirmation.
5. Tell the user when the next run is, and that the change takes effect then. Updating a
   routine does not generate an immediate report the way creating one does
   [references/littlebird-mcp-reference.md, routine tools].

**If the update fails,** report the failure and the current stored state. Never retry with a
modified prompt on your own initiative. The user approved specific text.

---

## Rewriting a schedule

Separate operation, separate approval. `schedule` replaces the whole object, so send the
complete shape: `{"frequency": "daily"|"weekly"|"monthly", "time": "HH:MM", "week_days":
["MO",...] weekly only, "month_day": 1-28 monthly only}`, in the user's local timezone
[references/littlebird-mcp-reference.md, routine tools].

Ask when the user actually reads it, not when they want it generated. A report that arrives
at 06:00 and is read at 09:00 should be generated at 08:30, because a scheduled agent's
content is prepared at run time and can be stale by delivery
[references/research/distilled-routine-prompt-craft.md section 8].

If the diagnosis was that the urgent class cannot wait for the next run, the fix is not a
schedule change. That class belongs in its own routine
[references/research/distilled-routine-prompt-craft.md section 7.4]. Say so, and price it in
slots.

---

## Worked rewrite

The failure: a 31-word prompt, vague scope, no ceiling, no memory, no escalation, no handoff,
and its key term never defined. Twelve reports, then unread, then auto-paused
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

**Before:**

```
Please scan my emails every day and let me know if there are any critical to-dos, meeting
requests, and things I need to be aware of. Ignore all marketing emails and potential spam.
```

**Diagnosis:** scope 0, false-positive discipline 0 (one negative rule, and it is about spam
rather than about relevance), ceiling 0, memory 0, escalation 0, handoff 0, anxiety 0,
liveness 0. Score 0 to 2 of 18. This is a full rewrite, or a deletion.

**After:**

```
You are my end-of-day email check. The purpose is to let me leave my desk knowing nothing
addressed to me is sitting unanswered. Everything below serves that.

MEMORY
Before writing, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with limit 7. Read them
oldest to newest and count how many consecutive runs each item you are about to report has
already appeared in.

WHAT TO LOOK AT
Email received in the last 24 hours. Run these as separate searches:
  1. email addressed directly to me that asks a question
  2. meeting requests and calendar invitations needing a response
  3. replies in threads where I owe the next message

WHAT COUNTS
An email counts only if a named human is waiting on a response from me specifically.
Do not flag, even when it looks relevant:
  - newsletters, product announcements, and marketing, however targeted
  - cold sales outreach, including personalized cold outreach
  - automated notifications from tools and services
  - threads where I was CC'd and someone else is the primary recipient
  - anything I already replied to later in the same thread
When unsure, leave it out. A missed email is recoverable. A report I stop reading is not.

ESCALATION
Any item appearing in three or more consecutive reports: stop restating it. Say the previous
approach is not working, name what was tried, and recommend a different tactic: another
channel, another person, or dropping it. At seven runs, move it to "Stalled, needs a
decision" and state the decision in one sentence.

OUTPUT
  TOP: one sentence. The single email to answer before I stop for the day.
  Waiting on me: at most 5 items, one line each: sender, what they asked, how many days.
    If more than 5, give the top 5 by age and end with "plus N more".
  Meetings needing a response: at most 3, one line each.
Under 150 words. If over, cut the lowest-ranked item rather than shortening every line.

QUIET DAYS
If nothing meets the bar, write "Inbox is clear, nothing needs you" and stop. That is a
correct and complete report. Do not lower the bar to fill sections.

HANDOFF
End every item with: Next: open Cowork and run <skill> on <target>. If no skill applies,
write: Next: <the physical action>, roughly <time>.
```

**Change list to show the user:** all seven sections added; the original spam exclusion kept
and expanded into five worked negative cases; the schedule unchanged; the routine currently
paused, so applying this rewrite also requires unpausing it, which is a separate decision.

Note the last item. A rewrite of a paused routine changes nothing until it is running, and
saying so prevents the user believing they fixed something they did not.
