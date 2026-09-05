# Dedupe against the CRM

Two different dedupe problems live in this skill and confusing them produces bad output.

| Question | Answered by |
|---|---|
| Have I already SEEN this signal in a previous run? | `references/high-water-mark.md` |
| Do I already HAVE this person as a contact? | this guide |
| Are these two captured rows the same human? | `lead-harvester/references/signal-extraction-and-dedupe.md`, the matching ladder |

The third one is solved. Do not restate it. Read the sibling's matching ladder and apply it
to collapse captured rows into people BEFORE any of the following runs. This guide starts
from a list of distinct people and asks whether each already exists in the CRM.

## Why this pass is mandatory rather than optional

Duplicate contamination is the normal state of a CRM, not an exception: 92% of
organisations report duplicate records, only 22% hit a 1% or lower duplicate rate, and
ungoverned databases run 10 to 30% duplicates
[research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md]. A daily drip that
skips the check adds to that at a rate of one contaminated record per hand-raiser per day.

And the CRM's own dedupe will not save you. GoHighLevel matches on a single primary field,
Email by default, with an optional secondary checked only if the primary found nothing
[research/raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md]. That is
deterministic exact matching, which "links two records only when specified fields agree
exactly" and where "a single typo or formatting difference breaks the match"
[research/raw/piper--dedupe--dataladder-deterministic-vs-probabilistic.md]. Deterministic
matching alone misses an estimated 30 to 40% of real duplicates
[research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

## The structural difficulty, stated plainly

A social hand-raiser usually arrives with a DISPLAY NAME and nothing else. No email. No
phone. The CRM record, if it exists, was probably created from a form fill and has an email
and a phone and possibly a different name spelling.

That is precisely the case the literature says deterministic matching handles badly: no
shared identifier, multi-source data, name variation
[research/raw/piper--dedupe--dataladder-deterministic-vs-probabilistic.md]. Do not pretend
otherwise. A name-only match is a probabilistic judgment, and the output must say so.

## Normalise before comparing

Every comparison runs on normalised values, never raw ones
[research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md]:

1. Trim leading and trailing whitespace, collapse internal runs of whitespace.
2. Lowercase everything.
3. Strip emoji, decorative characters, and trailing credential suffixes such as Jr, PhD,
   MBA, and anything after a comma in a professional display name.
4. Normalise phone numbers to E.164 before comparing
   [research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md]. Note that
   GoHighLevel publishes nothing about how it normalises phone or email on its side
   [research/raw/piper--ghl-dedupe--highlevel-deduplication-preferences.md], so normalise on
   your side and do not assume the CRM did.
5. Normalise email to lowercase for comparison
   [research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

## The search ladder, strongest signal first

Run these against the CRM in order and stop at the first tier that produces a confident
result.

| Tier | Search | Verdict |
|---|---|---|
| A | Exact normalised email | Match. High confidence. Existing contact. |
| B | Exact E.164 phone | Match. High confidence. Existing contact. |
| C | Exact normalised full name, one result returned | Probable match. Medium confidence. Needs the corroboration rule below. |
| D | Exact normalised full name, several results returned | Ambiguous. Do not merge. Surface to the user. |
| E | Fuzzy name, first name close and surname close | Possible match. Never auto-decided. Surface to the user. |
| F | Nothing returned | New contact. High confidence that it is new only if tiers A and B could actually run, meaning an email or phone was available. |

**Tier F carries a trap.** "No match found" when you only had a display name to search on
is a weak negative, not a clean one. Record it as `new (name-only search)` rather than
`new`. The difference matters because the user is about to send a first-contact message to
someone who may be a long-standing customer.

## The corroboration rule for tier C

A single exact name match is not enough on its own. Accept it as an existing contact when
at least one of these also agrees:

- The CRM record's source or tags already reference the same platform or campaign.
- The CRM record carries a company name that appears in the captured signal.
- The user confirms it.

Otherwise treat it as tier D and ask.

## Confidence tiers and what each triggers

The practitioner convention in the archive maps cleanly onto the ladder
[research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md]:

| Band | Meaning here | Action |
|---|---|---|
| 0.95 to 1.00 | Exact email or phone match, tiers A and B | Treat as existing. Safe to enrich without asking. |
| 0.80 to 0.95 | Exact name plus one corroborating detail, tier C corroborated | Treat as existing, and SHOW the user the CRM record it matched before writing anything to it. |
| 0.60 to 0.80 | Name matches, no corroboration, or fuzzy name, tiers D and E | Human validation required. Never auto-decide. |
| Below 0.60 | No plausible match | Treat as new, with the name-only caveat if it applies. |

Auto-merge belongs only at the top band, and the middle bands go to human review with the
related records visible [research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

The reason for the asymmetry: "A merged record that shouldn't have been merged is a
different kind of risk than a missed duplicate"
[research/raw/piper--dedupe--dataladder-deterministic-vs-probabilistic.md]. In this skill a
wrong merge writes a stranger's comment into a real customer's record and then queues a
first-contact message to a person you have known for two years. A missed duplicate creates
a second row the user deletes in five seconds.

## Enriching an existing contact: survivorship

When a person is already in the CRM, the run ADDS a signal. It does not overwrite the
person.

Survivorship is decided per field, not per record: "The 'winning' record rarely holds the
best value for every field"
[research/raw/piper--dedupe--digitalapplied-merge-framework-2026.md].

| Field | Rule |
|---|---|
| Name | CRM value wins. It was entered deliberately; a social display name was not. |
| Email, Phone | CRM value wins. Never overwrite a known-good contact detail with a captured one. Add as an additional email or phone if genuinely new. |
| Contact Source | CRM value wins. First-touch attribution is the point of the field; do not overwrite the original source with today's campaign. |
| Tags | ADD the campaign tag. Never remove an existing tag. Tags are additive by design and many per contact are supported [research/raw/piper--ghl-tags--highlevel-add-contact-tag-action.md]. |
| Notes | APPEND the new signal with its receipt. Never replace. |
| DND | CRM value always wins and is never touched by this skill. |

**If the existing contact has DND set, or any opt-out marker, stop.** Do not queue a
message. Report it as `existing contact, opted out, skipped`. Objection to direct marketing
is absolute and takes effect immediately
[research/raw/piper--consent--usercentrics-gdpr-legitimate-interest.md], and CAN-SPAM
requires opt-outs be honored
[research/raw/piper--consent--ftc-can-spam-compliance-guide.md]. A skill that queues a
message to an opted-out contact because they left a comment has broken the one rule that
carries a per-message penalty.

## The GoHighLevel split-record collision

Before any upsert where both an email and a phone are available: search on each
INDEPENDENTLY. If the two searches return different contact ids, the CRM holds two records
for one person. The API will pick one by the configured priority sequence and silently
ignore the other
[research/raw/piper--ghl-api--highlevel-upsert-contact-endpoint.md].

Do not upsert. Report it:

```
COLLISION: Marcus Oyelaran
  email match  -> contact id A
  phone match  -> contact id B
  Two records exist for one person. Merge them in the CRM, then re-run.
  Nothing was written.
```

## The dedupe report, which is required output

Not an appendix. A named section with numbers.

```
Dedupe against CRM
  Candidates this run:                    9
  Already in CRM, skipped:                3
    matched on email                      2
    matched on name plus corroboration    1
  Already in CRM, enriched with new tag:  1
  Already in CRM, opted out, skipped:     1
  New contacts to create:                 3
  Ambiguous, awaiting your decision:      1
  Collisions blocking a write:            0
  Search quality note: 4 of 9 candidates had no email or phone, so their
  "new" verdict rests on a name-only search and is weaker than the others.
```

That last line is the honest part and it is not optional. It is the difference between "we
checked" and "we checked as well as the available identifiers allowed"
(`references/evidence-standards.md`, rule 2, on not converting an absence into a negative
finding).
