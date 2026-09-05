---
name: routine-architect
description: "Audit my routines, why does my routine keep repeating itself, fix my routine
  prompt, my daily report is useless, set up a routine, what routines should I have. Scores
  every Littlebird routine against a nine-point rubric built from alert-fatigue research,
  diagnoses failures from the report history rather than the prompt text, writes complete
  replacement prompts with memory and escalation clauses, and wires each routine to the
  Cowork skill that resolves what it finds. Use for auditing, rewriting, or designing
  routines, not for running the work a routine reports on."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# routine-architect

## Purpose

The skill that fixes the other automation. It reads the user's routines, scores them, proves
what is broken by quoting their own reports back, writes complete replacement prompts, and
connects each routine to the Cowork skill that resolves what it finds.

The core finding it exists to deliver: **a good prompt is not the same thing as a complete
prompt.** A routine can have scope, false-positive discipline, a length ceiling, and an
explicit clause telling it not to manufacture anxiety, and still flag the identical item for
sixteen consecutive days, because it is missing two clauses that are invisible in the prompt
and obvious in the reports
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

---

## Littlebird MCP calls used

Real tool names, verified against the live server. List the tools actually available in this
session before calling any of them. This is the heaviest user of the routine tools in the
marketplace and it uses nothing else: the subject is the routine layer itself, so the evidence
lives in routine configs and routine reports rather than in capture.

| Tool | Used for |
|---|---|
| `LB_INTERNAL_LIST_ROUTINES` | Step A, the inventory. Title, schedule, report count, latest report date, paused state, and id for every routine. Staleness and production rate are computed from this before anything is read |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Step B, per `routine_id`. Full prompt text plus the auto-pause setting, the push and email notification flags, agent mode and created date. Called a second time immediately before any write, never from memory of the first call |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Step C, per `routine_id`, `limit: 7` minimum where history allows and 25 at the tool maximum. The real evidence. Six of the nine failure modes are only visible here |
| `LB_INTERNAL_UPDATE_ROUTINE` | Stage 3, `routine_id` plus only the fields being changed. `prompt` and `schedule` each REPLACE the whole field, so the replacement text is handed back in full and approved as text before the call |
| `LB_INTERNAL_CREATE_ROUTINE` | Stage 4, `title`, `prompt`, `schedule`, `notifications_enabled`, `email_notifications_enabled`. Creating immediately generates a first report, which is the free evaluation described below |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Step D, no parameters. The plan and the slot budget, checked before anything that consumes a slot is recommended |

`schedule` shape:
`{"frequency": "daily"|"weekly"|"monthly", "time": "HH:MM", "week_days": ["MO", ...], "month_day": 1-28}`,
in the user's local timezone (`references/littlebird-mcp-reference.md`, routine tools).

**The structural fact this whole skill is shaped around: `LB_INTERNAL_CREATE_ROUTINE` and
`LB_INTERNAL_UPDATE_ROUTINE` are not available from inside a running routine**
(`references/littlebird-mcp-reference.md`, routine tools). A routine cannot spawn or rewrite
routines, so this skill is interactive by construction. That same constraint is what produces
the observe-and-act split it wires into every routine it touches: routines observe and report,
Cowork sessions hold the approval gate and do the writing. The argument in full is in
`references/observe-act-wiring.md`.

Not used: `search_user_context`, `LB_INTERNAL_LIST_MEETINGS`, `LB_INTERNAL_SEARCH_MEETINGS`,
`LB_INTERNAL_GET_MEETING`, `LB_INTERNAL_GET_MEETING_TRANSCRIPT`. Auditing a routine against
capture instead of against its own reports is a second-hand check of a first-hand record.

---

## Trigger

Trigger phrases: audit my routines, why does my routine keep repeating itself, fix my routine
prompt, my daily report is useless, my routine flags the same thing every day, I stopped
reading my routine, set up a routine, what routines should I have, is this routine worth the
slot, my routine got paused.

Also run it when a sibling skill reports a routine as stale, repetitive or unread. That is a
data-quality note in their output and a work item here.

Do not trigger for: running the work a routine reports on, which belongs to whichever skill
owns that domain; proposing a new skill for repeated manual work, which is `skill-suggester`;
or producing the week's scorecard, which is `weekly-review`.

---

## Routine cadence

**On demand, plus a monthly review of the portfolio.** A routine portfolio drifts slowly:
reports get longer, repeats accumulate, one routine quietly auto-pauses. Monthly is fast enough
to catch that and slow enough that the audit itself does not become the noise.

