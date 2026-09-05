# Internal retrieval brief

The Littlebird half of the dossier. This is the part no external research tool can produce,
and the relationship timeline that comes out of it is the reason the skill exists.

Mechanics here come from `references/littlebird-mcp-reference.md`. Evidence handling comes
from `references/evidence-standards.md`. Method claims trace to
`research/distilled-due-diligence-and-osint.md`.

## Before running anything

List the tools actually available in this session and use the real names. Do not assume the
Littlebird MCP is connected or that a tool is spelled the way this file spells it. If
`search_user_context` is absent, the Littlebird MCP is not connected: stop and tell the user
the skill needs it on a Power or Pro plan.

Have the purpose and scope answers in hand from `references/purpose-binding-and-scope.md`.
The date window from the scope question becomes the `date_range` on every call below.

## Step 1: build the identifier baseline

Gather every identifier known about the subject before searching, because that is what keeps
false positives out when pivoting across surfaces (distilled section 4). Ask the user for
whatever they have: full name, any middle name or initial, email addresses, company, role,
phone, and profile URLs.

Rank what you get by discriminative strength (distilled section 4):

| Tier | Identifiers | Use |
|---|---|---|
| Strong, effectively unique | Email address, phone number | Anchor queries. A match on one of these is close to identity-confirming |
| Medium, filtering | Middle name or initial, company plus role, profile URL slug | Narrows a common name substantially |
| Weak, non-unique | Full name alone, generic location, approximate age | Never sufficient alone |

If all the user has is a common full name, say so now and treat step 2 as the gating step
rather than a formality.

## Step 2: the four parallel passes

Run these as four narrow calls, not one broad one. A single broad name query against a rich
account returns 70,000 characters and overflows into a file dump, which is slower to work
with and buries the timeline. Parallel narrow passes return better-scored, more diverse
items (see `references/littlebird-mcp-reference.md`, retrieval patterns 1 and 2).

Substitute the subject's name for NAME, their company for COMPANY, and their email for
EMAIL in the queries below. Put the scope window in `date_range` on every call.

**Pass A, profile and identity.** `search_user_context` with
`filters: {"data_source": "snapshots"}`.

```
search_queries: [
  "NAME profile page bio followers",
  "NAME LinkedIn profile headline title",
  "NAME contact record email phone",
  "NAME COMPANY about page team"
]
standalone_query: "Every profile page, contact card, directory entry, or account page for NAME that appeared on screen, including handles, links, employer, and title."
```

**Pass B, message threads.** `search_user_context` with
`filters: {"data_source": "messages"}`.

```
search_queries: ["NAME conversation"]
search_queries_messages: [
  "NAME direct message thread",
  "messages from NAME",
  "NAME scheduling or introduction",
  "NAME COMPANY discussion"
]
standalone_query: "Every message thread involving NAME, on any platform, with send timestamps and who sent what."
```

**Pass C, screen sightings.** `search_user_context` with
`filters: {"data_source": "snapshots"}`.

```
search_queries: [
  "EMAIL",
  "NAME email inbox subject line",
  "NAME calendar invitation",
  "NAME COMPANY shared document or deck",
  "NAME notification"
]
standalone_query: "Every time NAME or EMAIL appeared on screen in any application, including inboxes, calendars, notifications, CRM records, and shared documents."
```

**Pass D, mentions by others and summaries.** `search_user_context` with
`filters: {"data_source": "summaries"}`.

```
search_queries: [
  "NAME mentioned",
  "conversation about NAME",
  "NAME introduction or referral",
  "NAME COMPANY"
]
standalone_query: "Activity summaries and daily digests referencing NAME, including secondhand mentions where NAME was discussed but not present."
```

Pass D is the cheapest compressed view of a day and is the one most likely to surface a
sighting the other three miss (see `references/littlebird-mcp-reference.md`, pattern 3).

**If the scope window is wide,** sweep month by month rather than issuing one unbounded
call. Unbounded searches dilute relevance.

## Step 3: meetings

Two tools, two different jobs, and using the wrong one is the most common mistake against
this server (see `references/littlebird-mcp-reference.md`, pattern 6).

1. `LB_INTERNAL_SEARCH_MEETINGS` with `query` set to the subject's name and company, plus
   `attendees` set to their name, plus the scope window. This searches transcripts and
   summaries by topic.
2. **Do not trust the `attendees` filter to prove attendance.** It is an OR filter and it is
   best-effort over top candidates only, so it both over-includes and misses. Confirm every
   candidate meeting with `LB_INTERNAL_GET_MEETING`, which returns the linked calendar event
   and its actual attendee list.
3. If an expected meeting does not appear, broaden or reword `query` rather than trusting
   the filter.
4. `LB_INTERNAL_GET_MEETING` returns a structured summary with `## Executive Summary`,
   `## For You`, `## Topics Discussed`, `## Decisions`, `## Action Items`, and
   `## Risks / Open Questions`. **Build on this.** Decisions and Action Items already carry
   owner attribution, which raw transcript does not.
