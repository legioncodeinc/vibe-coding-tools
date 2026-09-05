# Activity attribution

The rules that decide whether something on the screen becomes a line in the user's dev log.

This is the guide that keeps the skill honest. Everything else is formatting.

---

## The problem, stated exactly

Littlebird screen capture records what was **on screen**. During a development session that
includes, in roughly descending order of volume:

- Code the user was reading, in their own repo and in other people's.
- Code an AI assistant wrote, displayed in a chat panel or an inline suggestion.
- Documentation, API references, and release notes.
- Other people's pull requests, in review.
- Stack Overflow answers, GitHub issues, and blog posts.
- Terminal output, most of which the machine wrote.
- And, somewhere in there, the code the user actually changed.

Screen OCR captures what the user was VIEWING, not what they WROTE
(`littlebird-mcp-reference.md`, known limitations;
`evidence-standards.md` rule 4). Attributing the whole of that list to the user as work
they did produces a fabricated dev log. It is fabricated in a specific and dangerous way:
every path in it is real, every error message in it is real, and it is still wrong.

The empirical case that this is the normal situation rather than an edge case: instrumented
measurement across 78 developers and 3,148 working hours put **comprehension at 57.62% of
time and editing at 5.02%**, with more comprehension time spent in a web browser (27.26% of
total time) than in an IDE (19.95%) [research/distilled-dev-logging.md section 4]. The
default assumption for any given captured frame should therefore be that the user was
reading, not writing.

**No archived source covers attributing screen content to a user versus to an AI assistant
or to read-only material** [research/distilled-dev-logging.md section 9, gap 3]. The ruleset
below is a design decision for this skill, built on the Littlebird capture semantics in
`littlebird-mcp-reference.md` and the attribution guardrail in
`evidence-standards.md` rule 4. It is not researched practice and does not claim to be.

---

## The evidence tiers

Every observation lands in exactly one tier. The tier determines what the log is allowed to
say.

| Tier | What it means | What the log may say |
|---|---|---|
| **Confirmed** | Reconciled against a repository or a connector. The commit exists, the file is in its diff. | Plain statement of fact, with the commit SHA. |
| **Strong** | An action the user demonstrably initiated, captured with its result. | Plain statement, with a receipt. |
| **Weak** | The user's attention was here. What they did with it is not established. | Reported as attention, never as authorship. Phrase it as "worked in" or "reviewed", never "changed". |
| **Not evidence** | Content was on screen. Nothing follows about the user at all. | Excluded from the log entirely, unless it is the subject of a problem or a decision. |

---

## The rules, by signal

### Editor and IDE

| Signal | Tier | Rule |
|---|---|---|
| A file is open in an editor tab | **Weak** | **A file open in an editor is not evidence the user edited it.** This is the single most common way a capture-derived log goes wrong. Report it as a file the user had open, in a "files in view" list, not in a "files changed" list. |
| The same file open across many fragments spanning a long span | **Weak** | Still weak. Sustained attention, not authorship. It raises priority for the git reconciliation, not the tier. |
| An editor's modified-file indicator is visible (a dot on the tab, a colour in the gutter, a dirty marker in the status bar) | **Strong** | The editor is asserting unsaved changes exist. Report the file as edited. |
| A source control panel showing the file under Changes, Staged, or Modified | **Strong** | The tool is reporting a diff. Name the file as changed. |
| A diff view or a merge conflict resolution UI | **Strong** for the file, **Weak** for the content | The user was resolving. What they chose is not readable from the fact of the view. |
| Two frames of the same file with visibly different content in the same region | **Strong** | The text changed between frames while the user was there. That is an edit. |
| A file open in a read-only or preview mode, or in a `node_modules` or vendored path | **Not evidence** | Excluded. |

### Terminal

The terminal is the highest-quality signal in the whole capture, and the reason is worth
stating: a command sitting after the user's shell prompt was typed or invoked by the user,
and its output is the machine's honest response.

| Signal | Tier | Rule |
|---|---|---|
| A command on a line following the user's prompt | **Strong** | The user ran it. Record the command verbatim, and the working directory from the prompt if the prompt carries it. |
| The command's output or exit status in the following frame | **Strong** | Record the result. A non-zero exit or an error string is the start of a problem entry. See `problem-solved-extraction.md`. |
| A `git` command: `commit`, `push`, `checkout`, `rebase`, `merge` | **Strong**, and promotable | Record it. Then reconcile it, which promotes it to **Confirmed**. |
| Repository name or branch name in the prompt | **Strong** | This is how the repos-touched list is built. A prompt that shows the repo is a better source than a window title. |
| Scrollback that predates the session window | **Not evidence** | Old output visible in a scrolled buffer is not this session. Check the timestamps in the output itself where they exist. |
| A command inside a `less`, `man`, or docs pager | **Weak** | Reading. |

