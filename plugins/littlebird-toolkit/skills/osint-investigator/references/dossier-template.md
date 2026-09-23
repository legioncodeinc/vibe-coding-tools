# Dossier template

The exact shape of the output artifact. Seven sections, in this order. Section 2 is the
centerpiece and gets the most space.

Filename: `dossier-<subject-name-kebab-case>-<YYYY-MM-DD>.md`, written to the working
directory unless the user names another location.

Replace bracketed placeholders. Delete nothing structural: a section with no content says so
explicitly, because an empty section is a finding.

---

## Template starts here

```markdown
# Dossier: [Full Name]

**Prepared:** [YYYY-MM-DD]
**Stated purpose:** [verbatim from the purpose question: partner diligence, prospect prep,
negotiation prep, or claim verification]
**Scope window:** [verbatim from the scope question]
**Prepared by:** Littlebird osint-investigator skill, from Littlebird capture plus public sources.

This is a business due diligence brief assembled for the purpose stated above. It is not a
background check, not a consumer report, and not legal advice. Health, financial detail,
legal and criminal history, family circumstances, protected characteristics, and precise
home location are excluded by construction and were omitted even where the capture contained
them. Every internal line carries a Littlebird receipt. Every external line carries a URL and
a fetch date. Any line can be checked.

---

## 0. Identity confirmation

**Assessment:** [Confirmed single individual | Confirmed with caveats | Unresolved]

**Linking evidence:** [Which identifier tied the record together, and which retrieval passes
it linked across. Example: the email address a@b.com appears in the profile snapshot
(2026-03-02), in four message threads, and on the calendar event for the March 14 meeting.]

**Ruled out:** [Any same-name candidates found and excluded, and on what basis. "None
encountered" is a valid entry.]

**Residual risk:** [What could still be wrong. Example: no middle name or date of birth was
available, so external results for this name outside the confirmed company are marked as
unconfirmed candidates.]

---

## 1. Identity and reachability

Every handle, email, profile, and company observed, with first and last sighting.

| Identifier | Value | First seen | Last seen | Source |
|---|---|---|---|---|
| Name as displayed | [value] | [date] | [date] | [receipt or URL] |
| Email | [value] | [date] | [date] | [receipt] |
| Company | [value] | [date] | [date] | [receipt] |
| Role or title | [value] | [date] | [date] | [receipt] |
| [Platform] profile | [URL] | [date] | [date] | [receipt or URL] |
| [Platform] handle | [value] | [date] | [date] | [receipt] |

**Changes over the window:** [Any identifier that changed, with both values and the dates.
Title changes, company changes, and handle changes are material. "None observed" is a valid
entry.]

**Not found:** [Which of the standard identifiers were searched for and not observed.]

---

## 2. Relationship timeline

Every observed interaction between [Name] and you, in date order. Sorted chronologically,
not by relevance. Event time governs the ordering; collection time appears in the receipt
where it differs.

**Span:** [first interaction date] to [last interaction date]. **[N] interactions across [M]
channels.**

| Date | Channel | What happened | Receipt |
|---|---|---|---|
| [YYYY-MM-DD] | [messenger / email / meeting / calendar / screen] | [one line, factual, no interpretation] | [full receipt] |
| [YYYY-MM-DD] | [channel] | [one line] | [receipt] |

**Pattern notes:** [Cadence, gaps, who initiated where that is observable, channel shifts.
Marked as inference where it is inference. Example: contact ran weekly from March through
May and then stopped; nothing after 2026-05-30 appears in the capture, which is an absence of
capture and not necessarily an absence of contact.]

**Third parties present:** [Only those material to the stated purpose, with receipts. Where
an interface collapsed a list, give the named set, the count of unnamed entries, and where
that count came from.]

**Coverage caveat:** This timeline covers what Littlebird captured. Interactions on
uncaptured devices, in person, or by phone do not appear. It is a floor, not a complete
record.

---

## 3. What they told you

Direct quotes and stated positions from transcripts and threads, dated. Wording comes from
transcripts; attribution comes from meeting summaries.

### Claims about themselves and their company

| Date | Claim | Exact wording | Receipt |
|---|---|---|---|
| [YYYY-MM-DD] | [claim in a phrase] | "[verbatim]" | [receipt] |

### Commitments made

| Date | Commitment | To whom | Status as of [date] | Receipt |
|---|---|---|---|---|
| [YYYY-MM-DD] | [what they said they would do] | [you / a third party] | [observed done / no observation either way] | [receipt] |

### Positions stated

| Date | Topic | Position | Receipt |
|---|---|---|---|
| [YYYY-MM-DD] | [topic] | [what they said their position was] | [receipt] |

**Attribution note:** [Anything where the speaker could not be confirmed, per the attribution
guardrail. Transcript chunks tagged as unattributed prove someone said it, not who.]

---

## 4. What they tell the world

External research on the public footprint. Every line is a claim attributed to its source,
never a bare assertion.

### Public profiles

| Platform | URL | What it states | Fetched |
|---|---|---|---|
| [platform] | [URL] | [role, company, bio summary as stated] | [YYYY-MM-DD] |

### The company

| Fact as stated | Source | Fetched | Independent of the subject? |
|---|---|---|---|
| [e.g. "Their site states the company was founded in 2019"] | [URL] | [date] | [Yes, registry filing / No, self-published] |

### Coverage and mentions

| Date | Outlet | What it says | URL | Assessment |
|---|---|---|---|---|
| [date] | [outlet] | [summary] | [URL] | [Independent reporting / appears to be a placement or rewritten announcement / cannot tell] |

**Footprint depth:** [Whether the public trail is long and interconnected or begins abruptly,
and the reading. A thin footprint is ambiguous between deliberate privacy and a recently
constructed presence, and is reported as an open question, never as an accusation.]

**Searched and not found:** [Named searches that returned nothing. This is a finding about
coverage, not about the person.]

---

## 5. Reconciliation

Where the internal record and the public record are held against each other. Conflicts are
presented as conflicts and are not resolved.

### Conflicts

> **[Fact in dispute]**
>
> **Internal:** [what the capture shows] [receipt]
> **External:** [what the public source states] [URL, fetched date]
> **Status:** Unresolved conflict.
> **Possible benign explanation (inference, not a resolution):** [if one exists]
> **Routed to:** Open question [N] / Prep pack.

### Drift over time

| Fact | Earlier | Later | Reading |
|---|---|---|---|
| [fact] | [value, date, source] | [value, date, source] | [why time explains it, with the evidence that says so] |

### Stated to you, no public trace

| Claim | Receipt | What was searched | Reading |
|---|---|---|---|
| [claim] | [receipt] | [searches run] | Absence of evidence in the sources searched, not evidence of absence |

### Public, never mentioned to you

| Fact | Source | Fetched | Why it may matter to [stated purpose] |
|---|---|---|---|
| [fact] | [URL] | [date] | [relevance] |

### Agreements, with independence assessed

| Fact | Internal | External | Independent? |
|---|---|---|---|
| [fact] | [receipt] | [URL] | [Yes, second origin / No, both trace to the subject and this is one source wearing corroboration's clothes] |

---

## 6. Open questions and confidence

### Confidence by material claim

| Claim | Provenance | Corroboration | Rating |
|---|---|---|---|
| [claim] | [one sentence: what kind of evidence and who produced it] | [one sentence: what holds it up or fails to] | [High / Medium / Low] |

Ratings attach to claims, never to the person. There is no overall score for a human being.

### Open questions

1. **[Question, phrased as a question]** Why it is open: [what is missing]. What would settle
   it: [the specific artifact or answer].
2. **[Question]** ...

### Coverage disclosure

- **Internal passes run:** [profile, message threads, screen sightings, mentions by others],
  over [window].
- **Meetings:** [searched by topic and attendee; N candidates confirmed by calendar event; M
  ruled out].
- **External tools available and used:** [actual tool names].
- **External searches run:** [list].
- **Could not check:** [what and why].
- **Excluded by construction:** health, financial detail, legal and criminal history, family
  circumstances, protected characteristics, precise home location, breach data, and sanctions
  or PEP screening. See the skill's purpose-binding guide for why. Sanctions and PEP
  screening is a regulated function requiring licensed data; a specialist enhanced due
  diligence provider does that work.

---

## 7. Prep pack

[Include this section only where the stated purpose is negotiation prep, partner diligence,
or a specific upcoming meeting. Delete it for general prospect research with no scheduled
conversation.]

**For:** [meeting, negotiation, or decision this is preparing for]

### Ask them

| Question | Why | What a good answer looks like |
|---|---|---|
| [question] | [which open question or conflict it closes] | [what would resolve it] |

### Verify independently

| Item | Where to check | Why it is not settled |
|---|---|---|
| [item] | [registry, former employer, certifying body] | [what is missing] |

### Where the record is strongest

[The High-rated claims. What the user can rely on without asking.]

### Where the record is weakest

[The Low-rated claims and the unverified ones. What the user should not rely on, stated
plainly.]

### Requests to make directly

[Where a claim is unverifiable from outside, the standard remedy is asking the counterparty
for source data: logs, records, statements, references, rather than summaries and decks
(`research/distilled-due-diligence-and-osint.md`, section 5). List the specific items worth
requesting.]
```

## Template ends here

---

## Notes on filling it in

**Section 2 is the point.** It gets the most space and the most care. Other tools can produce
sections 1 and 4. Nothing else can produce section 2, because nothing else has the record of
every time this person crossed the user's screen. If section 2 is thin, say so at the top of
it and let the user decide whether the rest is worth reading.

**Sort before you write.** Retrieval is relevance-ordered. Section 2 is time-ordered. Do the
sort as a deliberate step.

**Receipts are not optional and not summarized.** Every internal line carries a real receipt
in the canonical format from `references/evidence-standards.md`. Every external line carries
a real URL and a fetch date. A line whose receipt says "from Littlebird" fails the standard
the dossier opens by promising.

**Empty sections say they are empty.** "No conflicts found between the internal and public
record across the facts checked" is a real and useful finding. Deleting the Reconciliation
section because it came out empty hides the fact that the check was run.

**Confirm before encoding.** Before writing the file, confirm the identity resolution and any
claim about to be recorded as durable fact with the user via `AskUserQuestion`
(`references/evidence-standards.md`, rule 6).

**Nothing in this artifact goes to a third party without explicit approval of the actual
text.** This is a document about an identifiable person assembled partly from private
capture. It is for the user who requested it.
