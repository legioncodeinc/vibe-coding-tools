---
name: day-reconstructor
description: "What did I do today, write my dev log, what did I work on last night, changelog entry for this session, reconstruct my day, what did I ship. Rebuilds a work session from Littlebird capture into a dev log: repos and files touched, problems solved with what was tried and what worked, decisions that never became a commit message, a ready-to-paste Keep a Changelog block, and an honest coverage note. Session boundary is user-defined, not the calendar day. Reconciles against git when a repository is reachable."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---

# day-reconstructor

## Purpose

Rebuild what the user actually did across a work session and write it down, because they
will not.

The value is not the file list. Instrumented measurement across 78 developers and 3,148
working hours put code editing at **5.02% of monitored time** and comprehension at
**57.62%**, with more comprehension time spent in a browser than in an IDE
[references/research/distilled-dev-logging.md section 4]. A commit-driven changelog
generator covers exactly the set of commits and nothing else
[references/research/distilled-dev-logging.md section 3]. Everything in between, the error
that ate three hours, the two approaches that did not work, the decision made in a chat
panel that never reached a commit message, is invisible to both.

That in-between is what this skill reconstructs. Both practitioner sources in the archive
independently center the debugging record, and one of them reports actually going back for
it: "There's been several times I dug back into my notes and found the solution I'd written
down the last time" [references/research/distilled-dev-logging.md section 7]. The reason
nobody has that record is also documented, and it is not disagreement about value. It is
setup cost plus a recurring 10 to 15 minute daily writing burden, paid at exactly the moment
a person least wants to write anything [references/research/distilled-dev-logging.md
section 7].

**Mode: daily routine plus on-demand for a chosen session.**

---

## Capability gate

This skill requires the **Littlebird MCP on a Power or Pro plan**. Before anything else:

1. **List the tools actually available in this session.** Use the real tool names you find.
   The inventory in `references/littlebird-mcp-reference.md` is verified as of 2026-08-17
   and is a starting point, not a contract.
2. If no Littlebird tools are present, **stop**. Tell the user this skill needs the
   Littlebird MCP connected, and that it cannot be run from memory or from a description of
   what they did. There is no degraded mode for the capture side. A dev log written without
   capture is fiction, and the whole point of this one is that it was observed.
3. In the same tool listing, check for **git access**: a GitHub or GitLab connector, or
   filesystem access to a local clone. This one is optional. See
   `references/activity-attribution.md`, reconciling against git. Its absence degrades the
   output, it does not stop the run.
4. If the plan gate is in doubt, call the subscription status tool before promising a
   reconstruction.

---

## Littlebird MCP calls used

Real tool names. See `references/littlebird-mcp-reference.md`.