### AI assistant chat and inline suggestion

This is the category the user's instructions single out, and it needs its own logic, because
the naive readings are both wrong. Treating AI-written code as the user's work fabricates
authorship. Treating it as nothing loses the most consequential thing in the session.

The resolution: **an AI assistant's output is not the user's authorship, and the user's
handling of it is the user's decision.** Log the decision, not the authorship.

| Signal | Tier | Rule |
|---|---|---|
| An assistant's response visible in a chat panel | **Not evidence** of user work | Do not attribute the content to the user. Do not list files it mentions as files the user touched. |
| The user's own prompt or message to the assistant | **Strong** | This is the user's words and it states intent. It is often the clearest statement of what the user was trying to do all session. Use it to name the work thread. |
| An assistant suggestion followed by the suggested code appearing in an editor file | **Strong**, as a **decision** | The user accepted it. Log it under Decisions as "accepted the suggested approach for X", with the reasoning if the chat carries it. If the change is later confirmed in a commit, the file-level claim promotes to **Confirmed**. |
| An assistant suggestion followed by different code appearing, or by the user restating the problem | **Strong**, as a **decision** | The user rejected or reworked it. This is a real decision and it is usually more informative than an acceptance. Log what was rejected and, where the chat says it, why. |
| An assistant suggestion with no visible follow-through | **Weak** | The user read a suggestion. Nothing more is established. Do not log an outcome. |
| An assistant's own claims about what it did to the codebase | **Not evidence** | An assistant saying it edited a file is not observation that a file was edited. Reconcile it or drop it. This applies with full force to any assistant transcript in the capture. |

### Browser

| Signal | Tier | Rule |
|---|---|---|
| Documentation, Stack Overflow, a blog post, an issue thread | **Not evidence** of work done | These are reading. They are excluded from the work log, **with one exception below**. |
| A page open immediately after an error appeared in the terminal, with the error text or a paraphrase in the page or the search query | **Strong**, as part of a **problem** | This is a debugging step and it belongs in the problem entry. The search query is often the single best statement of what the user thought the problem was. |
| Another person's pull request, in a review UI | **Weak** | The user reviewed it. That is real work and it goes in the log as review, named as review. It never contributes a file to the files-changed list. |
| The user's own pull request page | **Weak** for content, **Strong** for its existence and state | Record the PR number and its state. Do not read the diff as the user's edits for that session. |
| A CI run page showing a failure | **Strong** | The failure is real and observed. It is a problem entry. |
| A cloud console, dashboard, or admin UI where the user changed a setting | **Strong** if a save, apply, or confirm action is captured; **Weak** otherwise | Configuration work is real work and is routinely absent from git entirely. Do not lose it. |

### Meetings, calls, and screen shares

| Signal | Tier | Rule |
|---|---|---|
| A meeting's Decisions section | **Strong** | Decisions in a meeting summary are already tagged with who decided (`littlebird-mcp-reference.md`). Take attribution from there. |
| A meeting's Action Items section | **Strong** | Already owner-tagged. |
| A raw transcript chunk tagged `[Others]` | **Not evidence** of who | Proves someone said it, not who (`evidence-standards.md` rule 4). Quote for wording only. |
| A screen share | **Not evidence** of the user's work | It is someone else's computer. Nothing on it is the user's activity. State whose screen it was, or state that it is unknown. |

---

## Three rules that override everything above

**1. Never invent a file path.** If the capture reads `src/auth/refre` because the tab was
truncated, the log writes what was captured and marks it a gap. It does not write
`src/auth/refresh.ts` because that is obviously what it says. A fabricated path in a dev log
gets pasted into a search box six months later and wastes an afternoon.

Use `[GAP: partial path, captured as "src/auth/refre"]`. Never use the same marker for a
gap and for a redaction. A reader who confuses the two goes looking for a secret in a
screenshot.

**2. Never invent a commit.** A commit is either reconciled against a repository or it is
not in the log as a commit. Not a SHA, not a message, not a count. If the terminal shows
`git commit -m "fix auth refresh"` and no repository is reachable, the log says the user ran
a commit command with that message, with a receipt, and does not assert that a commit
object exists with that content.

**3. Attribution is guilty until proven innocent.** When in doubt, drop it or ask
(`evidence-standards.md` rule 4). The cost of dropping a real item is that the user adds
it back in ten seconds. The cost of adding a fake one is that the log stops being worth
reading.

---

## Reconciling against git

This is the step that converts inference into observation for every file-level claim, and it
is worth doing whenever it is possible.