**This skill cannot run as a routine, and the reason is structural rather than stylistic.**
The two tools it needs to do anything about what it finds, `LB_INTERNAL_CREATE_ROUTINE` and
`LB_INTERNAL_UPDATE_ROUTINE`, are unavailable from inside a running routine, and it requires an
`AskUserQuestion` approval gate before every write, which a routine also cannot hold open
(`references/littlebird-mcp-reference.md`, routine tools). So there is no scheduled mode of this
skill. There is a calendar reminder to open Cowork and run it, and that is the honest version.

**What it does create is other people's routines, and it creates them here.**
`LB_INTERNAL_CREATE_ROUTINE` works from an interactive session. Do not tell the user to go set a
routine up by hand: check the slot with `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`, name which slot it
takes, show the full prompt text and the schedule, get approval through `AskUserQuestion`, then
call `CREATE_ROUTINE` and read the first report with them. Patterns ready to paste are in
`references/routine-library.md`.

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**. Before anything else:

1. **List the tools actually available in this session** and use the real names you find. Do
   not assume the names in `references/littlebird-mcp-reference.md` are still exact. That file
   is verified as of 2026-08-17 and is a starting point, not a contract.
2. If no Littlebird tools are present, **stop.** Say the skill needs the Littlebird MCP
   connected. There is no degraded mode: an audit of routines you cannot read is a guess.
3. Call the subscription status tool early. You need the plan before recommending anything
   that consumes a slot.

---

## Do this first, every time

Read these two before you touch retrieval:

1. `references/evidence-standards.md` - the receipt format, the observed / inferred / external
   / unknown split, and the two confirmation gates.
2. `references/littlebird-mcp-reference.md` - tool parameters, return shapes, and the routine
   tool constraints this skill is built around.

Then `references/failure-modes.md`, which is the taxonomy everything else scores against.

---

## Process

| Stage | Guide | Output |
|---|---|---|
| 1. Audit | `references/audit-rubric.md` parts 1 to 3 | Score out of 18 per routine, with report evidence |
| 2. Diagnose | `references/failure-modes.md` | Named failure modes, each with a quoted receipt |
| 3. Rewrite | `references/prompt-rewriting.md` | Full replacement prompt text, approved before it is sent |
| 4. Design new | `references/routine-library.md` | Ready-to-paste patterns for the user's job function |
| 5. Wire the handoff | `references/observe-act-wiring.md` | A named next action on every reported item |

Stages 1 and 2 always run. Stages 3 to 5 run only where the audit earned them.

---

## Retrieval brief

Four calls, in this order. No `search_user_context` sweep: this skill's subject is the routine
layer itself, and the evidence lives in routine configs and reports.

**Step A. The inventory.** `LB_INTERNAL_LIST_ROUTINES`, no limit. Gives title, schedule,
report count, latest report date, paused state, and id. Compute staleness (latest report date
against the schedule interval) and production rate (report count against the created date)
before reading anything else.

**Step B. The configs.** `LB_INTERNAL_GET_ROUTINE_CONFIG` per routine. Returns the full prompt
plus the auto-pause setting, notification flags, agent mode, and created date. Do not skim
past the settings to reach the prompt. A routine with auto-pause-on-unread enabled that has
paused did not fail administratively: the product's disengagement circuit breaker fired, which
is a measured alert-fatigue event
[references/research/distilled-routine-prompt-craft.md sections 4.2 and 8].

**Step C. The reports, which is where the real evidence is.**
`LB_INTERNAL_GET_ROUTINE_REPORTS` per routine, **`limit: 7` minimum** where the history
allows, up to the maximum of 25. Fewer than 3 reports makes repetition undetectable, which
means the memory, escalation, and anxiety criteria cannot be scored at all.

Read them oldest to newest. Alert fatigue is defined as a sustained decrease in appropriate
response over time relative to a baseline
[references/research/distilled-routine-prompt-craft.md section 4.2], so the diagnostic signal
is a trend and a single report cannot show one.

Build the repeat table from `references/audit-rubric.md` part 1 step 4 before scoring
anything. It drives four of the nine scores.

**Step D. The plan.** `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`. Routine count is plan-limited.
Slots are scarce by design across this whole product category: ChatGPT caps scheduled tasks at
3 to 15 by tier, Gemini at 10
[references/research/distilled-routine-prompt-craft.md section 8]. Never recommend adding a
routine without naming which slot it uses.

---

## Read the reports, not just the prompt

The one instruction that separates this skill from a prompt review.

Six of the nine failure modes are invisible in the prompt text. The prompt states intent. The
reports are the evidence of whether the intent survived contact with real data. A routine
whose prompt says "keep the total output under 200 words" can produce reports that run past
it, and the only way to know is to measure them
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