| Tool | Used for |
|---|---|
| `search_user_context` | Every sweep. Session boundary via `filters: {"data_source": "summaries"}`, activity via `snapshots`, and message threads via `messages`. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Reading this skill's own past reports, so a multi-day project reads as continuous progress. Mandatory before writing. |
| `LB_INTERNAL_LIST_MEETINGS` | Finding calls that fell inside the session window, by date. |
| `LB_INTERNAL_GET_MEETING` | Pulling a meeting's Decisions and Action Items sections, which are already owner-tagged. |
| `LB_INTERNAL_CREATE_ROUTINE` | Offering to create the daily routine. Works from an interactive session. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG`, `LB_INTERNAL_UPDATE_ROUTINE` | Changing the routine's schedule when the user's session boundary moves. Always read the config first, because `prompt` and `schedule` each replace the whole field. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | The plan gate, and checking whether another routine can be created. |

Git access is **not** a Littlebird tool. It is a separate connector that may or may not be
present. List your tools and degrade gracefully.

---

## Trigger

Fires on: "what did I do today", "what did I work on last night", "write my dev log",
"changelog entry for this session", "what did I ship this week", "reconstruct my day",
"I need to write my standup", "what was I doing on Tuesday".

Also fires when the user has just finished a session and wants the record before they lose
it, which is the case the daily routine exists to cover automatically.

Does **not** fire for: writing a procedure someone else will follow (that is `sop-forge`),
or a forward-looking plan for the coming day (that is `daily-brief`).

---

## Routine cadence

**Daily, at the user's session end plus about an hour.**

Not midnight. The target user works nocturnal sessions, and there is no source in the
archive defining a workday boundary for a non-standard schedule
[references/research/distilled-dev-logging.md section 9, gap 1]. What the archive does show
is that productive windows vary substantially between individuals, with at least three
distinct patterns in a logged population
[references/research/distilled-dev-logging.md section 5]. So the schedule is derived from
the user's stated boundary, never assumed.

`references/session-boundaries.md` sections 1 to 3 covers how the boundary is established
and stored.

---

## Process

Read `references/evidence-standards.md` and `references/littlebird-mcp-reference.md` first,
in that order, before touching retrieval. Then work the stages.

| Stage | Guide | Output |
|---|---|---|
| 1. Fix the session boundary | `references/session-boundaries.md` sections 1 to 3 | A concrete window with times, possibly crossing midnight |
| 2. Read your own past reports | `references/session-boundaries.md` section 6 | Open threads, unresolved problems, and last session's stated next step |
| 3. Four sweeps | Retrieval brief below | Raw retrieval |
| 4. Sort, deduplicate, group into threads | `references/session-boundaries.md` section 5, reusing `sop-forge/scripts/dedupe_snapshots.py` | Distinct states in time order, grouped into work threads |
| 5. **Redaction pass** | `sop-forge/references/redaction-pass.md`, by reference | Redacted values, placeholders, rotation flags |
| 6. Attribute every observation | `references/activity-attribution.md` | Each item in a tier: Confirmed, Strong, Weak, or not evidence |
| 7. Reconcile against git, if available | `references/activity-attribution.md`, reconciling against git | Weak file claims promoted to Confirmed, or a one-line statement that there was no reconciliation |
| 8. Extract problems and decisions | `references/problem-solved-extraction.md` | The problem entries, the open list, the decisions |
| 9. Confirm with the user | `references/problem-solved-extraction.md`, confirm before you encode | Corrected problems, corrected decisions |
| 10. Render | `references/changelog-formats.md` | The artifact |

Stage 5 runs **before** stage 9, so the read-back does not itself display a secret. Stage 5
never gets skipped, not for any output variant, not when the user says the session was
harmless. Terminal and editor capture is dense with credentials by default: a `.env` open in
a tab, a token echoed by a failing curl, a connection string in a database client.

Stage 2 is not optional either. A multi-day project that reads as N disconnected logs is a
log the user stops opening [references/research/distilled-dev-logging.md section 7].

---

## Retrieval brief

The exact queries. Reasoning and parameter shapes in the guides.

**Sweep A. Session boundary.** `search_user_context`, `filters: {"data_source":
"summaries"}`, `date_range` spanning 36 hours centred on the target period so a
cross-midnight session is not cut in half. Queries:
`["what was worked on", "coding development session activity"]`. The summaries source is
Littlebird's own compressed digest and is the cheapest way to see the shape of a period
(`references/littlebird-mcp-reference.md`, retrieval pattern 3). Full call in
`references/session-boundaries.md` section 2.

**Sweep B. Development activity.** `filters: {"data_source": "snapshots"}`, windowed to the
session, split into sub-windows of about two hours. Five narrow queries per sub-window
rather than one broad one (`references/littlebird-mcp-reference.md`, retrieval pattern 1):

1. `"terminal command prompt shell output"`
2. `"code editor file open source code"`
3. `"git status branch commit diff"`
4. `"pull request review code diff"`
5. `"AI assistant chat coding question suggestion"`

**Sweep C. Errors and failures.** Its own sweep, its own budget. This is the one that earns
the skill. Six queries covering stack traces, non-zero exits, test failures, build failures,
connection and permission errors, and warnings. Full call in
`references/problem-solved-extraction.md` step 1. Do not fold this into sweep B: a failing
command is a few seconds of screen and looks almost identical to a passing one.

**Sweep D. Decisions in threads and calls.** `filters: {"data_source": "messages"}` over the
session window, queries
`["decided approach chose instead of", "we should use rather than", "going with"]`. Plus
`LB_INTERNAL_LIST_MEETINGS` over the window, and `LB_INTERNAL_GET_MEETING` on anything that
lands inside it. A meeting summary's Decisions and Action Items sections are already tagged
with who decided and who owns
(`references/littlebird-mcp-reference.md`). Build on that rather than re-deriving it from
raw transcript.

**Then sort by timestamp.** Retrieval is relevance-ordered, not chronological
(`references/littlebird-mcp-reference.md`, known limitations;
`references/evidence-standards.md` rule 8). For messages, collection time and send time are
different values and the send time governs the timeline.

---

## Attribution is the whole skill

Capture shows what was **on screen**. During a development session that includes code the
user was reading, code an AI assistant wrote, documentation, other people's pull requests,
and Stack Overflow answers. Attributing all of that to the user produces a fabricated dev
log, and it is fabricated in a specific way: every path in it is real, every error message
in it is real, and it is still wrong.

The four rules that matter most. Full ruleset in `references/activity-attribution.md`.

- **A file open in an editor is not evidence the user edited it.** It goes in a "files in
  view, not established as changed" list, never in the files-changed list. An editor's
  modified-file indicator, a source control panel showing the file as modified, or two
  frames of the same file with different content are what promote it.
- **A terminal command on a line following the user's prompt is strong evidence.** The user
  ran it. Record the command verbatim, the working directory from the prompt, and the result
  from the next frame. The terminal is the highest-quality signal in the capture and the
  prompt is a better source for the repo name than a window title.
- **An AI assistant's output is not the user's authorship. The user's handling of it is the
  user's decision.** A suggestion followed by that code appearing in a file is an
  acceptance, and it is logged under Decisions, not as something the user wrote. A
  suggestion rejected or reworked is usually the more informative entry. An assistant's own
  claim that it edited a file is not evidence a file was edited: reconcile it or drop it.
- **A browser page is reading, with one exception.** A page opened right after an error, with
  the error text or a paraphrase in the page or the search query, is a debugging step and
  belongs in the problem entry. The search query is often the clearest statement of what the
  user thought the problem was.

Then two absolutes:

**Never invent a file path.** If capture reads `src/auth/refre` because a tab was truncated,
write what was captured and mark it a gap. A fabricated path gets pasted into a search box
six months later and wastes an afternoon.

**Never invent a commit.** A commit is either reconciled against a repository or it is not in
the log as a commit. Not a SHA, not a message, not a count.

No archived source covers attributing screen content to a user versus to an assistant or to
read-only material [references/research/distilled-dev-logging.md section 9, gap 3]. This
ruleset is a design decision built on the capture semantics in
`references/littlebird-mcp-reference.md` and the attribution guardrail in
`references/evidence-standards.md` rule 4. It is labelled as such at the point of use.

---

## Reconcile against git when you can

This converts inference into observation for every file-level claim, which is the one place
in this skill where a hard fact is available.

**List your available tools first.** Look for a GitHub or GitLab connector, or filesystem
access to a local clone. Do not assume either exists.

If git access exists: retrieve the user's commits over the session window plus a few hours,
and match. A file that was only "in view" but appears in a commit diff promotes to
Confirmed. A file observed as edited but in no commit stays Strong and gets labelled
"changed, not committed as of the end of the session", because uncommitted work is real
work. A commit found with no observed activity is a coverage finding and gets said out loud.
Full table in `references/activity-attribution.md`.

If no git access exists, the skill still runs. Every file-level claim caps at Strong, and the
coverage note carries one line:

```
Reconciliation: none. No repository access in this session, so file-level claims rest on
screen capture alone and were not checked against commit history.
```

Offer to reconcile later if the user connects a repo. Once. Do not nag.

**The commit list never becomes the log.** Reconciliation confirms what landed. Editing is a
single-digit percentage of a developer's day
[references/research/distilled-dev-logging.md section 4], and a commit-driven generator's
coverage is exactly the set of commits
[references/research/distilled-dev-logging.md section 3]. The problems and the decisions are
the part git cannot produce.

---

## Evidence standards

Apply `references/evidence-standards.md` in full. The four that bite hardest here:

- **Every claim carries a receipt**, canonical form
  `[Sunday, August 17, 2026 23:12 EDT | vscode]` (rule 1). In this skill the receipt is also
  a navigation aid: the user opens that timestamp in the Littlebird app to see the original
  screen. Say so once in the provenance block.
- **Observed, inferred, external, unknown stay visibly different** (rule 2). This bites
  hardest on decisions, where the choice is usually observed and the reason for it is
  inferred. Collapsing those two makes the log assert a rationale the user never had.
- **Rate what a reader will act on** (rule 3). A resolution inferred only from an error
  ceasing to appear is Low and says so. High needs both the failure and the success
  observed.
- **Never convert an absence into a negative finding** (rule 2). "No commits observed in
  this window" and "no commits were made" are different claims. Only the first is
  supportable.

---

## The redaction pass, by reference

Do not rebuild one. Run sop-forge's.

1. Read `sop-forge/references/redaction-pass.md` and follow it. Its category table, its
   three sweeps, its typed-placeholder rule, and its rotation flag apply unchanged.
2. Run the structural scan with `sop-forge/scripts/dedupe_snapshots.py --scan-secrets` over
   the timestamp-sorted timeline. It reports pattern and position and never prints a matched
   value.
3. Then run the semantic and context sweeps by hand. A client name is an ordinary word and
   no pattern finds it.

One difference in application. sop-forge's placeholder test is that the step stays
followable. Here the test is that the entry stays **searchable**: the reader has to be able
to find this problem again in six months, so the error class and the field name survive even
when the value does not.

The rotation flag applies in full. Anything matching an authentication pattern was on
screen, which is exposure. The artifact carries a security notice naming the field and the
entry, never the value.

Raw capture never ships (`references/evidence-standards.md` rule 7). Delete the working
timeline once the artifact is written.

---

## Output

**Primary artifact:** one Markdown file per session, written to the working directory, in
the practitioner structure the archive documents
[references/research/distilled-dev-logging.md section 7]:

```
dev-log/2026-08 (August)/2026-08-17.md
```

Named by the date the session **started**, ISO 8601, because that is what both changelog
specifications require and it is unambiguous across regions
[references/research/distilled-dev-logging.md section 1]. A session that crossed midnight
says so in its header.

Sections, in this order. Full shapes in `references/changelog-formats.md`.

| # | Section | Contents |
|---|---|---|
| 1 | Header | Session window, boundary convention, elapsed span, and the personal-record line |
| 2 | Security notice | Only if credentials were found on screen. Field and entry named, value never |
| 3 | In one line | What the session was about. Written last |
| 4 | **Problems solved** | Per problem: symptom title, repo, verbatim error, the ordered list of what was tried, the specific fix, confidence, receipts |
| 5 | **Open problems** | Carried forward with a session count and the accumulated cross-session attempt list |
| 6 | **Decisions made** | The choice, the alternative not taken, the reason with its tier marked, receipt |
| 7 | Work threads | Chronological by start time, time ranges labelled span not duration |
| 8 | Repos, files, tools | Three separate lists: repositories, files changed (Confirmed or Strong), files in view not established as changed |
| 9 | Changelog block | Keep a Changelog 1.1.0, ready to paste |
| 10 | Coverage note | Never omitted |
| 11 | Provenance | Counts: retrieved, states, threads, values redacted, gaps, reconciliation status |

Problems come before the timeline deliberately. A chronological narrative buries the thing
worth keeping inside a list of window switches.

**Changelog block.** Keep a Changelog 1.1.0, six categories in spec order, entries under
`## [Unreleased]` unless a release was actually observed. Written in Common Changelog's
stricter style, which nothing in Keep a Changelog contradicts: imperative present-tense verb
first, each entry readable without its heading, commit and ticket references attached
[references/research/distilled-dev-logging.md section 1]. Chores, CI, build config, tests,
and docs with no user-visible effect get **no entry at all**. Every line traces to a
Confirmed or Strong observation, because a changelog is the authoritative record of what
changed and a fabricated line in it outlives every other mistake this skill could make.

