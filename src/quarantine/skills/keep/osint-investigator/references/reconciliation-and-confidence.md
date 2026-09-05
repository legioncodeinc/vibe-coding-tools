# Reconciliation and confidence

Where the internal record and the external record are held against each other, and where
every material claim gets a rating a reader can argue with. This is the section that earns
the phrase "evidence graded". Without it the dossier is two lists side by side.

Domain claims trace to `research/distilled-due-diligence-and-osint.md`, sections 1, 2, 3,
and 7.

## Why reconciliation is a standard artifact, not an accusation

The canonical red flag in professional third-party diligence is a "discrepancy between
self-reported and independently verified information", and a diligence file is expected to
contain verification records comparing independent investigation against the counterparty's
own claims (distilled section 1). Surfacing the gap between what someone says and what the
record shows is the expected output of the process. It is not an adversarial flourish and it
does not need to be softened.

## The reconciliation procedure

Work claim by claim, not source by source.

**Step 1. Extract the claim set.** From the internal half, every assertion the subject made
about themselves, their company, their role, their history, their commitments, and their
positions, each with its receipt and date. From the external half, every corresponding
public statement with its URL and fetch date.

**Step 2. Pair them.** Match internal claims to external claims about the same fact. Most
will pair. Some internal claims will have no external counterpart and some external claims
will have no internal counterpart, and both of those are findings.

**Step 3. Classify each pair.**

| Class | Definition | How it is written |
|---|---|---|
| **Agreement** | Internal and external say the same thing | State it once, cite both, and note whether they are actually independent (see below) |
| **Conflict** | They say different things about the same fact | Both readings, both receipts, explicitly labeled a conflict. Not resolved |
| **Drift** | They differ and the difference is explained by time | State both with dates and say which is current and why |
| **Internal only** | Said to the user, no public trace | State it, note the absence, say what was searched |
| **External only** | Public, never mentioned to the user | State it. For negotiation and partner purposes this is often the most useful line in the dossier |
| **Unverifiable** | Neither side has independent support | State it as an open question, route it to the prep pack |

**Step 4. Check agreements for false corroboration.** An agreement between the subject's
statement to the user and the subject's public profile is not corroboration, because both
originate with the subject. Four agreeing self-descriptions is one source (distilled section
3). Run the independence test from
`references/external-research-and-verification.md` on every agreement before crediting it.
An agreement that survives the test is strong evidence. An agreement that fails it is a
single-origin claim wearing corroboration's clothes, and it is written that way.

## Conflicts stay conflicts

**Never resolve a disagreement between sources by picking the more interesting reading.**
Never resolve one by picking the more recent, the more official, or the more convenient one
either, unless there is an actual reason and the reason is stated.

The permitted moves on a conflict:

1. **Present both** with full receipts on each side, labeled as a conflict.
2. **Name the most likely benign explanation** if one exists, marked as an inference and not
   as a resolution. Job changes, company renames, rounding, informal versus legal entity
   names, and simple misspeaking are all common and none of them are established just
   because they are plausible.
3. **Route it to the prep pack** as something to ask about.

The forbidden move is writing one side as the fact and the other as an error. If the
evidence genuinely settles it, then it is not a conflict and it belongs in Drift with the
settling evidence shown.

A conflict is also not a character judgment. "Their site says the company was founded in
2019 and they said 2021 in the March call" is the finding. "They are inconsistent about
their founding date" is editorializing, and "they lied about their founding date" is an
accusation the evidence does not support.

## The confidence model

Adapted from the two-axis Admiralty structure, with the published letter grades deliberately
discarded.

**Why the structure is kept.** "Where did this come from" and "does it hold up" are genuinely
different questions, and evaluating them separately is the point of the design. The named
common mistake in the source material is assuming a reliable source automatically means
credible information (distilled section 2).

