# Signal extraction and deduplication

How to turn retrieved capture into a roster of distinct people, each carrying every signal
they gave, without silently merging two humans into one.

## The four signal types

| Signal | Where it is found in capture | What it proves |
|---|---|---|
| **Comment** | Post comment threads, notification stacks ("A, B and 4 others commented on your post"), the operator's own reply chains | The person acted publicly, in front of their own network. Highest social cost of the four. |
| **DM or message request** | Message thread lists with per-thread previews, the message requests tab, the conversation itself | The person moved to a private channel unprompted. Highest intent of the four. |
| **Friend or connection request** | Friend request screens, pending invitation lists, "N new invitations" notifications | The person wants ongoing access, not just the resource. |
| **Reaction** | Reaction summaries, reaction list modals, notification lines ("12 people reacted") | Lowest cost, lowest intent, and the one most often collapsed into a count with no names. |

Each extracted signal is a ROW, not a person. Rows become people in the dedupe step.

## What a signal row must carry

Every row carries these fields, and a row missing the first four is discarded rather than
guessed at:

1. `display_name` exactly as it appeared, including any middle name, emoji, or suffix.
2. `signal_type` from the four above.
3. `event_time` when the signal happened. For messages this is the send time, NOT the
   collection time (`references/evidence-standards.md`, rule 8).
4. `receipt` in the canonical format from `references/evidence-standards.md`, rule 1.
5. `surface` which screen it came from, for example "notification stack", "expanded
   comment thread", "message requests tab".
6. `verbatim` the exact text where there is text, for example the comment body. This is
   what makes the first touch specific.
7. `confidence` High, Medium, or Low per `references/evidence-standards.md`, rule 3.

## Extraction rules

**Deduplicate before counting anything.** OCR of dense UI produces fragments, duplicate
lines, and interleaved chrome (`references/littlebird-mcp-reference.md`, Known
limitations). Two identical lines from the same snapshot are one observation, not two.

**Sort by event time, not by relevance.** Retrieval returns items relevance-ordered
(`references/evidence-standards.md`, rule 8). Sort before building any timeline or
computing any recency score.

**Read "and N others" as data, not as noise.** Every collapsed string is a countable
member of the unnamed gap. Record it: surface, timestamp, and N. The coverage report is
built from exactly these.

**Do not attribute the operator's own text to a hand-raiser.** A comment thread contains
the operator's replies. Screen capture shows what the user was VIEWING
(`references/evidence-standards.md`, rule 4). A line reading "Sent!" under three names is
the operator, not a fourth hand-raiser.

**Watch for the bot.** If a comment-to-DM tool is running, the public replies under
comments are the tool's output, not the operator's and not the hand-raiser's. Anything a
bot produced on the operator's behalf is not a signal from a person
(`references/evidence-standards.md`, rule 4).

**Do not treat a keyword match as required.** Comment automation captures one signal
type, on a pre-selected set of posts, and only on a user's FIRST comment under a post
[research/raw/leadharvest--automation-tools--manychat-ig-comment-trigger-help.md]. The
whole point of this skill is that people
raise hands in ways the keyword filter misses: they comment "yes please", they DM instead,
they send a friend request with no message. A row qualifies if it is a person acting on the
campaign post inside the campaign window, whether or not the text contains the keyword.
Record whether the keyword matched as a separate boolean, because it feeds scoring.

## Deduplication: matching people across surfaces

The same person appears as a display name in a notification, a slightly different name in
a thread list, and possibly a third form in a friend request. This is the hard part and it
is where a careless skill does real damage.

### The matching ladder, strongest evidence first

| Tier | Rule | Action |
|---|---|---|
| 1 | Exact string match on display name, same platform | Merge automatically. |
| 2 | Match after normalization: casefold, strip emoji, strip punctuation, collapse whitespace, strip common suffixes (Jr, PhD, MBA, credentials after a comma) | Merge automatically. |
| 3 | One name is a strict subset of the other in token order, for example "Dani Thompson" and "Dani M. Thompson", or "Dani Thompson" and "Dani Thompson-Reyes" | Merge ONLY if a corroborating detail agrees: same profile photo described in capture, same thread, adjacent timestamps in the same surface. Otherwise ask. |
| 4 | First name matches, last name differs or is absent, for example "Dani" in a reaction list and "Dani Thompson" in a comment | Do not merge. Surface as an ambiguous pair for user confirmation. |
| 5 | Nickname or handle relationships, for example "@dthompson" and "Dani Thompson" | Do not merge on inference. Ask. |
| 6 | Same display name, different platforms | Do not merge into one person by default. Present as a suggested cross-platform link for confirmation. |

### The rule that governs all of it

**Surface ambiguous merges for user confirmation. Never merge silently.** Use
`AskUserQuestion` (`references/evidence-standards.md`, rule 6, confirm before you encode).
Present the ambiguous pair with both receipts and let the user decide. Batch these into
one question with several options rather than interrogating the user row by row.

A wrongly merged pair is worse than two unmerged rows, because the merge is invisible in
the output. Two unmerged rows produce a duplicate the user notices and fixes in a second.
A bad merge produces a message addressed to the wrong person.

### Failure modes to name in the output

State these in the coverage report so the user knows what to distrust:

| Failure mode | What it looks like | Mitigation |
|---|---|---|
| **Common name collision** | Two genuinely different people both named "Maria Garcia" | Never auto-merge Tier 1 for a name flagged as high-frequency in the roster itself. If a name appears with two different profile contexts, split and ask. |
| **Display name change mid-campaign** | Someone renames their profile between the comment and the DM | Undetectable from name alone. Adjacent timestamps plus a matching thread can catch it. Otherwise it produces two rows, which is the safe failure. |
| **OCR corruption** | "Danï Thomps0n" | Normalization catches most. A row whose name contains implausible character substitutions is Low confidence and is flagged, not silently corrected. |
| **Truncated names** | "Christopher Vandermeu..." in a narrow UI column | Match by prefix only into Tier 3, which means it needs corroboration or a question. |
| **Handle versus real name** | The comment shows a real name, the DM list shows a handle | Tier 5. Ask. |
| **Business page versus person** | A page commented, not a human | Flag as an organization row, do not draft a personal first touch for it. |

## Building the coverage report

The coverage report is mandatory output, not an appendix. It has three parts, and rule 5
of `references/evidence-standards.md` is the reason.

**Part 1: the named set.** Every distinct person with every signal, every timestamp, every
receipt.

**Part 2: the unnamed gap.** Not a vague admission. A number and a source, per surface:

```
Unnamed hand-raisers: 27 estimated
  18 from "and 18 others commented" on the Aug 4 post
        [Monday, August 4, 2026 09:12 EDT | chrome]
   9 from "12 people reacted" where 3 were named
        [Monday, August 4, 2026 09:12 EDT | chrome]
Coverage: 55 named of an estimated 82 (67%)
```

Where the arithmetic is uncertain, say so. Overlap between a reaction count and a comment
count is likely, because commenters often react too, so the estimated total is a ceiling,
not a headcount. State that.

**Part 3: the pointer.** A direct pointer to the exact post so the user can close the gap
themselves. Where a URL appeared in the capture, give the URL. Where it did not, give
enough to find it in one action: platform, account, date, and the first line of the post
text. Then name the fix: run the capture protocol in
`references/capture-protocol.md` and re-run the harvest.

## Never present a partial roster as complete

If the coverage report is missing, the deliverable is not finished. A roster with no
coverage section implies completeness it does not have, and the user will notice the
missing names first (`references/evidence-standards.md`, rule 5).