**Second variant, plain-prose dev log.** Same content as prose, past tense, first person,
for a standup or a weekly update, roughly 120 to 200 words. Lead with the problem that took
longest, name the specific fix, keep the failed attempts in at one sentence each. If a
personal voice skill is installed in the session, use it. If none is, say so plainly and
point at this marketplace's voice creator skills. Never invent a voice profile.

**Coverage note, never omitted, including on the good days.** It states what portion of the
session the capture actually covers, names every capture gap with its length and position,
states the reconciliation status, and refuses to offer a coverage percentage, because the
archive supports no basis for computing one
[references/research/distilled-dev-logging.md section 9]. Shape in
`references/changelog-formats.md` section 4.

---

## Empty retrieval

| Situation | Action |
|---|---|
| No Littlebird tools in session | Stop at the capability gate. |
| Summaries empty for the window | Report it. Ask the user to confirm the window and the date. Do not run the expensive sweeps blindly. |
| Summaries present, no development-tool activity | **One line.** `2026-08-17: no development activity found in the 20:00 to 08:00 window. Captured apps were chrome, slack, and zoom. No terminal, editor, or repository activity observed.` No header, no coverage note, no changelog block. Stop. |
| Fewer than about 3 distinct work threads after grouping | Report what was found and name it a fragment, not a session log. Offer to widen the window. Do not pad it. |
| Everything scored 3 | Anything scored 3 is a maybe (`references/littlebird-mcp-reference.md`, retrieval pattern 5). Report low confidence throughout and confirm before writing anything durable. |
| Git connector present but the repository has no commits in the window | A real finding, not an error. "No commits observed in this window." Never "no commits were made." |

