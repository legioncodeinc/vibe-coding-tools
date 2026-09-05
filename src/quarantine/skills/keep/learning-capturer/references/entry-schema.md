# Entry schema

The fixed shape of one knowledge base entry. Every entry has every field. A field with
nothing in it says so explicitly rather than being dropped, because a missing field and an
empty field mean different things to a reader six months out.

The section order follows the published troubleshooting-article structure: title naming the
symptom, symptom description, cause where known, resolution, escalation, related articles
[research/distilled-personal-knowledge-capture.md section 3]. The additions here are the
occurrence log, the negative results, the time bound, and the version block, each justified
below.

Keep it a knowledge base entry, not a runbook. "A knowledge base helps people find,
understand, and reuse information. A runbook tells someone exactly how to perform a known
operational task" [research/distilled-personal-knowledge-capture.md section 3]. Do not pad
an entry with prerequisites, rollback paths, and escalation criteria it will never use.

---

## The template

Copy this exactly. Field names are load-bearing: `kb_index.py` parses them, and grep
patterns in `kb-structure-and-dedupe.md` depend on them.

```markdown
# <Symptom-phrased title>

    id: <YYYY-MM-DD>--<kebab-slug>
    first-seen: <YYYY-MM-DD>
    last-seen: <YYYY-MM-DD>
    occurrences: <n>
    solved-by: self | other | ai-assistant | unresolved
    understood: yes | partial | no | n/a
    root-cause-status: established | empirical | unknown
    confidence: High | Medium | Low
    tags: <tag>, <tag>, <tag>
    review-after: <YYYY-MM-DD>
    last-confirmed: <YYYY-MM-DD> | never

## Symptom

SEARCH: <the literal error text, one line, exactly as it appeared>

<One or two sentences describing what was observed, in concrete terms.>

```
<the fuller error output or failure state, verbatim, scrubbed>
```

Also searched as: <the query the user actually typed, if capture showed it>

## Context

| Field | Value |
|---|---|
| Stack | <language, framework, runtime> |
| Versions | <exact pinned versions of everything in the failure path> |
| Environment | <local / staging / production / CI, OS, container> |
| Project | <repo or product, kept generic if the entry may be shared> |

## Root cause

<The mechanism, if it was established. Or the honest marker below.>

## The fix

<Numbered steps, with the actual commands, config, or code.>

```
<verbatim command or diff, scrubbed>
```

Expected outcome: <what you should see when it worked>

## What did not work

1. <Thing tried> - <why it seemed plausible> - <what happened instead>
2. ...

## Time cost

<Bounded range, snapshot count, window.>

## Occurrences

| Date | Receipt | Note |
|---|---|---|
| YYYY-MM-DD | [receipt, pipes escaped] | first encounter |

## Provenance

Source: <receipts>
Redaction: <count and categories, or "none found">
Drafted: <YYYY-MM-DD> from the weekly sweep | on demand
Confirmed by user: <YYYY-MM-DD>

## Related

- <link to another entry id, or "none">
```

---

## Field by field

### Title and Symptom, which carry the whole retrieval story

This is the field that decides whether the entry is ever found again, and it is the field
with the strongest evidence behind it in the archive. Two independent sources in different
domains reach the same rule [research/distilled-personal-knowledge-capture.md section 2].

The knowledge base literature states it directly: "Use the reader's language. Titles and
symptom descriptions should use the exact error message text, the exact UI phrase, or the
exact phrasing readers use in support tickets"
[research/distilled-personal-knowledge-capture.md section 3]. The personal knowledge
management practitioner reaches it from the other side, having repaired a failing base by
switching from grouping by topic to asking "in what context might I refer to this note in
the future?" [research/distilled-personal-knowledge-capture.md section 2].

Rules that follow:

1. **The `SEARCH:` line holds the literal error string on one line, verbatim.** Not
   paraphrased, not truncated, not prettified. This is the grep target. If the error text
   is 200 characters, the line is 200 characters.
2. **Title names the symptom, not the cause and not the fix.** The published title pattern
   is exactly this, with worked examples such as "Import fails with 'Invalid file format'
   error" [research/distilled-personal-knowledge-capture.md section 3]. So:
   - Good: `Prisma migrate deploy fails with P3009 on Neon after branch reset`
   - Bad: `Neon branch resets orphan the migration table` (that is the cause)
   - Bad: `How I fixed the migration thing` (that is neither)