Every diagnosis you present carries a quoted report line with its date
(`references/evidence-standards.md` rule 1). The score is an opinion. The quoted line is the
argument.

---

## The nine failure modes

Full detection method, cost, and fix clause for each in `references/failure-modes.md`.

| # | Failure | Detected in |
|---|---|---|
| 1 | No memory. Never reads its own past reports, so it rediscovers the same conditions forever | Prompt and reports |
| 2 | No escalation rule. Nothing says what to do when an item recurs | Reports |
| 3 | No handoff. Every finding needs the human and nothing names what resolves it | Reports |
| 4 | Vague scope. Names a topic instead of sources, tests, structure, and length | Prompt |
| 5 | No false-positive discipline. Flags everything, trains the user to ignore it | Prompt and reports |
| 6 | Dead or paused, occupying a scarce plan slot | List and config |
| 7 | Unbounded output, or a ceiling stated once and never honored | Prompt and reports |
| 8 | Schedule mismatch. Wrong cadence, wrong time, or an urgent class trapped in a slow digest | Reports |
| 9 | Anxiety manufacturing. No permission to report nothing, so it invents something | Reports |

Modes 1 and 2 are separate on purpose. Memory without escalation produces a routine that knows
it is repeating and repeats anyway, louder. The live grounding case does exactly that: it
wrote "It's been the #1 item for three days straight", then the next day "This has been the #1
item for four straight days", with the recommended action unchanged
[references/research/raw/routine--grounding--littlebird-live-account-2026-08-17.md].

---

## Alert fatigue is the constraint the rubric is built on

Routines are an alert stream. The prompt-craft literature tells you how one run produces good
output. The alert-fatigue literature tells you what happens over hundreds of runs when that
output is not worth reading.

The numbers that set the stakes. In 382 clinician-reviewed medication alerts: 92.9%
overridden, 7.3% clinically appropriate, and in 89% of cases the alert was wrong and the human
was right to ignore it. The authors' conclusion: "Alert fatigue is unavoidable when a large
number of irrelevant alerts are generated in response to a small number of useful alerts"
[references/research/distilled-routine-prompt-craft.md section 4.1].

Three rules follow, and they govern every recommendation this skill makes.

- **Under-alerting is the cheaper error.** "Err on the side of removing noisy alerts,
  over-monitoring is a harder problem to solve than under-monitoring"
  [references/research/distilled-routine-prompt-craft.md section 4.4]. A routine that misses
  something can be tuned. A routine the user stopped opening cannot, because the tuning signal
  is gone.
- **Every finding must be actionable.** "Simply noting 'this paged again' is not an action"
  [same section]. That single sentence is failure modes 2 and 3 together.
- **An ignored finding is not proof the finding was wrong.** An inappropriate finding and an
  appropriate finding the user chose not to act on are different failures with different
  fixes, and the literature warns that tuning a proxy can miss entirely
  [references/research/distilled-routine-prompt-craft.md section 4.3]. When you cannot tell
  which one you are looking at, ask.

**Stated conflict, because the archive contains one.** A 2009 air traffic control study found
a 45% false-alert rate produced no measurable cry wolf effect in expert controllers
[references/research/distilled-routine-prompt-craft.md section 4.5]. That result narrows the
claim rather than overturning it: the tolerance depended on an expert already watching the
underlying condition independently, which is precisely the case a routine does not cover.
Prefer the pessimistic reading and be able to say why.

---

## Creating a routine is a free test

Creating a routine immediately generates a first report, then it runs on schedule
(`references/littlebird-mcp-reference.md`, routine tools). That first report is a real
evaluation against real data, and it arrives while the user still remembers exactly what they
asked for.

Use it. Read it with the user and check three things: did it find real items, did it hold the
length ceiling, and would it have said something on a quiet day rather than manufacturing one.
Fix the prompt now if any answer is no. This is the closest thing to a prompt evaluation loop
this environment offers, and both vendors' production guidance says to build one rather than
shipping and hoping [references/research/distilled-routine-prompt-craft.md section 2].

Note the asymmetry: **updating** a routine does not generate an immediate report. A rewrite
takes effect at the next scheduled run, and a rewrite of a paused routine changes nothing at
all until it is unpaused. Say both out loud.

---

## Evidence standards

Apply `references/evidence-standards.md` in full. The four that bite hardest here:

- **Receipts on every diagnosis** (rule 1). Quote the report line and its date. "This routine
  repeats itself" is an opinion. "The same contact appears on Aug 13, 14, 15 and 16 with the
  same recommendation" is a finding.