A failed or empty retrieval ends the run (`references/evidence-standards.md` rule 9). A day
with nothing in it gets one honest line, because producing anything longer teaches the user
that the log is padded, and that is the point at which they stop reading it.

---

## Routine wiring

Routines **can** be created from an interactive session. `LB_INTERNAL_CREATE_ROUTINE` and
`LB_INTERNAL_UPDATE_ROUTINE` are only blocked from inside a running routine
(`references/littlebird-mcp-reference.md`). So offer to create it, show the exact prompt and
schedule, get approval through `AskUserQuestion`, then call the tool. Do not tell the user
to go set it up by hand.

**What the routine can and cannot do.** A routine is an unattended observer producing one
report in one pass. It cannot run approvals, cannot write file deliverables, and cannot run
scripts (`references/littlebird-mcp-reference.md`). So the routine produces the **draft
report as text**, labelled unconfirmed, and the Cowork session produces the file artifact,
the git reconciliation, and the confirmation gate. That is the Routines-observe,
Cowork-acts pattern.

Because the routine cannot run the structural secret scan, its prompt carries a conservative
standing rule instead: quote no value that follows a credential-shaped label, and quote no
long high-entropy string at all.

**Schedule:** `{"frequency": "daily", "time": "HH:MM"}` where the time is the user's stated
session end plus about one hour, in their local timezone. For a session ending at 08:00,
that is `"09:00"`. Never default to midnight.

