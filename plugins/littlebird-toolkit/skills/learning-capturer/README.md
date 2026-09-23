# learning-capturer

Stops you re-debugging the same wall, by filing each fix into a personal knowledge base keyed on the error text you will search for.

## What it does

You lost ninety minutes to an error in March. It returns in August and you start from zero, because the fix lived in a scrollback that closed long ago.

Littlebird watched the first fight. This skill reads that capture, finds where something broke and then stopped being broken, and writes it up: the symptom phrased the way you will search for it, the versions, the root cause, the fix, what did not work.

That last field is the difference. What you tried and abandoned is nearly as useful as the fix and is what every write-up throws away. So is the AI-assisted solve, where you accepted a suggestion, it worked, and no memory formed. That is its own entry type.

## When to use it

- A session hurt and you want the lesson before you forget it.
- You have a feeling you have seen this exact error before.

Just ask for it. Trigger phrases include "capture what I learned", "log this fix", "add that to my knowledge base", "what did I figure out this week", "I have solved this before" and "stop re-debugging this".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Routine | Weekly, Friday 16:30 local | Proposes candidates with a classification and a confidence. Writes nothing |
| On demand | After a session that hurt | The same pipeline over a window you name, through to entries |

Run the weekly sweep. Friday afternoon means the week is done and the report waits on Monday. The routine only proposes: nothing reaches your base until you approve that specific entry. The skill creates the routine itself, showing you the prompt and schedule first.

## What you get

A flat, greppable `knowledge-base/` directory: one file per entry, a generated `INDEX.md`, an `open-walls.md` for abandoned problems, a rejection ledger. Every entry opens with the line you will grep for:

```
SEARCH: Error: connect ECONNREFUSED postgres://[USER]:[PASSWORD]@[DB_HOST]:5432/[DATABASE]
```

Then pinned versions, root cause marked established, empirical or unknown, the fix as real commands, what did not work and why it looked right and an occurrence log. Hit the same wall four times and it tops the report with a structural fix proposed: a pinned version, a lint rule, a CI check.

## What it needs

- The Littlebird MCP on a Power or Pro plan. It cannot reconstruct a solve from your description, since the detail you forgot is the point.
- A few minutes a week to approve or reject candidates. Rejections are permanent.
- A location for the base, confirmed once. Default is `knowledge-base/`.

## Limits worth knowing

Ambiguous means abandoned. If an error stopped appearing but the work never resumed, it is filed as an open wall, not a fix: a missing entry costs one re-debug, a wrong one costs that plus the time you trusted it. Root cause is never invented. Where it was not established, the field says so.

Secret scrubbing runs before anything is compared, reported or written, because debugging capture is dense with keys and connection strings and the greppable symptom line is where one survives. No matched value is printed back to you, and anything credential-shaped raises a rotation flag.

Entries go stale. Each carries pinned versions and a review date, and every sweep flags at most four. Stale entries are retired rather than deleted, so the occurrence history survives.

## Related skills

[sop-forge](../sop-forge/README.md), when the work went right and the output is a procedure. [day-reconstructor](../day-reconstructor/README.md), for the whole session rather than one lesson. [said-it-already](../said-it-already/README.md), the same recurrence instinct applied to what you write. [routine-architect](../routine-architect/README.md), when the sweep needs reshaping.

## Under the hood

`SKILL.md` carries the six sweeps, the solve-detection method and the routine prompt verbatim. The guides under `references/`: `solve-detection.md`, `entry-schema.md`, `kb-structure-and-dedupe.md`, `secret-scrubbing.md` and `staleness-and-versions.md`. Dedupe and indexing use `scripts/kb_index.py`.

`references/research/` holds 13 archived primary sources on knowledge capture, answer obsolescence and AI-assisted coding. Every domain claim traces to one, and five unevidenced mechanisms are labelled design decisions.