3. **Include the identifier fragments a person would actually type.** Error codes, exit
   codes, HTTP statuses, exception class names, the failing package name. These are what
   gets typed into a search box, and error messages are among the most frequent things
   developers search for [research/distilled-personal-knowledge-capture.md section 1].
4. **Preserve capture's version of the string, and note any repair.** OCR corrupts. If you
   corrected `ECONNREFU5ED` to `ECONNREFUSED`, the corrected form goes in `SEARCH:` and the
   captured form goes in the fenced block with a note. Repairs are inferences
   (`evidence-standards.md` rule 2).
5. **Where there was no error text, write the observable.** Symptom descriptions should use
   "concrete, observable terms": what the reader sees, the specific error message, or the
   missing result [research/distilled-personal-knowledge-capture.md section 3]. So:
   `Build hangs at "Collecting page data" and never completes`, not `Next.js build problem`.
6. **`Also searched as:`** carries the query the user actually typed, when capture showed
   it. It is often a better retrieval key than the error itself, because it is the phrasing
   their own brain produced under pressure.

### Context

The version block exists because staleness is measured and it is the biggest long-run
threat to this artifact. The study authors' explicit recommendation to answer writers is to
**include version and time information** [research/distilled-personal-knowledge-capture.md
section 5]. Third-party libraries (31.7%) and programming languages (30.9%) together account
for roughly 63% of obsolescence [research/distilled-personal-knowledge-capture.md
section 5], so those two rows are the ones that must be exact.

Pin real versions, not ranges. `next 15.4.2, node 22.11.0, prisma 6.2.1`, not "latest Next".
If capture did not show a version, write `unknown, not captured` rather than guessing. See
`staleness-and-versions.md`.

### Root cause, kept separate from Symptom

Impact, actions taken, and root cause are three distinct fields in postmortem practice, not
one narrative [research/distilled-personal-knowledge-capture.md section 4]. The separation
is what lets a reader match on symptom and then decide whether their situation has the same
cause.

`root-cause-status` takes one of three values and the prose matches:

| Value | Prose form |
|---|---|
| `established` | The mechanism, stated plainly, with what evidence established it. |
| `empirical` | `Not established. The fix below works; the mechanism was never confirmed. Reproduced <n> times.` |
| `unknown` | `Not established, and the fix may be coincidental. See What did not work.` |

**Never invent a cause to fill this field.** The published template includes cause "where
known" and omits it if unknown [research/distilled-personal-knowledge-capture.md section 3],
which is explicit permission to leave it empty. A guessed cause is worse than an admitted
gap, because a reader will use it to decide whether the entry applies to them.

The AI-assisted case lands here by default: a fix accepted without understanding almost
always has `root-cause-status: empirical` or `unknown`. See `solve-detection.md` section 4.

### The fix

The actual commands, config, or code. Not a description of them.

- Verbatim, in a fenced block, after scrubbing.
- Numbered when order matters.
- Order alternatives by likelihood, most common first
  [research/distilled-personal-knowledge-capture.md section 3].
- End with an explicit expected outcome
  [research/distilled-personal-knowledge-capture.md section 3]. This is what tells a future
  reader whether the fix took.
- Flag anything irreversible or risky
  [research/distilled-personal-knowledge-capture.md section 3].

**The placeholder trap.** One of the eight named failure modes of operational documentation
is commands that require manual variable substitution with no guidance on what to substitute
[research/distilled-personal-knowledge-capture.md section 3]. That is the redaction problem
restated as a usability problem, and it is why this skill uses typed placeholders rather
than blanket markers. `[YOUR_DATABASE_URL, from Neon dashboard, Connection Details]`, never
`[REDACTED]`. See `secret-scrubbing.md`.

### What did not work

Nearly as valuable as the fix and always thrown away, which is the reason it is a mandatory
field here.

Each line has three parts: what was tried, why it looked right, and what actually happened.
The middle part is the one that saves time, because next time the same wrong idea will look
just as right.

```
1. Bumped the adapter to 3.4.0 - release notes mentioned a pool fix - same error, and
   3.4.0 broke the typegen so it had to be reverted
2. Set connection_limit=1 - matched every forum answer for this error string - no change
3. Cleared .next and node_modules - standard reflex - no change, cost 6 minutes
```

Write `Nothing recorded. Capture did not show the failed attempts.` when the Grind phase was
not legible. Do not leave the heading with an empty body.

