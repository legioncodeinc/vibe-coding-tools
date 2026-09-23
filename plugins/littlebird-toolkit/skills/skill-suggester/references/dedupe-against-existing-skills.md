# Dedupe against existing skills

Run this before any candidate is ranked, drafted, or shown to the user.

**Why it comes first.** Proposing a skill the user already has is the failure that discredits
the whole exercise in one line. The user does not think "close but no". They think the thing
does not know what it is looking at, and they stop opening the report. And this failure is
not rare: it is the single most likely output of a detector that reasons only from capture,
because capture shows the work being done manually and says nothing about what was installed.

The failure literature has a version of this. One of the four named causes of automation
failure is automating in a non-efficient way: automating the wrong process, or a
non-optimized one, rather than fixing what already exists first
[references/research/distilled-automation-opportunity-identification.md section 7]. A skill
that already exists and is not firing is the purest case of that.

---

## Step 1. Establish what the user actually has

**List the skills available in this session before anything else.** Use whatever listing
capability the session exposes. Do not work from an assumption about what a Littlebird user
has installed, do not work from a list in a previous report, and do not work from this
document, which will be out of date.

Collect three things where they are available:

1. **Installed skills in this session**, with their names and full descriptions. The
   description matters as much as the name, because the description is what decides whether a
   skill fires.
2. **The littlebird-skills marketplace set**, if it is readable from this session. If it is
   not, say so and treat the installed set as the whole picture.
3. **The user's existing routines.** `LB_INTERNAL_LIST_ROUTINES`, then
   `LB_INTERNAL_GET_ROUTINE_CONFIG` on anything whose title looks related. A routine already
   watching for the pattern is a form of coverage, and proposing a skill that duplicates it
   is the same mistake one layer down.

If none of the three is available, **stop and say so.** Do not run the dedupe on memory. A
proposal shipped without a dedupe pass is worse than no proposal, and this is the one place in
the skill where degrading gracefully is not an option.

---

## Step 2. Classify every candidate into one of four buckets

Do this per candidate, before ranking. The bucket determines the output, and three of the
four buckets do not produce a proposal at all.

| Bucket | Test | Output |
|---|---|---|
| **A. Already covered** | An installed skill does this work | Not a proposal. A "you already have this" line. |
| **B. Covered but not firing** | An installed skill does this work and the capture shows the user doing it by hand anyway | A description rewrite for that skill, with the user's own trigger words |
| **C. Nearly covered** | An installed skill covers most of it and would need extending | An improvement to that skill, named specifically |
| **D. Genuinely new** | Nothing covers it | A proposal, and possibly a drafted SKILL.md |

Only bucket D produces a new skill. In practice buckets B and C together will usually be
larger than D, and that is the correct result, not a disappointing one.

---

## Bucket B is the one that matters most

**"You already have X, it may just need better triggering" is frequently the real answer.**

Here is why it happens. A skill fires on its description. The authoring contract is explicit
that the description states both what the skill does and when to use it, with trigger phrases
front-loaded, because some harnesses judge relevance from that text alone and some truncate it
under a context budget. Those rules are embedded in `references/skill-md-drafting.md`
section 2.4. If the user's actual words for the task are not in the description, the skill
does not fire, and the user does the work by hand while owning a tool that would have done
it.

**And this skill is uniquely well placed to fix it**, because the capture contains the user's
actual words. Signature 2 in `references/pattern-signatures.md` retrieves the exact phrasing
the user used when they asked for the thing. That phrasing is precisely the material a
description needs.

### What a bucket B output looks like

For each bucket B item, produce:

1. **The skill that should have fired**, by name.
2. **What the user said instead**, quoted, with a receipt. Three to five distinct phrasings if
   the capture supports it, each with its date and source
   (`references/evidence-standards.md` rule 1).
3. **The skill's current description**, verbatim.
4. **A proposed replacement description**, with the user's phrasings front-loaded in the first
   200 characters, obeying every frontmatter rule in
   `references/skill-md-drafting.md` section 2.
5. **A one-line statement of what else could be wrong**, because triggering is not the only
   explanation. Name the alternatives honestly: the user may not know the skill exists, the
   skill may have failed once and lost their trust, or it may be installed in a different
   session or harness from the one they work in. Ask rather than assert.

That output is a smaller deliverable than a new skill and it is usually worth more, because it
recovers a capability the user already paid for.

