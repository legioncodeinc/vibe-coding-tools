# Output formats

The three things this skill emits: the session log, the changelog block, and the coverage
note. Plus the plain-prose dev log variant.

Format rules here come from the two published changelog specifications. Where they
disagree, the disagreement is stated rather than smoothed
[research/distilled-dev-logging.md section 1].

---

## 1. The session log

The main artifact. One file per session, in the practitioner structure the archive
documents: a per-month folder, one dated Markdown file per session
[research/distilled-dev-logging.md section 7].

```
dev-log/2026-08 (August)/2026-08-17.md
```

Section order, and why each one is where it is:

| # | Section | Notes |
|---|---|---|
| 1 | Header | Session window, boundary convention, elapsed span. The "personal record, not a metric" line. |
| 2 | Security notice | Only if credentials were found on screen. Above everything, per `sop-forge/references/redaction-pass.md`. |
| 3 | In one line | What the session was about. Written last. |
| 4 | **Problems solved** | First substantive section, because it is the highest-value one [research/distilled-dev-logging.md section 7]. Format in `problem-solved-extraction.md` step 4. |
| 5 | **Open problems** | Carried forward with a session count. |
| 6 | **Decisions made** | Format in `problem-solved-extraction.md` step 6. |
| 7 | Work threads | Chronological, by start time. Time ranges labelled as span, not duration. |
| 8 | Repos, files, and tools touched | Split by evidence tier. See below. |
| 9 | Changelog block | Ready to paste. Section 2 of this guide. |
| 10 | Coverage note | Section 4 of this guide. Never omitted. |
| 11 | Provenance | Counts: items retrieved, values redacted, gaps, reconciliation status. |

Problems come before the timeline deliberately. A chronological narrative buries the thing
worth keeping in the middle of a list of window switches.

### The touched lists, split by tier

Never merge these. The split is the whole point
(`activity-attribution.md`, evidence tiers).

```
**Repositories**
- littlebird-api          (terminal prompt, 14 fragments)
- littlebird-skills       (terminal prompt, 3 fragments)

**Files changed**  (Confirmed against git unless marked)
- src/auth/refresh.ts             commit a3f21c9
- src/auth/refresh.test.ts        commit a3f21c9
- src/client/session.ts           changed, not committed as of session end

**Files in view, not established as changed**
- src/auth/index.ts
- node_modules/@octokit/auth-oauth-app/dist/index.js   (dependency source, read only)

**Tools and services**
- iterm2, vscode, chrome, claude, github.com, Neon console
```

The middle heading is deliberately long. "Files in view, not established as changed" cannot
be skimmed into "files changed", and a shorter heading can. A file open in an editor is not
evidence the user edited it (`activity-attribution.md`).

---

## 2. The changelog block

Ready to paste into `CHANGELOG.md`. Default format: **Keep a Changelog 1.1.0**.

### Why this format

Three reasons, from the archive [research/distilled-dev-logging.md section 1]:

1. Its six categories cover `Deprecated` and `Security`, both of which Semantic Versioning
   treats as consequential. SemVer's own FAQ requires a deprecation to ship and be
   documented in a minor release before removal in a major one
   [research/distilled-dev-logging.md section 1].
2. Its `Unreleased` section is the correct destination for a day of work that has not been
   released, which is the normal case for a daily reconstruction.
3. It is the format the user asked for.

The competing specification, Common Changelog, drops `Deprecated` and `Security` and removes
`Unreleased`, calling that workflow unproductive
[research/distilled-dev-logging.md section 1]. That reading is not adopted here, but its
**writing rules are stricter and better and nothing in Keep a Changelog contradicts them**,
so they are adopted inside the Keep a Changelog shape
[research/distilled-dev-logging.md section 1]:

- Imperative mood, present-tense verb first.
- Each entry self-describing, readable without its category heading. An entry under `Fixed`
  does not start with the word "Fix".
- References attached: commit, and ticket or PR where available.