5. Call `LB_INTERNAL_GET_MEETING_TRANSCRIPT` only when you need exact wording for a direct
   quote in the "what they told you" section. Take the WORDING from the transcript and the
   ATTRIBUTION from the summary, never the reverse.

## Step 4: identity disambiguation, the gate

This is a named step that has to pass before assembly begins, not a caveat added afterward.
The goal is confirming this is the right person, not merely finding a person (distilled
section 4). The cost of failure is stated plainly in the source literature: investigating
the wrong person of the same name leads to legal consequences, wasted work, and harassment
of an uninvolved party (distilled section 4).

**The test.** The retrieved set is ONE person when at least one of these holds:

- A strong identifier (email address or phone number) links across at least two of the four
  passes. This is the adaptation of the name-plus-email triad standard to what Littlebird
  actually captures (distilled section 4).
- A medium identifier (company plus role, or a profile URL slug) is consistent across all
  retrieved items and nothing contradicts it.
- The subject appears in a confirmed meeting whose calendar event carries their email
  address, and that email also appears in message threads or on screen.

**Failure signals, each of which forces a split or a stop:**

| Signal | Reading |
|---|---|
| Two different email addresses at unrelated companies, both under the same name | Probable collision. Split into candidate A and candidate B and ask the user which one |
| Employer or title changes with no transition evidence between them | Could be a job change or could be two people. Look for a transition sighting. If none, flag it |
| A profile whose entire footprint begins abruptly, with no earlier trail | Ambiguous between a new or private account and a fabricated one. Note it as an open question with a confidence penalty, never as an accusation (distilled section 4) |
| Handle matches but nothing else does | Handle reuse across platforms is common. Weak identifier, insufficient alone |
| Stale capture: a profile snapshot months older than the message activity | Timestamp everything and let the newest observation govern current facts, with the older one retained in the timeline (distilled section 4) |

**Report the disambiguation evidence in the dossier.** Name which identifier linked the
record together, which passes it linked across, and what was ruled out. A reader has to be
able to check that the skill assembled one person.

**If disambiguation fails,** stop and ask the user with the candidate sets laid out. Do not
assemble a merged record and flag it afterward. A merged dossier is worse than no dossier
because every downstream line inherits the error.

## Step 5: sort into a timeline

Retrieval returns items ordered by relevance, never by time. Sort by timestamp yourself
before presenting anything (`references/evidence-standards.md`, rule 8).

**The event time governs the timeline. The collection time goes in the receipt.** These are
different values for messages and they are routinely conflated. A message item is prefixed
`[Time collected || app || thread name]` and carries per-message send timestamps inside it.
The send time is when the interaction happened. The collection time is when Littlebird saw
it. A thread captured in June can contain messages sent in April, and those messages belong
in April.

Deduplicate before counting anything. OCR of dense interfaces produces repeated identical
lines, and repeated lines are one observation.

## Step 6: apply the attribution guardrail

Capture shows what the user was viewing, not necessarily what they wrote
(`references/evidence-standards.md`, rule 4). For a dossier this cuts both ways and both
matter:

- A message in a thread tagged `(From:[user])` is the user's. Everything else in that thread
  is not necessarily the subject's either. Confirm the sender before attributing a line to
  the subject.
- A transcript chunk tagged `[Others]` proves someone said it, not who. Take attribution
  from the summary's Decisions and Action Items blocks.
- Text on a profile page is what the platform displayed, which is the subject's
  self-description, which is a claim and not a fact.
- Anything a bot, an assistant, an auto-responder, or a template produced on the subject's
  behalf is not the subject's words and does not go in the direct-quote section.

Attribution is guilty until proven innocent. When in doubt, drop the line or ask.

## Step 7: partial rosters

Social and application interfaces collapse lists: "and 4 others", "12 people reacted",
"3 more". Any roster built from that capture is incomplete by construction
(`references/evidence-standards.md`, rule 5). Report the named set with receipts, report the
count of unnamed entries and where they came from, and say what would close the gap. This
matters in a dossier wherever the subject's colleagues, meeting attendees, or thread
participants get listed.

## Empty retrieval

If all four passes and the meeting search return nothing above the relevance floor, the
skill reports that and stops. Say which queries ran, over which window, and that nothing was
found. Do not proceed to external research and present it as a dossier, because a dossier
with an empty internal half is just a web search with extra ceremony, and the user should be
told that is what they would be getting rather than handed one.

If the internal half is thin but not empty, say how thin, and carry that forward: an
internal record of two sightings does not support confident claims about a relationship.

## Working data

Retrieved capture is working data. Process it, produce the dossier, delete the raw
(`references/evidence-standards.md`, rule 7). Nothing derived from another person's private
messages ends up in a committed file or a shared artifact beyond the quoted lines the
dossier needs and cites.