**Why the letter grades are discarded.** The published scale's central independence
assumption fails empirically: 87% of ratings collapse onto the diagonal, meaning analysts do
not in fact rate the two axes separately. Grade boundaries carry no numeric anchor and are
read inconsistently even between NATO member states. Key terms in the definitions are never
operationalized. Cross-axis ordering is undefined, so nobody can say whether B3 beats C2
(distilled section 2). A dossier reader who sees "C2" learns nothing reliable. Note that the
87% figure is single-sourced in this archive, read through a practitioner summary rather than
the original paper (distilled section 7), so it is directionally decisive rather than
precise. It does not need to be precise to justify not shipping letter codes.

### Axis one: provenance

What kind of thing is this, and who produced it. Stated in a sentence, not a code.

| Provenance | Examples |
|---|---|
| Primary observed | A Littlebird receipt of the event itself: the calendar invite, the transcript line, the message as sent |
| Primary self-reported | The subject stating it, in any channel, on screen or in transcript or on their own site |
| Secondary third-party | A registry filing, an independent article, another organization's own record |
| Fragmentary | An OCR fragment, a collapsed interface list, an item the retrieval scored 3 |
| Inferred | A conclusion drawn by combining observations, with the observations named |

### Axis two: corroboration

Whether it holds up. Stated in a sentence, not a code.

| Corroboration | Meaning |
|---|---|
| Independently corroborated | At least two sources that pass the independence test agree |
| Single origin, multiply surfaced | Several artifacts agree but all trace to one origin, usually the subject |
| Uncorroborated | One observation, nothing else either way |
| Contested | Sources disagree. Cross-reference the conflict |
| Unresolvable from available evidence | Looked, found nothing that could settle it |

**Both axes get their own sentence.** Requiring separate justifications is the specific
countermeasure against the diagonal-collapse failure, because it makes the collapse visible
to the reader when it happens (distilled section 2).

### The rating that ships

Roll the two axes into the marketplace-standard High, Medium, Low
(`references/evidence-standards.md`, rule 3), and show the two axes beneath it so the rating
is auditable rather than asserted.

| Rating | When |
|---|---|
| **High** | Primary observed provenance, or primary self-reported plus genuine independent corroboration. Multiple independent observations agree |
| **Medium** | One clear observation with no corroboration, or several weak ones pointing the same way. Also: single origin, multiply surfaced, however many surfaces there are |
| **Low** | Fragmentary provenance, a single item scored 3, a reading that depends on interpreting ambiguous interface text, or anything contested |

A Low-rated claim never drives an irreversible action. If the user is about to sign, send, or
commit on the strength of a claim, that claim is High or the skill asks first
(`references/evidence-standards.md`, rules 3 and 6).

**Rate the claim, not the person.** Every rating attaches to a specific statement about a
specific fact. There is no overall confidence score for a human being, and inventing one
would be exactly the algorithmic-assessment shape that regulators treat as a report about a
person rather than a record of evidence (distilled section 6).

## Open questions

Everything that came out Unverifiable, Contested, or Low-rated becomes an open question.
Write each as a question, not as a suspicion:

- Good: "The March 4 transcript has them describing the team as 14 people; the company site
  lists 6 on its team page as of the 2026-08-17 fetch. What is the current headcount and
  does the site page cover contractors?"
- Bad: "Headcount claims appear inflated."

The first is answerable and the answer might well be mundane. The second has already reached
a conclusion the evidence does not carry, and it is the exact move the conflict rule
forbids.

## Coverage disclosure

Name what was searched and came back empty. This is not an apology, it is part of the
artifact: clear records of what was examined are what make a diligence file defensible, and
two independent sources in the archive agree on this point (distilled section 1).

State the passes run, the date window, the external searches attempted, the tools available,
anything that could not be checked and why, and the categories excluded by construction with
a pointer to `references/purpose-binding-and-scope.md` for the reason.

Absence of evidence is written as absence of evidence, never as evidence of absence
(`references/evidence-standards.md`, rule 2).
