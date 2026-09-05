# Staleness and versions

A fix from two majors ago is not neutral. It is a wrong answer that the user's own past self
vouched for, which makes it harder to doubt than a stranger's wrong answer on the internet.

This is the best-evidenced risk in the whole skill, and the numbers are worth carrying.

---

## 1. What is actually known about staleness

From a study of 52,177 answer threads, 58,201 obsolescence-mentioning comments, and 12,629
tags on a public Q and A platform
[research/distilled-personal-knowledge-capture.md section 5]:

| Finding | Value |
|---|---|
| Obsolete answers that were already obsolete when first posted | 58.4% |
| Obsolete answers ever updated after being flagged | 20.5% |
| Cases where a replacement answer was added instead | 6.3% |
| Average lag between obsolescence being observed and anyone reacting | 118 days |
| Average time to actually update | 119 days |
| Obsolescence observations that carried supporting evidence | 78.6% |
| Links inside answers found inaccessible, of 5.5 million | 11.9% |

Two of those deserve emphasis.

**58.4% were already obsolete when posted.** Staleness is not only a decay problem. A
substantial share of bad records were bad on day one, written against something that had
already moved. For this skill that means the version block is not a maintenance nicety, it
is what makes the entry checkable at all.

**Only 20.5% ever got updated.** On a public platform with thousands of readers and a
reputation system. A personal knowledge base has one reader and no reputation system, so
assume the personal update rate is worse. That is an inference from the data, not a finding
in the paper.

### Who notices, and what that means for one person

| Observer | Share |
|---|---|
| An outsider never previously involved | 38.2% |
| The original answerer | 24.3% |
| The question asker | 20.5% |

[research/distilled-personal-knowledge-capture.md section 5]

**A personal knowledge base has no outsiders.** The largest single source of obsolescence
detection, 38.2%, does not exist here. That is an inference, labelled as one
[research/distilled-personal-knowledge-capture.md section 5]. It is the argument for
automating the staleness check rather than relying on the user noticing.

### What actually goes stale

| Cause | Share |
|---|---|
| Third-party libraries | 31.7% |
| Programming languages | 30.9% |
| Obsolete references and dead links | 15.5% |
| Tools | 12.9% |
| Mobile operating systems | 11.4% |
| Non-mobile operating systems | 2.1% |
| Protocols | 1.0% |

[research/distilled-personal-knowledge-capture.md section 5]

Roughly 63% comes from third-party libraries plus language versions. Those two Context rows
carry most of the staleness risk, so those two must be exact.

Most obsolescence-prone tags in that study: node.js 0.36%, ajax 0.34%, android 0.32%,
objective-c 0.32% [research/distilled-personal-knowledge-capture.md section 5]. Fast-moving
web and mobile ecosystems age fastest. Set review windows accordingly.

### The rule the authors state

The study's explicit recommendation to people writing answers is to **include version and
time information**, and to read the comments for obsolescence indicators, especially in web
and mobile tags [research/distilled-personal-knowledge-capture.md section 5]. That is the
rule this skill implements in the Context block and the `review-after` field.

---

## 2. What every entry carries

Three fields do the work.

| Field | Meaning |
|---|---|
| `Context / Versions` | The exact versions in the failure path at the time of the fix. |
| `review-after` | The date after which the entry is presumed suspect until reconfirmed. |
| `last-confirmed` | The last date the fix was observed to still work. `never` if it has not been reconfirmed since it was written. |

### Pinning versions

Record the exact version of everything in the failure path:

- The language runtime: `node 22.11.0`, not "Node 22".
- The framework: `next 15.4.2`.
- The specific failing dependency and its version.
- The platform or service, with its date, since hosted services have no version number:
  `Vercel build, as of 2026-07-09`.
- The OS and architecture where it plausibly matters.

Where capture did not show a version, write `unknown, not captured`. Do not infer a version
from a release date, and do not write "latest". "Latest" is the single worst thing that can
be in this field, because it is true on the day it is written and false forever after.

### Setting review-after

**Design decision, informed by the obsolescence-by-cause shares above.**

| Entry depends primarily on | review-after |
|---|---|
| A fast-moving JavaScript or mobile ecosystem dependency | 6 months |
| Any other third-party library or language version | 12 months |
| A hosted service or platform behavior with no version number | 6 months |
| Tooling, build systems, CI | 12 months |
| Something version-independent: a protocol behavior, a network fact, a data model quirk | 24 months |

Where an entry spans several, take the shortest.