**Do not apply the change.** A description rewrite is a durable edit to an installed artifact.
It goes to the user as text, for approval, exactly like every other change in this
marketplace. See the draft-never-send law in SKILL.md.

---

## Bucket C: cannibalization awareness

**If the marketplace already has a skill that nearly covers the pattern, the right output is
an improvement to that skill, not a new one.**

A second skill covering 80% of the same ground makes both worse. Two skills with overlapping
descriptions compete for the same trigger, and the harness picks one, which means the user now
has a coin flip where they used to have a tool. The maintenance argument is the same one the
failure literature makes about underestimating post-implementation work: processes,
interfaces and data formats change regularly, requiring continuous planning and testing
[distilled section 7]. Two overlapping skills is two maintenance obligations for one
capability.

### The test for C versus D

Ask what the difference actually is. If the answer is:

- **A different input source, same output**: that is bucket C. Extend the existing skill with
  a second retrieval path.
- **A different output shape, same input**: usually bucket C. Extend with a second output
  mode. The precedent exists in this marketplace: sop-forge carries four output modes off one
  reconstruction.
- **A different domain requiring its own research archive**: that is bucket D. The marketplace
  contract requires a domain research archive per skill, and a genuinely different domain
  cannot be bolted onto an existing one.
- **The same thing with a different name**: bucket A, not C.

### What a bucket C output looks like

Name the existing skill, name the specific extension (a new reference file, a new output mode,
a new retrieval step), and say why extending beats forking. One paragraph. Do not draft the
extension unless the user asks, because the useful version of that work needs the existing
skill's files open in front of you.

---

## Step 3. Known overlaps inside this marketplace

Check these specifically, because they are the ones a repeated-work detector will trip over.
This list is a starting point and it goes stale. Always run step 1 as well.

| If the candidate is | Check first | Why |
|---|---|---|
| A manual procedure the user performs repeatedly and could hand off | `sop-forge` | The answer to repeated manual work is very often a written procedure, not an automation. sop-forge reconstructs it from the same capture. |
| Any pattern where the output would be a recurring watch | `routine-architect` | The correct artifact may be a routine, and routine-architect designs, audits and wires those. Proposing a skill where a routine prompt would do is a category error. |
| The same thing being said or sent repeatedly | `said-it-already` | Repetition in outbound communication is its territory. |
| One piece of work reshaped for several channels | `content-repurposer` | |
| A recurring client, deal or account check | `client-health-radar`, `deal-pipeline-reconstructor`, `renewal-sentinel` | Recurring account work is heavily covered already. |
| A recurring pre-meeting or pre-call assembly | `pre-call-prep` | |
| Recurring chasing of money or replies | `invoice-chaser`, `who-am-i-ghosting`, `commitment-tracker` | |

---

## Step 4. This skill's own overlap, declared

**`routine-architect` ships a routine pattern called the reusable-asset watch (C2) that
watches for exactly this signal**: work the user has now done more than once and should turn
into a reusable asset. It runs monthly, it uses a comparable set of queries, and it hands off
to `sop-forge`.

The difference is real but narrow. C2 detects repeated work and points at documentation.
This skill detects repeated work, dedupes it against what the user already has, and drafts a
skill. Same detector, different downstream.

**So do not run both.** If the user already has C2 installed as a routine, the honest
recommendation is to replace it rather than add alongside it, and to say why: two monthly
routines watching the same signal produce two reports naming the same work, which is the
fastest way to make both unreadable. Routine slots are plan-limited, so this is a real cost
and not a tidiness preference (`references/littlebird-mcp-reference.md`, routine tools).

State this in the report the first time the skill runs for a user. A skill that teaches
cannibalization awareness and then quietly cannibalizes an existing routine has failed its
own test.

---

## Step 5. Report the dedupe pass, always

Every report shows the dedupe pass ran, whether or not it removed anything:

```
Dedupe pass: 14 installed skills and 2 routines checked on 2026-09-01.
  Already covered: 1 candidate (monthly client report, covered by content-repurposer)
  Covered but not firing: 2 candidates
  Nearly covered: 1 candidate (extend sop-forge rather than fork)
  Genuinely new: 1 candidate
```

If the pass could not run, that line says so instead, and the report carries no proposals.

The visible count is what makes the proposals credible. A ranked list with no dedupe line
reads like a list of guesses, because that is what it would be.
