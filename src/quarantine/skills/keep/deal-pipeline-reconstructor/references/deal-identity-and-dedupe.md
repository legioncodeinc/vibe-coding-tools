# Deal identity and dedupe

How to turn scattered fragments of names, companies, and conversations into a list of
deals, without silently merging two people into one or splitting one person into two.

This is the hardest part of the skill and the part most likely to produce a wrong board.
Read it before running step 4 of SKILL.md.

---

## 1. What a deal is, and why the unit matters

**A deal is a PERSON plus a COMPANY plus an OPPORTUNITY.** Not a contact. Not a company.

The features actually used to describe a real B2B opportunity in published modelling work
are the Account and Account Location, plus Opportunity Type, Project Duration and Total
Contract Value
(`research/distilled-b2b-pipeline-management.md`, section 4). Account plus opportunity
type, not contact.

Three consequences that come up constantly in practice:

| Situation | Correct handling |
|---|---|
| One person, two separate things they might buy | TWO deals. The retainer conversation and the one-off project conversation move at different speeds and sit at different stages. |
| Two people at the same company, same purchase | ONE deal, two contacts. Record both names. Multiple buyer-side contacts is a health signal in its own right, see section 6. |
| A person who changed companies mid-conversation | TWO deals, and say so. The opportunity at the old company is probably dead and the one at the new company is probably a Lead. Never carry a stage across an employer change. |
| A person you know socially who mentioned a project once | Probably not a deal. This goes to the confirmation pass in section 5. |

---

## 2. Entity resolution is a real discipline, so borrow its rules

Merging fragments of a person or organisation across inconsistent sources has a name:
"record linkage, de-duplication, or entity resolution"
(`research/distilled-b2b-pipeline-management.md`, section 4). Four rules follow directly.

**Rule 1: a match is probabilistic, never binary.** The field's mature methods are
probabilistic and trace back to the 1940s and 1950s
(`research/distilled-b2b-pipeline-management.md`, section 4). Attach a confidence to every
merge. A merge asserted without a confidence is asserting a certainty the discipline does
not grant.

**Rule 2: canonicalization is a SEPARATE step from matching.** Choosing the single
representative form of a resolved entity is its own stage of the process
(`research/distilled-b2b-pipeline-management.md`, section 4). Practically: after merging
"Dani", "Dani T.", "danielle.thompson@" and "D. Thompson" into one deal, the display name
is a CHOICE. Show it as one. List the variants it subsumes in the deal's evidence block so
the user can see what got folded together.

**Rule 3: the user is the only source of supervision.** Entity resolution methods span
unsupervised through fully supervised, and supervision means labelled examples
(`research/distilled-b2b-pipeline-management.md`, section 4). A solo operator's pipeline
supplies no labelled examples at the start. Every confirmed or rejected merge the user
gives you is a label. Record them so the next run does not ask again.

**Rule 4: the identity unit is account plus opportunity**
(`research/distilled-b2b-pipeline-management.md`, section 4).

---

## 3. The matching ladder

Work top down. Tiers 1 and 2 merge automatically. Tiers 3 and below require corroboration
or a question.

| Tier | Signal | Action |
|---|---|---|
| 1 | Identical email address, or identical full name plus identical company | Merge. Record the basis. |
| 2 | Identical full name in the same message thread, or the same calendar attendee identity across two meetings | Merge. Record the basis. |
| 3 | Same first name plus same company, different or missing surname | Merge ONLY if a third signal agrees (same thread, same meeting, overlapping topic). Otherwise ask. |
| 4 | Same full name, no company on either fragment | Ask. Common names collide. |
| 5 | Same company, different people, same opportunity language | Do NOT merge into one person. Create one deal with two contacts. |
| 6 | Phonetic or OCR-adjacent name variants ("Katharine" and "Katherine", "Rn" and "m") | Ask. OCR of dense UI produces fragments and near-misses (`littlebird-mcp-reference.md`, known limitations). |
| 7 | Nickname to formal name ("Mike" to "Michael", "Sasha" to "Alexandra") | Ask unless a single message shows both forms for the same person. |

### Never merge silently below tier 2

A bad merge is INVISIBLE in the output. Two rows that should be one is a duplicate the
user fixes in five seconds. One row that should be two is a deal that disappears, and the
user will not know it is missing. Asymmetric cost, so bias toward NOT merging.

### Batch the questions

Collect every tier 3 and below ambiguity and put them in ONE `AskUserQuestion` call, not
one call per pair. Show both fragments with their receipts side by side so the user can
answer from the evidence rather than from memory.

---

## 4. Company matching, which is worse than person matching

Company names in capture arrive as legal names, trading names, domains, initialisms, and
whatever the user typed in a hurry. Handle in this order:

1. **Domain is the strongest signal.** Two contacts on the same email domain are the same
   company. A generic domain (gmail, outlook, icloud) proves nothing.
2. **Exact name match after normalising.** Lowercase, strip punctuation, strip corporate
   suffixes (inc, llc, ltd, gmbh, co, corp, plc, pty, sa, srl).
3. **Initialism to full name** is a tier 6 ambiguity. Ask.
4. **Do not merge on industry, location, or logo similarity.** Those are not identity.

Where a company appears only as a spoken name in a meeting transcript, treat the spelling
as unverified. Raw transcript chunks are weakly diarized and the wording is what you can
trust, not the orthography (`littlebird-mcp-reference.md`, known limitations).