**Title:** `Session log`

**Prompt text to pass to `LB_INTERNAL_CREATE_ROUTINE`:**

```
Reconstruct the work session that just ended and write it up as a development log.

The session window is SESSION_START to SESSION_END local time. It crosses midnight, so
search across both calendar dates as one continuous window, not as two days.

Before writing anything, call LB_INTERNAL_GET_ROUTINE_REPORTS for this routine with
limit 5 and read the previous reports. Carry forward: any work thread left open, any
problem still unresolved with the count of sessions it has been open, and any next step
the last report stated. If a problem has appeared unresolved in three consecutive
reports, move it to the top of this report, list everything tried across all of those
sessions, and say plainly that the current approach is not converging.

Then run four sweeps with search_user_context over the session window:
1. data_source summaries, to establish the shape of the session.
2. data_source snapshots, for terminal commands and output, editor files, git status
   and diffs, pull request review, and AI assistant coding chats. Split the window into
   sub-windows of about two hours.
3. data_source snapshots, a separate sweep for errors: stack traces, non-zero exit
   codes, test failures, build failures, connection and permission errors, warnings.
   Run this as its own sweep. It is the most valuable one.
4. data_source messages, for decisions stated in threads.
Sort everything by timestamp before writing. Retrieval is relevance-ordered.

Attribution rules, which are not optional:
- A file open in an editor is NOT evidence it was edited. List those separately under
  "files in view, not established as changed".
- A terminal command on a line after the user's prompt IS strong evidence the user ran
  it. Record it verbatim with the repository from the prompt.
- An AI assistant's output is not the user's authorship. If the user accepted or
  rejected a suggestion, that is the user's DECISION and it goes under Decisions.
- A browser page is reading, unless it was opened right after an error with the error
  text in the page or the search query, in which case it is a debugging step.
- Never write a file path that was not fully captured. Mark it a gap instead.
- Never assert a commit exists. This routine has no repository access.

Redaction: quote no value that appears after a label containing key, token, secret,
password, credential, or auth, and quote no long high-entropy string. If anything
credential-shaped appeared on screen, say so by naming the field only, never the value,
and tell the user to rotate it.

Write the report with these sections, in this order:
1. Session window and elapsed span.
2. Problems solved. For each: a symptom title, the repository, the error text verbatim,
   an ordered list of what was tried, the specific fix, and a receipt for each part.
   Keep the failed attempts in. Do not compress them out.
3. Open problems, with how many sessions each has been open and what has been tried
   across all of them.
4. Decisions made, each with the alternative that was not taken. Mark whether the reason
   is quoted or inferred.
5. Work threads in start order, with time ranges labelled as span, not duration.
6. Repositories, files changed, files in view, tools used, as separate lists.
7. A changelog block in Keep a Changelog format, under an Unreleased heading, using only
   the categories Added, Changed, Deprecated, Removed, Fixed, Security. Imperative
   present-tense verb first. No entry for chores, CI, tests, or docs with no
   user-visible effect. Only include a line if the change was actually observed.
8. A coverage note: what was retrieved, every gap in capture with its length and
   position, and the line "Reconciliation: none, this routine has no repository access,
   so file-level claims rest on screen capture alone." Do not offer a coverage
   percentage.

If no development activity is found in the window, the entire report is one line naming
the window and the apps that did appear. Do not manufacture a log. Do not pad it with
meetings or browsing.

Label the report at the top: "Draft, unconfirmed. Open Cowork and run the
day-reconstructor skill to reconcile this against git, run the full redaction pass, and
write the file."
```