- **Observed, inferred, unknown stay visibly different** (rule 2). A repeat streak counted
  from the reports is observed. "The user has stopped reading it" is an inference unless they
  said so or the routine auto-paused on unread. Never convert an absence of reports into a
  claim about the user's behavior.
- **Confirm before you encode** (rule 6). The replacement prompt is a durable change to the
  user's automation. It gets approved as text.
- **Raw capture never ships** (rule 7). Routine reports contain vendor names, amounts,
  third-party contacts, and account detail. Quote the minimum the diagnosis needs. Do not
  reproduce a full report into a deliverable, and apply rule 10 to any third party named in
  one.

---

## Output

One markdown file in the working directory: `routine-audit-<YYYY-MM-DD>.md`.

Contents, in this order:

1. **Bottom line.** One sentence: the single highest-value change. Lead with the decision, not
   a recap. A bottom line is not a summary
   [references/research/distilled-routine-prompt-craft.md section 7.1].
2. **Slot budget.** Routines running, dead routines, plan limit, slots available.
3. **The audit table.** One row per routine, worst first: title, schedule, report count, last
   run, score out of 18, top failure, recommendation.
4. **Per-routine diagnosis blocks** for anything scoring below 15, in the format in
   `references/audit-rubric.md` part 5. Each opens with what the routine does well, then the
   failures with quoted evidence, then the cost, then the fix.
5. **Replacement prompts**, in full, in code blocks, exactly as approved.
6. **Proposed new routines**, at most three, each with its pattern name from
   `references/routine-library.md`, its schedule, its slot cost, and its handoff target.
7. **Applied changes.** What was actually sent to `UPDATE` or `CREATE`, confirmed by a
   follow-up config read, and when each takes effect.

If the user declined every change, the file still ships with sections 1 to 4 and an explicit
line saying no changes were applied. A declined audit is a completed audit.

---

## Guardrail

**The risk this skill carries is that it writes to live automation the user depends on, and it
spends a resource the user cannot get more of.** Every other skill in this marketplace produces
a document. This one edits the things that produce documents, unattended, on a schedule, after
the session has ended. A bad rewrite is not a bad paragraph the user can ignore; it is a
routine that quietly stops reporting the one thing it existed to catch, and nobody finds out
until the thing it was watching has already happened.

### Never silently rewrite someone's automation

`LB_INTERNAL_UPDATE_ROUTINE` replaces the **entire** prompt. There is no patch and no append
(`references/littlebird-mcp-reference.md`, routine tools). Three non-negotiables:

1. **Call `LB_INTERNAL_GET_ROUTINE_CONFIG` immediately before writing a replacement**, not
   from memory of an earlier call. The user may have edited it in the app while you were
   talking.
2. **Hand back full text.** Every clause you intend to keep must be present, character for
   character where you are not deliberately changing it.
3. **Get explicit approval of the actual replacement text via `AskUserQuestion` before
   calling UPDATE.** Not a description of the change, the text
   (`references/evidence-standards.md` rule 6). Editing live automation is exactly the class
   of action first-party guidance puts behind a confirmation gate
   [references/research/raw/routine--prompt-craft--claude-platform-docs-prompting.md].

Show, in order: the diagnosis with its receipts, the full current prompt, the full replacement
prompt, a change list naming what was added, removed, and **kept**, and a one-sentence
prediction of what changes in the next report. Then ask, with "leave it as is" offered as a
real option you accept without arguing. Read-back structure in
`references/prompt-rewriting.md`.

**Preserve what works.** A routine scoring 10 to 14 is mostly right. Keep the user's own scope
language and worked negative cases verbatim: those came from real false positives that
annoyed them, and rewriting them for style destroys information you cannot recover. Then say
so plainly: "two sections added, everything else is your original text, unchanged." That
sentence is what gets a rewrite approved.

The same gate applies to deletion and to pausing. A dead routine is still the user's, and
"delete it" is a recommendation this skill makes, never an action it takes on its own.

### Slots are scarce, so kill before you add

Routine count is plan-limited. Recommendations always run in this order, and say why:

1. **Delete** dead routines. A slot freed at zero cost and zero risk.
2. **Fix** routines scoring 10 to 14. Highest value per unit of work.
3. **Rewrite** routines scoring 5 to 9.
4. **Add** new ones, one at a time, only after the first three and only into a free slot.

Never propose a new routine without naming which slot it takes. Present it as a budget: "you
are running two routines, one has produced nothing since May, and adding this means either an
upgrade or reclaiming that slot."