### The categories

Exactly these six, in this order [research/distilled-dev-logging.md section 1]:

`Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

Omit any category with no entries. Do not invent a seventh.

### Mapping observed work to a category

The first two rows are the published mapping. The rest is this skill's, built by matching
the Conventional Commits type list against the Keep a Changelog category definitions
[research/distilled-dev-logging.md section 2].

| What was observed | Category |
|---|---|
| New capability that did not exist before | Added |
| Behaviour of something existing was altered; refactor or performance work with a visible effect | Changed |
| Something marked for future removal | Deprecated |
| Something taken out | Removed |
| A bug corrected. Every resolved problem entry is a candidate. | Fixed |
| Anything with a security consequence, including a dependency bump that closes a CVE | Security |
| Chores, CI, build config, tests, docs with no user-visible effect | **No entry at all** |

That last row is not optional. Keep a Changelog names selective inconsistency as a bad
practice, but it also names commit log diffs as one, specifically because merge commits and
documentation traffic are noise [research/distilled-dev-logging.md section 1]. A changelog
is for humans and a `chore(deps): bump eslint` line does not serve one.

### Version placement

Put the block under `## [Unreleased]` by default. Only place it under a version heading if a
release was actually observed in the session: a tag pushed, a publish command run, a release
created. Never invent a version number.

If a version bump is being suggested rather than observed, suggest it from the categories
present and say it is a suggestion
[research/distilled-dev-logging.md section 2]:

| Highest category present | Suggested bump |
|---|---|
| A breaking change | MAJOR |
| Added | MINOR |
| Fixed or Security only | PATCH |

### The block

```markdown
## [Unreleased]

### Added

- Single-flight guard on token refresh, so concurrent callers await one rotation.
  (a3f21c9)

### Fixed

- Token refresh returning 401 when two requests raced the rotation. (a3f21c9, #412)
```

Notes on that block:

- Present-tense imperative, verb first, no leading "Fix" under `Fixed`.
- Commit references attached, per Common Changelog's reference rule
  [research/distilled-dev-logging.md section 1].
- Dates use ISO 8601 `YYYY-MM-DD` wherever a date appears, because regional formats are
  ambiguous [research/distilled-dev-logging.md section 1].
- **Every entry in the block traces to a Confirmed or Strong observation.** If a change
  cannot be traced, it does not get a line. A changelog is the authoritative record of what
  changed [research/distilled-dev-logging.md section 1], and a fabricated line in it
  outlives every other mistake this skill could make.

### Conventional Commits variant

If the user's repository uses Conventional Commits, also emit suggested commit messages for
any uncommitted work, using the spec grammar
[research/distilled-dev-logging.md section 2]:

```
type[optional scope]: description
```

with `feat` for a new feature, `fix` for a bug fix, `!` before the colon or an uppercase
`BREAKING CHANGE:` footer for a breaking change, and a scope that is "a noun describing a
section of the codebase surrounded by parenthesis"
[research/distilled-dev-logging.md section 2].

Only offer this when Conventional Commits usage is **observed** in the repository's existing
history through the git reconciliation. Do not impose a convention on a repo that does not
use one.

---

## 3. The plain-prose dev log

Same content, written as prose rather than as sections. For pasting into a standup, a
weekly update, a client note, or a personal journal.

Rules:

- Past tense, first person, the user's voice. If a personal voice skill is installed in the
  session, use it. If none is installed, say so plainly and point at this marketplace's
  voice creator skills. Never invent a voice profile.
- Lead with the problem that took the longest, not with the chronology.
- Name the specific fix. "Sorted out the auth thing" is worthless in six months.
- Keep the failed attempts in. One sentence each is enough.
- No receipts inline. They live in the session log, and this variant links back to it.
- Length: aim for what fits in a standup, roughly 120 to 200 words for an ordinary session.

Shape:

> Spent most of the night on a 401 loop in the token refresh path. Two requests were racing
> the rotation, so the second one presented a token the first had already invalidated. Took
> a while to see because the integration suite only failed under parallel run. Tried a fresh
> token, then added logging around the rotate call, which showed two refreshes 40ms apart.
> Ended up with a single-flight guard so concurrent callers await one rotation, rather than
> the mutex that was suggested, which would have made the whole client lock-aware for one
> call site. Suite green. Also picked up a flaky timeout in the webhook replay test that is
> still open, third session running.

---

## 4. The coverage note

**Never omitted, in every artifact, including the good ones.** This is the section that
keeps the skill honest, and it is the section a reader needs in order to know what the rest
of the document is worth.

The reason it exists, with the number attached: instrumented measurement across 78
developers and 3,148 working hours put **comprehension at 57.62% of monitored time and
editing at 5.02%**, with more comprehension time spent in a browser than in an IDE
[research/distilled-dev-logging.md section 4]. A session is mostly reading, searching, and
thinking. Screen capture sees some of that and none of what happens away from the screen.

Say what is covered, what is not, and what would change the answer:

```
**Coverage**

This log is reconstructed from screen capture and reconciled against git. It covers what
was on screen, which is not the same as what the session consisted of.

- Retrieved: 214 snapshots across 9h 33m, grouped into 41 distinct states and 6 work
  threads. Longest capture gap: 38 minutes (02:14 to 02:52).
- Reconciled: 2 commits found in the window, both matched to observed work. No commit
  went unobserved.
- Not covered: reading and thinking away from the keyboard, work in an app Littlebird was
  not capturing, and anything during the 38 minute gap. Instrumented studies put code
  editing at around 5% of developer time and comprehension at around 58%, so the files
  list is the smallest part of this session by a wide margin.
- Attribution: 3 files are listed as changed and are confirmed by commit. 7 more were in
  view and are not claimed as changed.
- Confidence: 4 problem entries rated High, 1 Medium, 0 Low. 2 decisions carry inferred
  reasoning and are marked.
```

Rules for the note:

- **Report gaps in capture with their length and position.** A 38 minute hole at 02:14 is a
  fact the reader can act on. "Coverage was good" is not.
- **Never convert an absence into a negative finding.** "No commits observed in this window"
  and "no commits were made" are different claims and only the first is supportable
  (`evidence-standards.md` rule 2).
- **State the reconciliation status in one line**, including the case where there is none:
  "No repository access in this session, so file-level claims rest on screen capture alone."
  (`activity-attribution.md`, degrade gracefully).
- **Do not offer a coverage percentage.** The archive supports no basis for computing one,
  and a fabricated percentage is worse than a described gap
  [research/distilled-dev-logging.md section 9].

---

## 5. The metric-hazard header

One line, at the top of every artifact
[research/distilled-dev-logging.md section 8]:

```
This is a personal work record, reconstructed from screen capture for the person who did
the work. It is not a productivity measurement and it does not support one.
```

The published warnings are specific: commit and line counts misrepresent developer work,
developers do far more than write code, and developers worry about measurement being
misread by managers without the context to see the caveats
[research/distilled-dev-logging.md section 8]. The same document read as an individual
performance metric becomes exactly the thing those sources warn against.

Do not report lines changed, commits per hour, or any per-hour rate as a headline figure.
Time ranges on work threads are labelled span, not duration, because logged measurement puts
developers in an individual activity for 0.3 to 2.0 minutes before switching
[research/distilled-dev-logging.md section 5].

---

## 6. The empty session artifact

One line. The full rules are in `session-boundaries.md` section 7.

```
2026-08-17: no development activity found in the 20:00 to 08:00 window. Captured apps
were chrome, slack, and zoom. No terminal, editor, or repository activity observed.
```

No header, no coverage note, no changelog block, no manufactured threads. A one-line honest
report is the correct artifact for a day with nothing in it, and producing anything longer
teaches the user that the log is padded, which is the point at which they stop reading it.