Replace `SESSION_START` and `SESSION_END` with the user's actual stated times before
calling the tool. Show the user the filled-in prompt and the schedule and get approval
before creating it.

**Updating it.** When the user's session boundary moves, call
`LB_INTERNAL_GET_ROUTINE_CONFIG` first, then `LB_INTERNAL_UPDATE_ROUTINE`. Both `prompt` and
`schedule` replace the whole field, so a partial update silently destroys the rest
(`references/littlebird-mcp-reference.md`).

**Notifications.** Enable push. The report is worth reading at session end while the session
is still in memory, which is exactly the recall interval the research says to shorten
[references/research/distilled-dev-logging.md section 6].

---

## Guardrail

The specific risk this skill carries is **a fabricated dev log made entirely of real
material**.

Every path in it exists. Every error message in it was on a screen. Every file name is
spelled correctly. And it says the user wrote code an assistant wrote, changed files they
only read, and solved a problem that was somebody else's pull request. That failure mode is
undetectable by inspection, it is persuasive precisely because the details are right, and it
is the default outcome of treating screen capture as an activity log.

Three defences, all mandatory:

1. **The tier split is visible in the artifact.** Files changed and files in view are
   separate lists with separate headings, and the second heading is deliberately too long to
   skim into the first.
2. **Reconciliation where possible, an explicit statement of its absence where not.**
3. **The coverage note ships on every artifact, including the good ones.**

