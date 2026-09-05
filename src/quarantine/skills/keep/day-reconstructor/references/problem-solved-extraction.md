# Problem-solved extraction

The highest-value section of the artifact, and the one nobody writes down.

A problem entry has three parts: **the error that was hit, what was tried, what worked.**
All three are recoverable from capture. None of them is recoverable from a commit.

---

## Why this section carries the most weight

Both practitioner sources in the archive independently center the debugging record. The
instruction when stuck is "jot down everything you tried so far", and on resolution "jot
down the solution or logic that got you there"
[research/distilled-dev-logging.md section 7]. The practitioner account records "Problems I
ran into, and (hopefully) how I solved them" and reports actually going back for them:
"There's been several times I dug back into my notes and found the solution I'd written
down the last time" [research/distilled-dev-logging.md section 7].

So the retrieval event is real and documented, not hypothetical. And the reason the record
does not exist is also documented: the habit fails on setup cost and on the recurring
writing burden, not on disagreement about value
[research/distilled-dev-logging.md section 7]. Writing it costs 10 to 15 minutes a day in a
sustained practice [research/distilled-dev-logging.md section 7], and it is written at
exactly the moment the person least wants to write anything, which is right after they
finally fixed the thing.

**No archived source describes reconstructing a problem-solution pair from an activity trace
after the fact** [research/distilled-dev-logging.md section 9, gap 4]. The practice sources
say to write these by hand while it is happening. The extraction method below is a design
decision for this skill.

---

## Step 1: find the failures

Run a dedicated error sweep. Do not expect problems to fall out of the general activity
sweep, because a failing command is a few seconds of screen and a successful one looks
almost identical.

```
search_user_context(
  search_queries: [
    "error message stack trace exception",
    "command failed exit code non-zero",
    "test failure assertion failed",
    "build failed compilation error",
    "permission denied connection refused timeout",
    "warning deprecated cannot find module"
  ],
  standalone_query: "Every error, failure, exception, stack trace, and failed command
    during the work session on <date>, with enough surrounding output to identify what
    failed and in which repository.",
  date_range: {"start": "<session start>", "end": "<session end>"},
  filters: {"data_source": "snapshots"}
)
```

Six narrow queries rather than one broad one
(`littlebird-mcp-reference.md`, retrieval pattern 1). Run it as its own sweep with its
own budget. This is the sweep that earns the skill.

Sources of a failure signal, in descending quality:

| Source | Quality |
|---|---|
| A stack trace or error string in the terminal after a user-run command | Best. Carries the exact message and the command that produced it. |
| A non-zero exit code or a failure summary line from a test runner | Best. |
| A CI run page showing a failed job | Strong. Carries the job name and often the failing step. |
| An editor's problems panel or inline diagnostic | Strong. |
| A browser console error or a failed network request in devtools | Strong. |
| A search query in a browser containing an error string | Strong, and it tells you what the user thought the problem was. |
| An error described in the user's own message to an AI assistant | Strong. Often the clearest statement of the problem in the whole session. |
| An error mentioned in a message thread | Medium. Check the send time against the collection time, they differ (`littlebird-mcp-reference.md`). |

---

## Step 2: bound the episode

A problem episode runs from the **first appearance of the error** to the **last appearance
of that error or its successor**. Bound it before you try to read it.

The binding signal is the error string itself, or a distinctive fragment of it. An error
string reappearing is a strong signal of the same work thread
(`session-boundaries.md` section 5). Track it across apps: the same string will appear in
the terminal, then in a browser search box, then in a chat prompt, then in the terminal
again. That trail is the episode.

**Watch for the error changing.** The most common real shape of debugging is that fixing
error A reveals error B. That is one episode with a progression, not two episodes, and the
progression is the interesting part. Log it as a sequence.

**Watch for the episode not ending.** Not every problem gets solved. See step 5.

---

## Step 3: extract the three parts

### The error hit

Record it **verbatim as captured**, not paraphrased. The literal string is what makes the
entry findable in six months, which is the entire retrieval use case
[research/distilled-dev-logging.md section 7]. Trim a long stack trace to the message line
plus the first frame that is in the user's own code.

