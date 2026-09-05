---
name: osint-investigator
description: "Research a person, build a dossier on someone, vet a business partner, prep for a negotiation, verify what someone told you, or brief yourself before a meeting with a named individual. Fuses your entire Littlebird record of that person, every message thread, meeting, calendar invite, and screen sighting, into a dated relationship timeline with receipts, then reconciles it against external research. Use it for partner diligence, prospect research, negotiation prep, and claim verification. Not for employment screening."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan), plus any web search and fetch tools available in the session"
---

# OSINT investigator

Point this at a name. It assembles one evidence-graded business brief from two halves: the
complete internal record of that person crossing your screen, and external research into
their public footprint. It then holds the two against each other and reports where they
disagree.

**The centerpiece is the relationship timeline.** External research tools can find anyone's
public footprint. Nothing else can produce the dated record of every interaction between
this person and you, with receipts. That section is why this skill exists, and it gets the
most space in the output.

## Purpose

Answer one question about one named person, bound to a stated business purpose, by fusing the
complete internal record of that person with external research into their public footprint,
and reporting where the two disagree rather than smoothing it over.

Four purposes, and no others: partner diligence, prospect prep, negotiation prep, claim
verification. There is no "just find everything" mode.

Three failures it exists to prevent:

1. **Scope creep into surveillance.** Diligence that runs maximum depth on everyone, unbound
   to a purpose, is not diligence. The purpose gate is step 1 for that reason.
2. **The identity merge.** A dossier assembled from two people who share a name is wrong on
   every line, and the documented cost is legal exposure, wasted work, and harassment of an
   uninvolved party.
3. **False corroboration.** A profile, a bio, a company page, an email signature, and a
   spoken self-introduction agreeing with each other is one source, not five.

## Capability gate

**List the tools available in this session and use the real tool names.** Do not assume the
names in this file are spelled the way your session spells them, and do not assume a tool
exists because it is named here.

- **Required:** the Littlebird MCP, on a Power or Pro plan. If `search_user_context` is not
  available, the MCP is not connected. Stop and tell the user. There is no degraded mode:
  without the internal half this is a web search with extra ceremony, and the user should be
  told that rather than handed one.
- **Expected:** whatever web search and fetch tools the session carries. Exa, Firecrawl, and
  a built-in search and fetch pair are all common and sessions differ. If none are present,
  produce the internal half, mark the external half and the Reconciliation section as unrun,
  and say why.
- **Plan check:** `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` if you need to explain a capability
  limit to the user.

## Littlebird MCP calls used