A second, quieter risk: **the same document read as a productivity metric.** The published
warnings are direct. "lines of code per minute will not tell you which software developers
are the best software developers", developers do far more than write code, and developers
worry about measurement "being misinterpreted, particularly by managers who do not have
technical knowledge about inherent caveats"
[references/research/distilled-dev-logging.md section 8]. So every artifact carries this
line in its header:

```
This is a personal work record, reconstructed from screen capture for the person who did
the work. It is not a productivity measurement and it does not support one.
```

And no per-hour rate, no lines-changed count, and no commit count ships as a headline
figure.

**The draft-never-send law applies.** Nothing this skill produces is posted to a repository,
pushed as a commit message, sent to a colleague, or written into a third-party system
without the user approving the actual final text through `AskUserQuestion`. Approving the
plan is not approving the words. This skill does not touch the user's repository. It reads
git history for reconciliation and it writes a Markdown file in the working directory. It
does not commit, does not push, and does not edit `CHANGELOG.md`. It hands the user a block
to paste.

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## Related skills

| Skill | Relationship |
|---|---|
| `sop-forge` | Shares the session reconstruction problem and this skill reuses its solution by reference: `sop-forge/references/session-reconstruction.md` for sweep design and deduplication, `sop-forge/scripts/dedupe_snapshots.py` for the frame collapse and the structural secret scan, and `sop-forge/references/redaction-pass.md` for redaction in full. The difference in output: sop-forge produces a repeatable procedure for somebody else to follow. This one produces a record of what happened, for the person who did it. Run sop-forge when the session is worth teaching. Run this one every session. |
| `daily-brief` | Forward-looking. What is coming today. This skill is backward-looking. They pair: the brief opens the session, this closes it. |
| `commitment-tracker` | Picks up promises made in threads and calls. A decision recorded here that carries a commitment to someone else belongs there too. |
| `routine-architect` | Use it when the user wants the routine schedule, prompt, or escalation behaviour reworked beyond what this skill's own wiring section covers. |

---

## Reference map

| File | Load it when |
|---|---|
| `references/evidence-standards.md` | Always, first. |
| `references/littlebird-mcp-reference.md` | Always, first. |
| `references/session-boundaries.md` | Stage 1. Boundary definition, the gap rule, cross-midnight windows, thread grouping, continuity across sessions, the empty session. |
| `references/activity-attribution.md` | Stages 6 and 7. The evidence tiers, the per-signal rules, the AI-chat logic, the git reconciliation table, the metric hazard, and redaction by reference. |
| `references/problem-solved-extraction.md` | Stage 8. The error sweep, episode bounding, the three-part entry, unresolved problems, decisions. |
| `references/changelog-formats.md` | Stage 10. Session log structure, the Keep a Changelog block, the prose variant, the coverage note. |
| `references/research/distilled-dev-logging.md` | When you need the citation behind a rule, or want to check whether a claim is evidenced at all. |
| `references/research/README.md` | Source inventory and the archive's seven named gaps. |
| `sop-forge/references/redaction-pass.md` | Stage 5. Always. Not rebuilt here. |
| `sop-forge/scripts/dedupe_snapshots.py` | Stage 4, and again at stage 5 with `--scan-secrets`. Not rebuilt here. |

The last two rows are in the **`sop-forge` skill**, a sibling skill in this marketplace, and
their paths resolve from the skills directory rather than from inside this folder. If
`sop-forge` is not installed in the session, say so plainly at stage 4 and stage 5, do the
deduplication and the three redaction sweeps by hand following the descriptions in
`references/session-boundaries.md` section 5 and `references/activity-attribution.md`, and
note in the provenance block that the structural credential scan did not run. Do not skip
the redaction sweeps because the script is missing.

Three of this skill's core mechanisms are **not** evidenced by the research archive and are
labelled as design decisions rather than researched practice: session boundary definition
for a non-standard schedule, activity attribution, and problem-solution extraction from a
trace. See `references/research/distilled-dev-logging.md` section 9.