Alongside it record:

| Field | From |
|---|---|
| The command or action that produced it | The terminal line above it, or the CI step, or the user action in the preceding frame |
| The repository or project | The shell prompt, the editor window title, or the path in the trace |
| Timestamp | The collection time of the frame |

If the message is fragmentary because OCR cut it, record what was captured and mark the
remainder a gap. Do not complete it from knowledge of what that error usually says.

### What was tried

This is an **ordered list of attempts**, and the order is the value. Each attempt is an
action the user took after the error and before the next state.

Attempt sources, all of which are Strong-tier under `activity-attribution.md`:

- A command run in the terminal after the error appeared.
- A file edited between two occurrences of the error.
- A search query typed into a browser.
- A documentation or Stack Overflow page opened. The **exception** in the browser rules:
  a page opened immediately after an error, with the error text or a paraphrase in the page
  or the query, is a debugging step and belongs in the problem entry
  (`activity-attribution.md`, browser table).
- A question asked of an AI assistant, quoted from the user's own prompt.
- A configuration or setting changed in a console or dashboard.

For each attempt record what was done and what happened next. An attempt whose outcome is
not captured is recorded as attempted with an unknown outcome. Do not infer that it failed
because a later attempt exists, and do not infer that it worked because the error stopped
appearing in a window where nothing was captured at all.

**Do not compress the failed attempts out.** They are the part with the most value and the
part a person writing this by hand always drops, because by the time the thing works the
failed attempts feel embarrassing and irrelevant. They are neither. The next person to hit
this error, including the user in six months, needs to know which three obvious things do
not work.

### What worked

The resolution. Recorded with the same rigor as the error.

| Signal | Reading |
|---|---|
| The failing command run again with a zero exit or a success output | Strong. The last change before this is the fix. |
| A test suite going from failing to passing | Strong. |
| A CI run going green | Strong. |
| The error string simply stops appearing | **Weak.** Not a resolution. It could be a resolution, or the user could have moved on, or capture could have gapped. Say which one you can support. |
| The user saying it works, in a message or a chat prompt | Strong for the claim, and it is the user's own words. Quote it. |

**Name the fix, not just the outcome.** "Fixed" is worthless in six months. What is worth
keeping is the specific change: the flag that was added, the version that was pinned, the
config key that was wrong, the order of two calls that mattered. Take it from the diff
between the last failing state and the first passing one where capture supports it.

If the specific change is not recoverable, say that. `[GAP: the error stopped after this
point but the change that resolved it was not captured]` is an honest and still useful
entry, because it at least tells the reader where to look.

---

## Step 4: the entry format

One block per problem. Ordered by when the problem started.

```
### Auth refresh loop returning 401 on every retry
repo: littlebird-api   [Sunday, August 17, 2026 22:41 EDT | iterm2]

**Error**
    TokenRefreshError: refresh token rejected (401)
      at RefreshClient.rotate (src/auth/refresh.ts:88)
raised by: `npm run test:integration -- auth`

**Tried**
1. Re-ran the suite with a fresh token. Same 401.
   [Sunday, August 17, 2026 22:47 EDT | iterm2]
2. Searched "refresh token rejected 401 rotation race".
   [Sunday, August 17, 2026 22:53 EDT | chrome]
3. Added logging around the rotate call. Showed two refreshes firing 40ms apart.
   [Sunday, August 17, 2026 23:12 EDT | vscode]
4. Asked the assistant about concurrent refresh handling. Suggested a mutex.
   Not taken as written. [Sunday, August 17, 2026 23:20 EDT | claude]

**Resolved**
Single-flight guard on the refresh call, so concurrent callers await one rotation
instead of each starting their own. Integration suite green at 23:58.
   [Sunday, August 17, 2026 23:58 EDT | iterm2]

Confidence: High. Failure and success both observed, fix visible in the diff between
frames. Reconciled: commit a3f21c9.
```

Rules for the block:

- Every part carries a receipt in the canonical form
  (`evidence-standards.md` rule 1). The receipt is also a navigation aid: the user opens
  that timestamp in the Littlebird app to see the original screen. Say that once in the
  artifact's provenance block.