### First, list the tools you actually have

Do not assume a connector exists. **List the tools available in this session** and look for:

- A GitHub or GitLab MCP connector, which can list commits and read a commit's file list.
- Filesystem or shell access to a local clone, in which case the git history is directly
  readable.
- Nothing, which is a normal and expected case.

Use the real tool names you find. The tool inventory in `littlebird-mcp-reference.md` is
verified as of 2026-08-17 and covers Littlebird only. Git access is a separate connector and
is not part of Littlebird.

### What to reconcile

For each repository named in the reconstruction, over the session window and the few hours
after it, retrieve the commits authored by the user. Then:

| Reconstruction said | Git says | Result |
|---|---|---|
| File edited (Strong, from an editor dirty marker) | File in a commit diff | **Confirmed.** Log the file with the commit SHA. |
| File edited (Strong) | Not in any commit | Still **Strong**, and now interesting. Uncommitted work is real work. Say so: "changed, not committed as of the end of the session." |
| File in view (Weak) | File in a commit diff | **Confirmed.** Promote it. This is the main thing reconciliation buys. |
| File in view (Weak) | Not in any commit | Stays **Weak**. Stays out of the files-changed list. |
| Nothing observed | A commit exists in the window | **Confirmed**, and a coverage finding. The session did something the capture missed. Include the commit and note the miss in the coverage note. |
| A commit command observed in the terminal | No matching commit | Report the discrepancy. Do not resolve it by guessing. It usually means a failed commit, an amend, or a different branch. |

### Degrade gracefully

If no git access exists, the skill still runs. It produces the same artifact with every
file-level claim capped at **Strong** instead of **Confirmed**, and the coverage note says
so in one line:

```
Reconciliation: none. No repository access in this session, so file-level claims rest on
screen capture alone and were not checked against commit history.
```

Then offer, once, to reconcile later if the user connects a repo. Do not nag.

### The commit is a floor, not a ceiling

Reconciliation confirms what landed. It says nothing about what the session was actually
spent on, because editing is a single-digit percentage of a developer's time
[research/distilled-dev-logging.md section 4], and a commit-driven generator's coverage is
exactly the set of commits and nothing else
[research/distilled-dev-logging.md section 3]. Never let the commit list become the log.
The problems and the decisions are the part that git cannot produce, and they are the part
worth keeping.

---

## The metric hazard

State this in the artifact, once, in its header. The published warnings are direct: "lines
of code per minute will not tell you which software developers are the best software
developers", developers do far more than write code, and developers are rightly worried
about measurement "being misinterpreted, particularly by managers who do not have technical
knowledge about inherent caveats" [research/distilled-dev-logging.md section 8].

Consequences for this skill:

- The artifact is a personal record for the person who did the work. Say so in the header.
- Do not report lines changed, commits per hour, or any per-hour rate as a headline figure.
  Activity counts are confounded and more commits can reflect worse systems rather than more
  value [research/distilled-dev-logging.md section 8].
- Time ranges on work threads are labelled as **span, not duration**, because the user was
  demonstrably doing other things inside them: logged measurement puts developers in an
  individual activity for 0.3 to 2.0 minutes before switching
  [research/distilled-dev-logging.md section 5].

---

## Redaction runs before anything is written

Terminal and editor capture is dense with credentials. An API key in a `.env` file open in a
tab, a token echoed by a failing curl, a connection string in a database client, a signing
secret pasted into a config, a bearer header in a request log. This is not an edge case, it
is what the terminal looks like.

**Do not rebuild a redaction pass here. Run sop-forge's, by reference.**

1. Read `sop-forge/references/redaction-pass.md` and follow it. Its category table, its
   three-sweep structure, its placeholder rule, and its rotation flag all apply unchanged.
2. Run the structural scan: `sop-forge/scripts/dedupe_snapshots.py` with `--scan-secrets`
   over the timestamp-sorted timeline. It reports pattern name and position and never prints
   a matched value.
3. Then run the semantic and context sweeps by hand, because a client name is an ordinary
   word and no pattern finds it.

Two differences in how this skill applies it:

- **The placeholder test is different.** sop-forge's test is that the step stays followable.
  Here the test is that the log entry stays **searchable**: the reader must be able to find
  this problem again in six months. `[YOUR_STRIPE_SECRET_KEY]` in the entry, and the field
  name and the error class kept intact, so the error is still findable.
- **The rotation flag still applies in full.** Anything matching an authentication pattern
  was on screen, which is exposure. The artifact carries a security notice naming the field
  and the entry, never the value, and telling the user to rotate.

Raw capture never ships (`evidence-standards.md` rule 7). Delete the working timeline
once the artifact is written.