Blameless tone applies here specifically. A blameless record focuses on contributing causes
"without indicting any individual" and assumes everyone "did the right thing with the
information they had" [research/distilled-personal-knowledge-capture.md section 4]. The
individual here is the user reading their own file. Write "this looked right because the
release notes said so", not "wasted an hour on the obvious wrong thing".

### Time cost

Bounded range, snapshot count, window. Method and the refusal case are in
`solve-detection.md` section 6. Never a single number.

### Occurrences

The dedupe payoff. Each row is a date, a receipt, and a note on what was different that
time. A second encounter updates this table rather than creating a second entry, and the
row count drives the escalation rule in `kb-structure-and-dedupe.md` section 5.

### Provenance

Receipts in the canonical form `[Tuesday, August 11, 2026 23:40 EDT | chrome]`
(`evidence-standards.md` rule 1). In this skill the receipt is also a navigation aid: the
user opens that timestamp in the Littlebird app to see the original screen.

The redaction line states a count and the categories, never a value. A reader needs to be
able to tell a deliberate removal from a gap in the reconstruction, and conflating them is
how someone ends up hunting for a secret in a screenshot. See `secret-scrubbing.md`.

`Confirmed by user` is not decorative. Nothing gets appended without it, and an entry
missing that date should not be in `entries/`.

---

## Worked example

```markdown
# Vercel build fails with "Module not found: Can't resolve 'fs'" after adding a parser dep

    id: 2026-07-09--vercel-edge-fs-module-not-found
    first-seen: 2026-07-09
    last-seen: 2026-08-14
    occurrences: 3
    solved-by: self
    understood: yes
    root-cause-status: established
    confidence: High
    tags: vercel, nextjs, edge-runtime, bundling, build-failure
    review-after: 2027-01-09
    last-confirmed: 2026-08-14

## Symptom

SEARCH: Module not found: Can't resolve 'fs'

Vercel build fails at the compile step immediately after a new dependency is added. Builds
fine locally with `next build`. Only fails on Vercel.

```
./node_modules/<pkg>/lib/load.js
Module not found: Can't resolve 'fs'
Import trace for requested module: ./app/api/parse/route.ts
```

Also searched as: nextjs can't resolve fs vercel but works locally

## Context

| Field | Value |
|---|---|
| Stack | Next.js App Router, TypeScript, Node |
| Versions | next 15.4.2, node 22.11.0, the parser dep at 4.1.0 |
| Environment | Vercel build, local build on macOS 15.5 |
| Project | internal API service |

## Root cause

The route had `export const runtime = 'edge'`. The Edge runtime has no Node built-ins, so
any transitive dependency that reaches `fs` fails to bundle. Local `next build` did not
reproduce it because the local dev server ran the route on Node.

## The fix

1. Remove the Edge runtime export from the route, or move the parsing call out of it.

```
- export const runtime = 'edge';
+ export const runtime = 'nodejs';
```

Expected outcome: build completes, and the route logs show the Node runtime rather than
Edge.

## What did not work

1. Adding a webpack `resolve.fallback` for `fs` - every forum answer for this string says
   so - build passed, route threw at request time instead, which was worse
2. Downgrading the parser dep to 3.x - assumed a regression - same error, 3.x also reaches
   `fs`
3. Clearing the Vercel build cache - standard reflex - no change, cost about 4 minutes

## Time cost

Between 40 minutes and 1h25m (11 snapshots, 2026-07-09 15:05 to 16:30 EDT)

## Occurrences

| Date | Receipt | Note |
|---|---|---|
| 2026-07-09 | [Wednesday, July 9, 2026 15:05 EDT \| chrome] | first encounter |
| 2026-07-28 | [Monday, July 28, 2026 11:12 EDT \| chrome] | different repo, same cause |
| 2026-08-14 | [Thursday, August 14, 2026 09:40 EDT \| chrome] | third time, see escalation note |

## Provenance

Source: [Wednesday, July 9, 2026 15:05 EDT | chrome], [Wednesday, July 9, 2026 16:30 EDT | chrome]
Redaction: 1 value redacted (1 account and tenant identifier). No credentials found.
Drafted: 2026-08-15 from the weekly sweep
Confirmed by user: 2026-08-15

## Related

- 2026-05-02--vercel-edge-runtime-crypto-unavailable
```

Note the package name is written as a placeholder in the trace block. That is a scrubbing
decision made because the entry names a third-party dependency alongside an internal project
identifier; the real entry would keep the package name and redact the project. Decide per
entry, and record the decision in the redaction line.