---

## 5. The "is this even a deal" confirmation pass

Capture surfaces names. Most of them are not prospects. This pass runs BEFORE stage
inference, because inferring a stage for a vendor is wasted work and looks careless.

Classify every candidate into one of five buckets, with the evidence that put it there:

| Bucket | Signals that indicate it | Default action |
|---|---|---|
| **Prospect** | They asked about price, scope, timeline, or availability. A proposal or quote was produced for them. A discovery or demo call was held. They were sent something to review. | Keep as a deal. |
| **Partner or referrer** | Conversation is about sending work to each other, joint delivery, or introductions. Money flows in both directions or neither. | Exclude from the board, list separately. |
| **Vendor or supplier** | They are invoicing the user, or the user is evaluating THEIR product. Direction of the sell is reversed. | Exclude, list separately. |
| **Existing client** | Delivery language, project status, support requests, an existing engagement. | Exclude from NEW pipeline. Flag any expansion or renewal conversation as its own deal. |
| **Ambiguous** | A single friendly conversation that mentioned work. A name with one weak signal. A friend who runs a business. | ASK. |

### The direction-of-sell test

The single most reliable discriminator: **who is being asked to pay whom.** If the
captured evidence does not answer that question, the candidate is Ambiguous, not a
prospect. Do not infer direction from enthusiasm.

### Ask about the ambiguous ones in one batch

Present each ambiguous candidate with its strongest one or two receipts and the specific
reason it is unclear. Give the user the five buckets as options. Do not present a long
list of names with no evidence attached, because the user will pattern-match on the name
and answer wrong.

### Record exclusions, never drop them

Every excluded candidate goes in a named Excluded section of the board with its reason.
Silent dropping is how a real deal disappears, and the user has no way to notice.

---

## 6. Contacts per deal is a health signal, with limits

Record every distinct buyer-side person observed on a deal. The largest-sample finding in
the archive is that "deals that close successfully have twice as many buyer contacts as
those that don't", over 1.8 million opportunities
(`research/distilled-b2b-pipeline-management.md`, section 7).

Use it as a RISK FLAG on single-threaded deals, and state the limits every time:

- The sample is self-selected to companies that bought a revenue-intelligence platform,
  which skews larger and more process-mature than a solo operator
  (`research/distilled-b2b-pipeline-management.md`, section 7).
- The finding is correlational with no published causal design. Contact count partly
  proxies for deal size and maturity rather than causing the win
  (`research/distilled-b2b-pipeline-management.md`, section 7).
- The headline 130% win-rate figure is scoped to deals above 50,000 USD
  (`research/distilled-b2b-pipeline-management.md`, section 7), which is above the typical
  deal size for many of this skill's users.

So: report the observed contact count, flag single-threaded deals, and never promise that
adding a contact raises the win rate.

Remember that the observed count is a FLOOR, not a total. App UIs collapse lists and
capture is partial by construction (`evidence-standards.md`, rule 5). Say "at least N
contacts observed", never "N contacts".

---

## 7. Deal amounts: unknown is a valid and frequent answer

**Do not fabricate a deal value. Ever.** Not from a rate card, not from a similar past
deal, not from a plausible range.

| Situation | What goes in the amount column |
|---|---|
| A number appears in a quote or proposal on screen, attached to this deal | The number, with its receipt and the date it was seen |
| A number appears in a message from the user to this prospect | The number, with its receipt, marked as quoted rather than agreed |
| A number appears but predates a scope change discussed later | The number, marked STALE, with both dates |
| A range was discussed, no figure landed | The range, marked as a range, not a midpoint |
| Nothing observed | `Unknown` |

`Unknown` is an honest cell. A guessed number is a lie that propagates into every total on
the board.

**Do not compute a weighted pipeline value.** Mainstream CRM computes it by multiplying
the deal amount by a fixed default stage probability
(`research/distilled-b2b-pipeline-management.md`, section 2). On a reconstructed board both
inputs would be manufactured: the amount is frequently unknown and the stage is inferred.
Multiplying two guesses produces a number that looks like revenue and is not. Report the
sum of KNOWN amounts, the count of unknown-amount deals, and stop there.

---

## 8. What each deal record carries into stage inference

Every deal that survives this file is a record with these fields. Anything missing is
`Unknown`, never invented.

| Field | Source | Notes |
|---|---|---|
| Display name | Canonicalization choice | List the variants it subsumes |
| Company | Domain, then normalised name | Mark unverified spellings from transcript |
| Contacts observed | Distinct buyer-side people | A floor, not a total |
| Opportunity | What they might buy, in the user's words where possible | Separate deals for separate opportunities |
| Amount | Section 7 | Unknown is valid |
| First observed touch | Earliest event time across all evidence | Event time, not collection time |
| Last observed touch | Latest event time across all evidence | Drives recency, see `recency-and-going-cold.md` |
| Evidence list | Every observation with its receipt | Sorted by event time (`evidence-standards.md`, rule 8) |
| Merge basis | Which tier of section 3 merged this, and whether the user confirmed | Carried forward so the next run does not re-ask |
| Deal-or-not basis | Which bucket in section 5, and on what evidence | |

Sort the evidence list by EVENT time before doing anything with it. Retrieval returns
relevance order, not chronological order (`evidence-standards.md`, rule 8), and for
messages the send time and the collection time are different values
(`littlebird-mcp-reference.md`).
