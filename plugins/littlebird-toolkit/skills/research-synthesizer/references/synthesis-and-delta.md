# Synthesis and the delta

Where the two halves become one document. The already-knew versus new split is the product,
and the belief section is the part that can do the most good and the most damage.

Domain claims trace to `references/research/distilled-research-synthesis-method.md`.

## The order is the method

Narrative synthesis proceeds in four elements, in order: develop a theory, develop a
preliminary synthesis, explore relationships within and between studies, then assess the
robustness of the synthesis product (distillation section 3). The guidance exists to increase
"the transparency and reproducibility of the process" (distillation section 3).

Two rules from that order govern this whole document:

1. **Describe what each source says before reasoning across sources.** The preliminary
   synthesis comes before exploring relationships. The order is part of the method
   (distillation section 3).
2. **Robustness is assessed after the synthesis exists**, as a separate step. A synthesis is
   a thing you then evaluate, not a thing that arrives pre-validated (distillation section 3).

In practice: finish every observation section before writing a single interpretive line, and
then write the interpretation in its own fenced section where the reader can see it is
interpretation.

**Gap to state honestly.** The narrative synthesis framework assumes a corpus of research
studies and gives no rule for weighing a peer reviewed paper against a vendor blog post
against something the reader saw on screen (distillation section 3). The internal-versus-
external weighting used below is constructed by this skill, not sourced.

## Section 1. Already in your context

What the user has encountered on this topic, compressed.

**Shape:** chronological, oldest first, because the shape of an exposure history is the
useful thing and retrieval returns relevance order, not time order
(`references/evidence-standards.md`, rule 8).

| Column | Content |
|---|---|
| Date | Event date. For messages the send time, not the collection time |
| What | One line. What the material was about, not a summary of the material |
| Where | Source app and, where identifiable, the publication or thread |
| Kind | Exposure, utterance, or ambient, per `references/internal-exposure-retrieval.md` |
| Receipt | The canonical receipt format |

Then a short compression paragraph: the arc of the exposure. Where it clustered, where it
stopped, what the material was mostly about. Three or four sentences, no interpretation.

### The mandatory completeness statement

Placed in this section, not in a footnote:

> This covers what Littlebird captured on screen and in messages between DATE and DATE. It
> is not a map of what you know. Anything you read on a phone, in print, before capture
> began, or outside these windows is invisible here.

### The did-not-act observation

Maximum three items. Each stated as absence of captured evidence rather than as inaction, and
each naming the follow-through query that was run and returned nothing
(`references/evidence-standards.md`, rule 2). No editorializing. Full rules in
`references/internal-exposure-retrieval.md`.

## Section 2. New since then

External findings that postdate or extend the exposure history.

**Every line carries a URL that was actually opened.** No URL, no line. Full sourcing rules
in `references/external-sweep-and-source-grading.md`.

| Column | Content |
|---|---|
| Date | Publication or release date of the finding |
| Finding | What changed or what exists, stated as a claim if the source has an interest |
| Source | Publication name, source type, URL |
| Relation to your exposure | Postdates it, extends it, contradicts it, or predates it and was not captured |

The fourth column is the delta. Sort the section by it, with contradictions first, then
things that postdate, then extensions.

### Staleness flags

Where the user's exposure predates a significant external change, flag it explicitly and
prominently. Suggested form:

> **Possibly stale.** Your captured exposure on this ends DATE. SOURCE published a change on
> DATE that bears directly on it: ONE LINE. URL.

This is the highest-value output in the section for a fast-moving topic. Keeping up in a
fast-moving field is not a discipline problem; at reported volumes it is arithmetically
impossible, and partial exposure of unknown coverage is the normal professional state
(distillation section 6). A staleness flag is not a criticism. Frame it that way.

The archive's figures on this are all from clinical medicine and two of the three sources are
vendor content with a direct interest in the finding (distillation section 6, section 10).
Do not quote a doubling-time number or an overload percentage at the user as a measured fact.

## Section 3. Where your sources disagree

Two kinds, both required, both reported as conflicts.

### Internal against external

What the user encountered against what the sweep found. Patterns worth naming, each stated as
a possibility rather than a conclusion:

| Pattern | Possible readings |
|---|---|
| The material they read has since been superseded | Their exposure is stale; or the newer claim has not displaced the older one in practice |
| The material they read disagrees with the current consensus | They read a minority view; or the consensus moved; or the source they read was wrong at the time |
| Their exposure is entirely vendor material on one side of a debate | Search and feed dynamics put it there; not evidence of a position |
| The external sweep found nothing matching what they read | The material was niche, gated, or has been removed; or the search missed it |

### External against external

Where the sources themselves disagree. Report both readings, say which one you prefer and
why, and never smooth a conflict into a single confident claim
(`references/evidence-standards.md`, rule 10).

For each conflict, name:

- Both positions, each with its URL and source type
- What kind of disagreement it is: definitional, empirical, or about what follows from agreed
  facts. These are different problems and only the second is settled by evidence
- Whether either side has a commercial interest in its position, and which side
- The preferred reading and the reason, or an explicit statement that the archive does not
  settle it

A conflict where one side is vendor content and the other is independent is not automatically
settled, but the direction is documented: sponsored work is skewed more in what it concludes
than in what it measures (distillation section 5). Read the data, discount the framing.

## Section 4. What you appear to believe

**The section with the highest value and the highest risk in the whole skill.**