And cap the ambition. Do not install more than two new routines in a session whatever the plan
allows: a person absorbs a few interruptions a day before fatiguing
[references/research/distilled-routine-prompt-craft.md section 4.4], and the damage comes from
interrupt volume rather than notification volume
[references/research/distilled-routine-prompt-craft.md section 7.5].

---

## Empty and thin retrieval

| Situation | Action |
|---|---|
| No Littlebird tools in session | Stop at the capability gate. |
| Zero routines exist | Not an empty retrieval, it is a design session. Skip stages 1 to 3, ask about the user's job function, and go to `references/routine-library.md`. Propose at most two. |
| Routines exist, reports empty | Report that the routines have never produced output, which is itself the finding. Check the paused state and created date. Do not score criteria that need report evidence. |
| Fewer than 3 reports in a history | Say the audit is liveness-only for that routine. Score scope, false-positive discipline, ceiling, and anxiety from the prompt; mark memory, escalation, handoff, liveness, and schedule fit as not assessable. Never infer report content from prompt quality. |
| Reports too long to read in full | Read the most recent 7 in full. Repetition shows up inside 7 runs, and 25 is the tool maximum anyway. |
| Cannot tell whether an ignored finding was wrong or just unactioned | Ask the user. Do not guess. This is the single most common way an audit produces a confident wrong answer [references/research/distilled-routine-prompt-craft.md section 4.3]. |

A failed or empty retrieval ends the run (`references/evidence-standards.md` rule 9). Never
invent what a routine's reports probably said.

---

## Routine wiring

**None for itself, for the reasons given under Routine cadence above.**

What this skill does instead is wire **other** routines to their Cowork counterparts. Every
routine it writes or repairs ends each reported item with a named next action:

```
Next: open Cowork and run <skill-name> on <specific target>.
Next: <the single physical action>, roughly <time estimate>.
```

The finding-to-skill mapping, the rules that make a handoff real rather than decorative, and
the reverse direction (a Cowork skill reading the routine's own report history before it
starts) are all in `references/observe-act-wiring.md`.

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## Related skills

| Skill | The boundary |
|---|---|
| `skill-suggester` | It proposes NEW skills from repeated manual work in capture. This one tunes, repairs and designs the routines that already exist. Reach for it when the answer to a detected pattern is a workflow the user does not have yet; stay here when the answer is a watch they already have, badly written. **They overlap, deliberately and declaredly:** `skill-suggester` runs a monthly detector for reusable patterns, and this skill ships a reusable-asset watch pattern in `references/routine-library.md` that looks at the same signal on the same cadence. Two monthly routines naming the same work make both unreadable and burn two scarce slots, so install one and say which. |
| `weekly-review` | The biggest consumer of routine reports in the marketplace: it composes the week by reading the siblings' own output rather than re-deriving it. That makes it the loudest early warning for this skill. When it prints a sibling as stale, paused or repeating, it stops there and points here, because it never grades a routine. Reach for it for the week's scorecard; come here to ask whether the routines producing that scorecard are worth their slots. |
| `daily-brief` | The daily rollup reader, and the routine whose failure modes surface fastest, because a daily cadence produces a repeat streak in a week where a weekly one takes two months. Reach for it to get the day composed; come here when its report has flagged the same item four days running, which is failure modes 1 and 2 together. |

---

## Reference map

| File | Load it when |
|---|---|
| `references/failure-modes.md` | Always, before scoring. The nine failure modes, their detection, cost, and fix clauses. |
| `references/audit-rubric.md` | Stage 1. Collection order, the nine-point score, report diagnostics, portfolio findings, recommendation order. |
| `references/prompt-rewriting.md` | Stage 3. The seven-part prompt shape, clause text, the read-back and approval gate, a full worked rewrite. |
| `references/routine-library.md` | Stage 4. Ten complete patterns across five job functions, ready to paste. |
| `references/observe-act-wiring.md` | Stage 5, and any time the user asks why this skill cannot run as a routine. |
| `references/evidence-standards.md` | Always, first. |
| `references/littlebird-mcp-reference.md` | Always, first. |
| `references/research/distilled-routine-prompt-craft.md` | When you need the citation behind a rule, or to check whether a claim is evidenced at all. Section 9 is the claim map. |
| `references/research/README.md` | Source inventory and the archive's six named gaps. |

**Three things in this skill are design decisions rather than researched practice**, and they
are labelled as such wherever they appear: the three-occurrence escalation threshold, the
nine-mode taxonomy itself, and the routine library patterns. No vendor publishes any guidance
on writing a recurring agent prompt, which is the archive's largest gap and the reason the
rubric is constructed by transferring the alert-fatigue and digest-design literature. See
`references/research/distilled-routine-prompt-craft.md` section 10.