This matches operational review practice, which sets quarterly review for frequently
changed systems, annual for stable procedures, immediate review after any change affecting
the procedure, and an annual library-wide audit flagging anything not reviewed in 12 or more
months [research/distilled-personal-knowledge-capture.md section 3].

---

## 3. The staleness check

Runs as part of every weekly sweep, before the new candidates are worked.

```
python3 scripts/kb_index.py knowledge-base --stale
```

The script flags an entry when any of these is true. All are mechanical; none requires
judgment:

1. `review-after` is in the past and `last-confirmed` is older than `review-after`.
2. `last-confirmed` is `never` and the entry is older than its review window.
3. `root-cause-status` is `empirical` or `unknown` and the entry is older than 12 months.
   An empirical fix has no mechanism to reason about, so it ages worse than an explained
   one.
4. `solved-by` is `ai-assistant` and `understood` is `no`, and the entry is older than 6
   months. Nobody verified it the first time, so it gets the shorter window. See
   `solve-detection.md` section 4.
5. The Context block contains `unknown, not captured` in the Versions row. The entry cannot
   be checked for staleness at all, which is itself a flag.

The script reports flags. It never edits an entry, and it never decides that something is
wrong. It only says that something has not been checked.

### What the sweep report does with the flags

Two to four stale entries per report, no more. A staleness list that is longer than the new
candidate list turns the weekly report into a chore, and a chore gets muted.

Order them by how much the user would lose if the entry is wrong: highest occurrence count
first, then the ones whose fix touches production, then the rest.

For each, the report says what changed, where that can be checked cheaply:

```
STALE: 2026-02-11--prisma-p3009-neon-branch-reset
  Pinned at prisma 6.2.1. Capture on 2026-08-04 shows prisma 7.0.3 in package.json.
  Root cause was established, so the mechanism may still hold, but the command in
  The fix used a flag that 7.x renamed. Reconfirm or retire.
  [Monday, August 4, 2026 09:31 EDT | code]
```

Version drift is detectable from capture itself. `search_user_context` over lockfiles,
`package.json`, `requirements.txt`, terminal version output, and dependency dashboards will
often show what the user is on now. Where it does, say so with a receipt. Where it does not,
say the version is unknown rather than assuming drift.

---

## 4. The three outcomes of a staleness review

The user decides. This skill proposes.

| Outcome | What changes |
|---|---|
| **Reconfirm** | `last-confirmed` set to today, `review-after` pushed out by the entry's window, and the newly confirmed version added to the Context table as an additional row. |
| **Revise** | The fix is updated for the new version. The old version-specific fix stays, labelled with the version range it applied to. Nothing is deleted. |
| **Retire** | The entry moves to a `RETIRED` marker in its metadata block and drops out of `INDEX.md`, but the file stays. |

**Retire, do not delete.** A retired entry still answers the question "did I already look at
this and decide it does not apply any more", which is a question the user will otherwise
spend twenty minutes re-answering. Deletion also destroys the occurrence history, which is
the input to the recurrence escalation in `kb-structure-and-dedupe.md` section 5.

A retired entry carries one added line:

```
RETIRED 2026-08-17: superseded by prisma 7 migration behavior. Kept for history.
See 2026-08-16--prisma-7-migrate-resolve-renamed.
```

---

## 5. The dead-link problem

11.9% of 5.5 million links inside public answers were inaccessible
[research/distilled-personal-knowledge-capture.md section 5], and obsolete references and
dead links account for 15.5% of obsolescence
[research/distilled-personal-knowledge-capture.md section 5].

Consequence for entry authoring: **an entry never depends on an external link for its
content.** A link to the GitHub issue or the documentation page that explained the cause is
useful context and goes under Related. The fix itself, the commands, the config, and the
mechanism are written into the entry in full. If the linked page vanishes, the entry still
works.

This skill does not check links. Checking them would mean fetching URLs derived from the
user's private capture, which is a separate risk with no benefit that offsets it. The
mitigation is the authoring rule above, not a checker.

---

## 6. What is not evidenced here

- The `review-after` windows in section 2 are a **design decision**, informed by the
  obsolescence-by-cause shares but not derived from any source that studied review windows
  [research/distilled-personal-knowledge-capture.md section 8].
- The five staleness flag conditions in section 3 are a **design decision**.
- The claim that a personal base updates less often than a public platform is an
  **inference** from the 38.2% outsider-observation share, not a finding
  [research/distilled-personal-knowledge-capture.md section 5].
- The 118-day reaction lag and the other timing figures come from a platform with social
  pressure to correct. Do not present them as predictions for one person's private file.
