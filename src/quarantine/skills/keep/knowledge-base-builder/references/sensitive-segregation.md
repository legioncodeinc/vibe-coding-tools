# Sensitive material: segregate, do not silently include

Runs as part of stage 5, before any file is written. It is not a review pass at the end.

**This design has no support in the documentation research archive.** No documentation source
covers it [research/distilled-documentation-architecture.md section 8]. It comes from
`evidence-standards.md` rules 7 and 10, and from the specific hazard shape of this skill.

---

## The hazard

A knowledge pack is built to be handed to someone. That is its whole purpose. The people it
gets handed to include contractors, agencies, new hires, prospective partners, and AI sessions
whose transcripts live somewhere the user has not thought about.

A pack assembled from a project's full capture will contain, without anybody intending it:
equity splits mentioned on a founder call, a runway figure quoted in passing, a rate a
contractor is being paid, a legal matter someone referenced, a frank assessment of a person's
performance, and a customer's private information visible on a shared screen.

Two properties make this worse than the usual disclosure risk. The pack is **durable**, so a
mistake persists rather than scrolling away. And it is **built for handing over**, so the
default trajectory of the file is outward.

---

## The five categories

Anything in these categories does not go in the main pack. It goes in the segregated file, or
it is dropped.

| Category | What it covers |
|---|---|
| **Financial** | Revenue, runway, burn, margins, pricing floors, customer-specific pricing, debts, funding status, bank or payment detail, individual transaction amounts |
| **Equity and ownership** | Cap table, splits, vesting, option grants, promised equity, ownership disputes |
| **Legal** | Disputes, threatened or actual litigation, regulatory exposure, contract terms not public, IP ownership questions, compliance findings |
| **Personnel** | Compensation, performance assessments, hiring and firing intentions, health, personal circumstances, interpersonal conflict, anything about an identifiable individual that is not their role and their scope |
| **Third-party confidential** | Another company's data seen on a shared screen, a customer's private information, another party's material under an NDA |

The evidence standards already bar health, financial detail, legal history, family
circumstances, protected characteristics, and precise home location from a business deliverable
even when the capture contains them (`evidence-standards.md` rule 10). This guide extends that to
the project-level material a pack accumulates, and adds the segregation mechanism.

---

## The three-way sort

Every candidate fact lands in exactly one bucket.

### Bucket 1: main pack

Not in any of the five categories. Ships in the normal files.

### Bucket 2: segregated file

In a category, **and** materially necessary for someone to understand the project. Ships in
`SENSITIVE-PROJECT-SLUG.md`, which the user controls and hands over separately or not at all.

The test for "materially necessary": would a competent person working on this project make a
worse decision without it? A runway figure usually passes when it constrains scope. A specific
salary almost never passes.

### Bucket 3: dropped

In a category and not necessary. It does not go anywhere. It is not in the sensitive file, it is
not in a footnote, it is not in a working file left in the directory.

The bar is deliberately high for bucket 2. The purpose of segregation is that the sensitive file
is short enough that the user can actually read it before deciding who sees it. A sensitive file
containing everything sensitive is a second pack, which defeats the point.

---

## The segregated file

Filename: `SENSITIVE-PROJECT-SLUG.md`. Uppercase prefix so it sorts to the top of every listing
and cannot be missed in a directory view or a file picker.

Required header, verbatim in shape:

```
# SENSITIVE: PROJECT NAME

**Do not include this file in any pack handed to a contractor, agency, partner, or third
party. Do not paste it into a shared session. It is separate from the main knowledge base by
design.**

Generated: YYYY-MM-DD
Categories present: financial | equity | legal | personnel | third-party
Item count: N
```

Then one entry per item:

```
## S-001: one line naming the item

**Category:** one of the five
**Fact:** one sentence
**Why it is here rather than dropped:** what a reader would get wrong without it
**Receipt:** per evidence-standards.md rule 1
**Confidence:** High | Medium | Low
```

Same evidence standards as the main pack. A sensitive fact that is wrong is worse than one that
is merely private.

---

## The pointer in the main pack

The main pack must say the sensitive file exists, without saying what is in it.

In `00-index.md`, one line:

```
Sensitive material: N items segregated into SENSITIVE-PROJECT-SLUG.md, not included in this
pack. Categories: financial, personnel.
```

Category names but no content. A reader needs to know that the pack is deliberately incomplete
in a named way, so they can ask rather than assume the project has no financial constraints.

Where a specific document is materially shaped by a segregated fact, say so in place:

```
Note: a constraint on this requirement is recorded in the segregated file.
```

Never the constraint itself. Never a hint specific enough to reconstruct it.

---

## The detection pass

Run all four sweeps. The first two catch most of it, the third catches what pattern matching
misses, and the fourth catches the surprising cases.

1. **Category sweep.** Read every ledger row against the five categories. This is a read, not a
   regex, because the categories are semantic.
2. **Number sweep.** Every currency figure, percentage, and multiple in the material. For each,
   ask what it measures. Money figures that are product pricing are usually bucket 1. Money
   figures about the business are usually bucket 2 or 3.
3. **Person sweep.** Every named individual. For each, check whether what is recorded about them
   goes beyond their role and their scope on this project. If it does, it is personnel.
4. **Screen-share sweep.** Snapshots captured during a screen share show someone else's screen.
   Anything in a snapshot that belongs to another company or another person is third-party
   confidential by default, and the burden is on including it rather than on excluding it.

Sweep 4 is the one that produces the surprises. Capture is broad, and a project call where
someone shared their dashboard has put another company's numbers in the user's capture.

---

## The confirmation gate

Show the user the segregated list before writing anything, with `AskUserQuestion`. This runs at
the same stage as the general confirmation gate and is a distinct question set.

Show, for each item: the one-line description, the category, and the bucket you assigned. Do not
show the full fact text in the question if it is highly sensitive; show enough to identify it.

Offer per item: keep in sensitive file, move to main pack, or drop entirely.

Two rules for how to handle their answers:

- **The user can always downgrade.** If they say a financial figure is fine in the main pack,
  that is their call and it is respected.
- **The default is never automatic promotion into the main pack.** An item stays segregated
  unless the user explicitly moves it. Silence is not consent.

Also ask once, at the top: who is this pack for. A pack for a contractor and a pack for the
user's own future AI sessions have different answers, and the answer changes bucket assignments
for borderline items. Record the answer in the index.

---

## What this does not do

It does not make the main pack safe to publish. It reduces the chance that an obvious category
of harm ends up in a file the user hands over casually. The main pack will still contain
business detail the user may not want public, and the user is still the one deciding who gets
it.

Say that to the user at handover, once, plainly. Do not let the existence of a segregation pass
read as a guarantee of safety.