| Call | Used for |
|---|---|
| `search_user_context` with `filters: {"data_source": "snapshots"}` | Passes A and C. Profile pages, contact records, directory entries, handles and links, then screen sightings across inbox, calendar, notifications, CRM records, and shared documents |
| `search_user_context` with `filters: {"data_source": "messages"}` via `search_queries_messages` | Pass B. Every thread with the subject, with per-message send timestamps |
| `search_user_context` with `filters: {"data_source": "summaries"}` | Pass D. Mentions by others and daily activity digests |
| `LB_INTERNAL_SEARCH_MEETINGS` with `query` and `attendees` | Candidate meetings, by topic and by name. **`attendees` is an OR filter and best-effort over top candidates only.** It over-includes and it misses, and it never proves attendance on its own |
| `LB_INTERNAL_GET_MEETING` with `meeting_id` | The confirmation step for every candidate the search returned. Attendance comes from the linked calendar event, attribution from the Decisions and Action Items blocks |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` with `meeting_id` | Exact wording only, for a line the structured summary already located and already attributed. Never the source of attribution |
| `LB_INTERNAL_LIST_MEETINGS` with a future `end_date` | Only where the purpose is an upcoming meeting or negotiation, to locate the event the prep pack is for. Upcoming events are bare calendar entries and carry no recording |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Plan check, only when a capability limit needs explaining |

Every `search_user_context` call carries `date_range` set from the scope answer, and a wide
window is swept month by month rather than requested in one call. At most 7 queries per call.
Exact query text per pass is in `references/internal-retrieval-brief.md`.

No routine tools appear in this list. That is deliberate, and the reason is in
**Routine cadence** below.

External research runs on whatever web search and fetch tools the session actually carries.
There is no Littlebird web search tool. List the session's tools and use their real names.

## Trigger

- "research this person", "who is", "build me a dossier on", "what do we know about"
- "vet this partner", "diligence on", "before I sign with"
- "prep me for the negotiation with", "brief me before my meeting with"
- "verify what they told me", "is what they claimed true"

Four bound purposes: partner diligence, prospect prep, negotiation prep, claim verification.
The purpose is asked for before any retrieval and it scopes everything downstream.

**Not a trigger:** anything that amounts to employment screening, any request with no
business relationship behind it, and any request whose real object is a protected
characteristic. See **Guardrail**.

## Routine cadence

**None, and that is a design decision rather than a gap.** This skill runs on demand and
creates no routine, because a standing background job that periodically re-researches a
named individual is surveillance rather than due diligence. A person is looked into once,
for a stated reason, and the file is dated.

`LB_INTERNAL_CREATE_ROUTINE` works from an interactive session, so the absence here is a
refusal and not a limitation. If the user asks for a recurring watch on a person, say that
plainly and offer a fresh run when the business reason returns.

## Read before running

| File | What it carries |
|---|---|
| `references/purpose-binding-and-scope.md` | The purpose gate, the refusal cases, the exclusion list |
| `references/internal-retrieval-brief.md` | The four parallel passes, the meeting procedure, the disambiguation gate |
| `references/external-research-and-verification.md` | Search hygiene, the independence test, the claim taxonomy |
| `references/reconciliation-and-confidence.md` | The conflict rules and the two-axis confidence model |
| `references/dossier-template.md` | The exact output shape |
| `references/evidence-standards.md` | Receipts, the observed / inferred / external / unknown split, rule 10 on reporting on people |
| `references/littlebird-mcp-reference.md` | Verified tool inventory, parameters, and known limitations |
| `references/research/distilled-due-diligence-and-osint.md` | The cited domain distillation behind every method claim in this skill |

## Process

### 1. Bind the purpose. First, before any retrieval.

Run `AskUserQuestion` for the business purpose and the scope window. See
`references/purpose-binding-and-scope.md` for the exact questions and options.

Purposes: partner diligence, prospect prep, negotiation prep, claim verification.

**There is no "just find everything" mode.** The purpose scopes what gets assembled, because
scope creep is what turns due diligence into surveillance. Professional practice sets
diligence depth by risk-based tiering rather than running maximum depth on everyone, and the
GDPR necessity test holds that breadth which is merely useful rather than necessary to a
stated purpose does not qualify (distillation sections 1 and 6).

**Stop and refuse** if the purpose is employment screening (hiring, promotion, reassignment,
or retention, or an output destined for an employer), if there is no business relationship
behind the request, or if the real object is a protected characteristic. Flag and ask before
continuing on independent contractor vetting. Reasons and exact wording are in the
purpose-binding guide.

### 2. Build the identifier baseline

Ask the user for every identifier they have: full name, middle name or initial, email
addresses, company, role, phone, profile URLs. Rank them by discriminative strength before
searching. This is what keeps false positives out of everything downstream
(distillation section 4).

### 3. Retrieve the internal record: four parallel narrow passes

Not one broad query. A broad name query against a rich account returns 70,000 characters,
overflows the result limit into a file dump, and buries the timeline. Parallel narrow queries
return better-scored, more diverse items.

| Pass | Data source | Target |
|---|---|---|
| A | `snapshots` | Profile pages, contact records, directory entries, handles, links |
| B | `messages` | Every thread, with per-message send timestamps |
| C | `snapshots` | Screen sightings: inbox, calendar, notifications, CRM, shared documents |
| D | `summaries` | Mentions by others and daily activity digests |

Exact query text for each pass is in `references/internal-retrieval-brief.md`. Window every
call by the scope answer. Sweep month by month if the window is wide.

**Meetings:** `LB_INTERNAL_SEARCH_MEETINGS` with `query` and `attendees`, then **confirm every
candidate with `LB_INTERNAL_GET_MEETING`**. The `attendees` filter is an OR filter and
best-effort over top candidates only, so it both over-includes and misses, and it never
proves attendance on its own. Take wording from `LB_INTERNAL_GET_MEETING_TRANSCRIPT` and
attribution from the summary's Decisions and Action Items blocks, never the reverse.

### 4. Disambiguate identity. This is a gate, not a caveat.

Confirm you have ONE person and not a merge of two, before assembling anything. Common names
collide freely, and the documented cost of getting it wrong is legal exposure, wasted work,
and harassment of an uninvolved party (distillation section 4).

The record is one person when a strong identifier (email address, phone number) links across
at least two passes, or a medium identifier (company plus role, profile URL slug) is
consistent across everything retrieved with nothing contradicting it. Failure signals and
the split procedure are in `references/internal-retrieval-brief.md`.

**If disambiguation fails, stop and ask the user** with the candidate sets laid out. Never
assemble a merged record and flag it afterward, because every downstream line inherits the
error.

**Report the disambiguation evidence in the dossier.** Section 0 of the template exists for
this. Name what linked the record, what was ruled out, and what residual risk remains.

### 5. Sort into the timeline

Retrieval is relevance-ordered. The timeline is time-ordered. Sort by timestamp as a
deliberate step. **The event time governs the ordering and the collection time goes in the
receipt.** For messages these are different values and conflating them scrambles the
timeline. Deduplicate first: OCR of dense interfaces repeats lines, and repeated lines are
one observation.

### 6. Research the public footprint

Bound by the purpose, using the session's actual web tools. Quote the name, pair it with a
medium-strength identifier on every query, timestamp every finding at fetch time, and capture
the URL rather than a description of it. Tie every external result back to the same person
using the strong identifiers from the internal half.

**Report external claims as claims.** "Their site says X", never "X". This is not pedantry:
it is what makes step 7 legible, because a conflict between "their site says 2019" and a
receipt of them saying 2021 is readable, while a conflict between two bare assertions is just
a contradiction the reader has to untangle.

### 7. Reconcile

Pair internal claims to external claims fact by fact. Classify each pair: agreement,
conflict, drift over time, internal only, external only, or unverifiable.

**Conflicts stay conflicts.** Never resolve a disagreement by picking the more interesting
reading, or the more recent, official, or convenient one, unless there is an actual reason
and the reason is stated. Surfacing a discrepancy between what someone says and what the
record shows is a standard, expected diligence artifact, not an adversarial move
(distillation section 1).

**Check every agreement for false corroboration.** The subject's profile, bio, company page,
email signature, and spoken self-introduction all originate with the subject. Five agreeing
artifacts is one source. Corroboration requires a second origin, not a second surface, and
this is the documented failure mode where consistent accounts turn out to be consistently
wrong (distillation section 3).

### 8. Rate confidence, per claim

Two axes, each justified in its own sentence, rolled into High, Medium, or Low.

- **Provenance:** primary observed, primary self-reported, secondary third-party,
  fragmentary, or inferred.
- **Corroboration:** independently corroborated, single origin multiply surfaced,
  uncorroborated, contested, or unresolvable.

The two-axis structure is adapted from the Admiralty source-grading model. The published
letter grades are deliberately not shipped, because 87% of ratings collapse onto the
diagonal in practice, grade boundaries carry no shared referent, and key terms are never
operationalized (distillation section 2). Requiring a separate sentence per axis is the
countermeasure: it makes the collapse visible to the reader.

**Rate claims, never the person.** There is no overall confidence score for a human being.

### 9. Write the artifact

Confirm the identity resolution and any durable fact with the user via `AskUserQuestion`
before writing (`references/evidence-standards.md`, rule 6). Then produce the file.

## Output

**One markdown file: `dossier-<subject-name-kebab-case>-<YYYY-MM-DD>.md`,** written to the
working directory unless the user names another location. Full structure in
`references/dossier-template.md`.

Sections, in order:

0. **Identity confirmation.** The disambiguation evidence and residual risk.
1. **Identity and reachability.** Every handle, email, profile, and company observed, with
   first and last sighting dates.
2. **Relationship timeline.** Every interaction in date order with source, receipt, and a
   one-line summary. Chronological, not relevance-ordered. **The centerpiece.**
3. **What they told you.** Dated direct quotes from transcripts and threads. Their claims,
   commitments, and stated positions.
4. **What they tell the world.** The public footprint, their company, their claims, each
   cited to a URL with a fetch date.
5. **Reconciliation.** Conflicts, drift, internal-only, external-only, and agreements with
   independence assessed. Conflicts left as conflicts.
6. **Open questions and confidence** per material claim, plus the coverage disclosure.
7. **Prep pack.** Only where the purpose is a meeting or negotiation: what to ask and what to
   verify.

## Guardrail

**This skill reports on a human being, and the risk it carries is that a careful-looking
document quietly becomes something the subject never consented to and the law never
sanctioned.** Everything below holds that line, and none of it is negotiable.

**Purpose binding is mandatory and it comes first.** No purpose, no retrieval. The purpose
scopes what gets assembled, because scope creep is what turns due diligence into
surveillance. Breadth that is merely useful rather than necessary to the stated purpose does
not qualify under the GDPR necessity test (distillation sections 1 and 6).

**This is not for employment screening.** Stop and refuse where the purpose is hiring,
promotion, reassignment, or retention, or where the output is destined for an employer.
Refuse where no business relationship sits behind the request, and where the real object is a
protected characteristic. Flag and ask before continuing on independent contractor vetting.
Exact wording is in `references/purpose-binding-and-scope.md`.

**External claims are reported as claims, never as fact.** "Their site says X", never "X".
That phrasing is what makes the Reconciliation section readable at all.

**Conflicts stay conflicts.** Never resolve a disagreement by picking the more interesting,
more recent, more official, or more convenient reading, unless there is an actual reason and
the reason is stated on the line.

**Rate claims, never the person.** There is no overall confidence score for a human being.

**Provenance on every line.** Internal claims carry a Littlebird receipt in the canonical
format. External claims carry a URL and a fetch date. A reader can check any line. A line
whose receipt reads "from Littlebird" fails the standard the dossier opens by promising.

**Sensitive categories are excluded by construction,** and are omitted even when the capture
contains them: health, financial detail, legal and criminal history, family circumstances,
protected characteristics, precise home location, breach and compromised credential data,
and sanctions or PEP screening. Standard OSINT workflows include several of these and this
skill deliberately does not (distillation section 6). If an excluded item surfaces during
retrieval, drop it. Do not carry it into working notes and do not mention that something was
withheld, because a line saying health information was omitted is a disclosure of health
information.

Sanctions and PEP screening is a regulated function requiring licensed data. Say so and point
the user to a specialist enhanced due diligence provider.

**Third parties are incidental.** Other people appear in the capture around the subject.
Include them only where material to the stated purpose, and apply the same evidence standards
and the same exclusions to them.

**Empty retrieval ends the run.** If the four passes and the meeting search return nothing,
report which queries ran over which window, say nothing was found, and stop. Do not proceed
to external research and present the result as a dossier. If the internal half is thin but
not empty, say how thin, and carry that limitation into every claim resting on it.

**Absence is not a finding.** "No evidence found in the sources searched" and "it did not
happen" are different claims and only the first is supportable.

**Raw capture never ships.** Retrieved material is working data. Process it, produce the
dossier, delete the raw. Nothing goes to a third party without explicit approval of the
actual text.

**Not legal advice.** The research archive behind this skill covers US and EU frameworks and
contains no case law on the business-vetting boundary (distillation section 7). Say so where
it matters.

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

## Related skills

| Skill | Relationship |
|---|---|
| `pre-call-prep` | Lighter and per-meeting. Run it before a call; run this when a named individual needs the full purpose-bound dossier |
| `client-health-radar` | Watches the state of an account over time, where this looks at one person once, for a stated reason |
| `deal-pipeline-reconstructor` | Rebuilds the deal history around a company, and supplies the commercial context a negotiation-prep dossier sits inside |