A user discovering that their working assumption is three months stale is the best thing this
skill can produce. A user being told they believe something they merely read is the worst.

### The evidence rule, applied strictly

| Evidence | Supports |
|---|---|
| The user's stated position from the scoping interview | A belief claim, at High confidence. This is the strongest evidence available |
| A message the user wrote, tagged `(From:[user])` | A belief claim, at the date they wrote it |
| A line attributed to the user in a meeting summary's owner-tagged Decisions or Action Items block | A belief claim, at the date of the meeting |
| A raw transcript chunk tagged `[Others]` | Nothing. It proves someone said it, not who (`references/littlebird-mcp-reference.md`) |
| Anything that was on screen | Exposure only. Never a belief claim |
| A pattern of repeated exposure | Interest in the topic. Not a position on it |

**A user reading a critique of an approach is not evidence they hold that view.** Neither is
reading three of them. Attribution is guilty until proven innocent, and when in doubt, drop
it or ask (`references/evidence-standards.md`, rule 4).

### How to write it

Observation, not judgment. Each item:

1. **The apparent position, in the user's own words where possible.** Quote the message or
   the meeting line verbatim rather than paraphrasing it into a proposition.
2. **The receipt and the date.** The date is doing most of the work here.
3. **What the external sweep says about it now**, with a URL.
4. **The gap, stated flatly.** "You said X on DATE. SOURCE published Y on DATE. URL." Then
   stop. No "you may want to reconsider".
5. **Confidence,** per `references/evidence-standards.md`, rule 3.

### What this section never does

- Never infers a position from reading history alone
- Never characterizes the user's beliefs in aggregate ("you seem skeptical of")
- Never assigns a motive or an emotional state
- Never tells the user what to think now
- Never includes an item where the only evidence is exposure

If there is no utterance evidence at all, write one line saying so: "No captured statement
from you on this topic in the window, so there is nothing to compare against. This section is
empty by design rather than by finding." That is a correct and honest output.

## Section 5. Open questions

What the synthesis could not settle, and what would settle it.

Each item names:

- The question
- Why it is open: no source, sources conflict, all available sources have an interest, or the
  answer is genuinely not known yet
- **What would resolve it.** A specific source to find, a person to ask, a test to run, or a
  document to obtain

An open question with no resolving action is a shrug. Do not ship those.

Include questions the user's own exposure raises. If they read something in March that
implies a decision they have not visibly made, that is an open question, phrased as a
question rather than as a prod.

## Section 6. Source list

Every source, with:

| Field | Content |
|---|---|
| Title | As published |
| URL | Opened and verified |
| Date | Publication date, or "undated" said plainly |
| Type | Primary, official documentation, independent research, journalism, practitioner, vendor, community, aggregator |
| Interest | Who published it and what they sell, or "no identified commercial interest in this question" |
| Reliability note | One line. What this source is good for and what it is not |

Head the list with the composition summary: how many of each type, and whether the available
material is dominated by parties with a commercial interest. Where it is, say so as a finding
(`references/external-sweep-and-source-grading.md`).

## Section 7. Method

The auditable record. Four things must be recorded for an AI-assisted synthesis to be
auditable: which tool, which task, which model version and prompts, and how the output was
verified (distillation section 7).

Include:

- The scope block from `references/topic-scoping.md`
- Every internal query run, verbatim, with the tool and the window
- Every external query run, verbatim, with the tool
- Sources reviewed against sources kept
- What was not covered and why

The reason this is not optional: every abbreviation in a rapid review is legitimate only when
declared and documented rather than hidden (distillation section 2), and an AI-composed search
has unknown recall and is not reproducible without its queries recorded (distillation section
7).

## The separation rule, restated because it is the whole point

Sections 1, 2, 3 and 6 are observation. Section 4 is observation about the user, which is why
its evidence rule is stricter than anywhere else. Section 5 is the honest edge of what is
known.

**No interpretive claim appears inside an observation section.** If a reading is worth making,
it goes in its own line marked as inference, naming the observations it rests on and what
would make it wrong (`references/evidence-standards.md`, rule 2).

An inference presented in the same voice as an observation is worse than either, because it
cannot be checked.

## The quiet-topic rule

If the external sweep found nothing that postdates the user's exposure, and no conflicts, and
no staleness: say so in one line and stop.

> Nothing found since your last captured exposure on DATE changes the picture. Queries run
> are in the method section.

Do not manufacture a delta. Do not restate the topic's fundamentals as though they were news.
A synthesis whose honest answer is "nothing has changed" and which says that in one line is
doing its job, and it is the output that keeps a recurring version of this skill worth
reading.

## Tone

The archive's own governing sentence for AI-assisted synthesis: "sustained human oversight,
despite its own fallibility, must remain the core principle of any AI-supported evidence
synthesis effort" (distillation section 7). The qualifier is doing real work. The statement
does not claim human review is reliable, only that it is the accountable check.

Write in a register that supports being checked. In one measurement, a tool that misidentified
134 of 200 articles "signaled a lack of confidence just fifteen times out of its two hundred
responses, and never declined to provide an answer" (distillation section 8). The error rate
was a tooling problem. The absence of hedging was a trust problem, because it removed the
reader's only cue that a claim needed checking (distillation section 8).

And trust transfers: "when AI assistants cite trusted brands like the BBC as a source,
audiences are more likely to trust the answer - even if it's incorrect" (distillation section
8). Citing a good source does not make the claim right, and a well-formatted synthesis is
more persuasive than an accurate one unless the receipts hold.