- Error text verbatim. Attempts in order. Resolution named specifically.
- Rate the entry: High, Medium, or Low (`evidence-standards.md` rule 3). High needs both
  the failure and the success observed. A single frame with an error and no resolution
  trail is Low.
- An attempt sourced from an AI chat is logged as an attempt and, where the user accepted
  or rejected the suggestion, also as a decision. See `activity-attribution.md`.
- Title the entry with the **symptom**, not the fix. The reader searching for it in six
  months will search for what broke, not for what fixed it.

---

## Step 5: unresolved problems

A problem with no observed resolution gets its own section, and it stays there across
sessions.

```
**Open problems**

- Flaky timeout in the webhook replay test. Seen 3 times this session, not resolved.
  Open since 2026-08-15 (3 sessions).
  Tried across all sessions: increased the timeout, ran it in isolation (passed),
  checked for a shared fixture (none found).
  [Sunday, August 17, 2026 01:14 EDT | iterm2]
```

Rules:

- Carry it forward. `session-boundaries.md` section 6 governs the continuity mechanics.
- Accumulate the attempts across sessions rather than restating one session's worth. The
  cross-session attempt list is the most valuable object this skill produces, because no
  human writes it.
- Apply the escalation rule: three consecutive sessions with the same problem open and the
  entry moves to the top of the artifact and states that the current approach is not
  converging (`session-boundaries.md` section 6).

An unresolved problem is a real finding. Do not quietly leave it out because the session
would read better without it.

---

## Step 6: decisions

Separate section, separate discipline. A decision is a choice with an alternative that was
not taken. If there was no alternative, it is not a decision, it is a step.

The decisions worth capturing are the ones that never became a commit message: a choice
made in an AI chat, an approach settled in a terminal after two experiments, a library
picked after reading three docs pages, a schema shape argued out in a message thread. Those
vanish completely from the repository record
[research/distilled-dev-logging.md section 3].

| Where a decision hides | How to read it |
|---|---|
| An AI chat where the user accepted a suggestion | The acceptance is the decision. Log it as the user's decision, never as the user's authorship (`activity-attribution.md`). Quote the reasoning if the chat carries it. |
| An AI chat where the user rejected or reworked a suggestion | Usually more informative than an acceptance. Log what was rejected and why, where stated. |
| Two approaches tried in the terminal, one kept | The kept one is the decision. The discarded one is the alternative. Both go in. |
| A dependency added, a version pinned, a flag set | A decision if an alternative is visible in the same window. Otherwise a step. |
| A meeting summary's Decisions section | Already owner-tagged (`littlebird-mcp-reference.md`). Take attribution from there, not from raw transcript. |
| A message thread where the user states a choice | The user's own words. Check send time against collection time, they differ. |

Entry shape:

```
- **Single-flight guard rather than a refresh mutex.** A mutex was suggested and not
  taken. The guard keeps the concurrent callers on one awaited rotation without adding
  a lock the rest of the client would have to respect.
  [Sunday, August 17, 2026 23:20 EDT | claude]
  Confidence: Medium. The choice is observed. The stated reason is reconstructed from
  the user's follow-up message and is an inference.
```

Mark the reasoning's tier explicitly. **The decision itself is often observed while the
reason for it is inferred**, and collapsing those two is how a dev log ends up asserting a
rationale the user never had (`evidence-standards.md` rule 2).

---

## Confirm before you encode

Read the problem list and the decision list back to the user with `AskUserQuestion` before
writing the artifact. These are the two sections that get pasted into a changelog, quoted in
a standup, and read back in a performance review, so they are durable fact about what
happened and they go through the encode gate (`evidence-standards.md` rule 6).

Confirm:

- Any problem rated Low.
- Any resolution inferred only from an error ceasing to appear.
- Any decision whose stated reason is inferred rather than quoted.
- Any problem the reconstruction thinks is unresolved, because the user may have fixed it
  offline.

Do not confirm every High-rated entry one by one. That is asking the user to write the log
themselves, which is the burden this skill exists to remove
[research/distilled-dev-logging.md section 7].
