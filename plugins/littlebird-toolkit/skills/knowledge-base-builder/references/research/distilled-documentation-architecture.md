# Distilled: documentation architecture for a project knowledge pack

Written from a fresh read of the 18 files in `raw/`. Every claim ends in a bracketed
pointer to the raw file it came from. A claim with no pointer is not in this file. Where a
raw file's own evidence is weak, that is stated inline rather than smoothed over.

Sweep date: 2026-08-17. Window: sources range from 2011 (the Nygard primary) to 2026. The
6-month default window was deliberately exceeded for the four foundational primaries
(Nygard 2011, MADR 4.0 from 2024, the two academic papers from 2020 and 2024), because the
formats and the empirical findings are the stable part of this domain and there is no newer
replacement for them.

---

## 1. One document, one mode

Diataxis derives four documentation modes from two axes: action versus cognition, and
acquisition versus application. Tutorials and how-to guides inform action; reference and
explanation inform knowledge. Tutorials and explanation serve acquiring a skill; how-to
guides and reference serve applying one already held
[raw/docs-architecture--diataxis--diataxis-official.md].

The framework's central claim is about failure, not taxonomy: "Crossing or blurring the
boundaries described in the map is at the heart of a vast number of problems in
documentation" [raw/docs-architecture--diataxis--diataxis-official.md].

**How far this transfers.** Diataxis is written for user-facing product documentation. A
project knowledge pack is a different genre and the source does not claim to cover it
[raw/docs-architecture--diataxis--diataxis-official.md]. What transfers is the boundary
rule. The mapping used by this skill:

| Pack artifact | Diataxis mode | Why |
|---|---|---|
| Glossary | reference | Propositional facts, structured to mirror the vocabulary |
| Architecture notes, system overview and data model | reference | Facts about what exists |
| Product requirements document | reference plus a stated goal | Facts about what must be true, not how to build it |
| Decision records | explanation | Context and reasoning, serving understanding |
| Brand or positioning brief | explanation | Why the product is framed this way |
| Contradictions and open questions register | none of the four | A working artifact, not documentation; see section 6 |

The Diataxis site prescribes incremental application: look at what exists, pick one thing to
improve, do it, repeat, without a wholesale restructure
[raw/docs-architecture--diataxis--diataxis-official.md]. That matches a pack built from
whatever capture happens to exist.

---

## 2. Decision records: two formats, one lifecycle

### Nygard, the original

Five sections: Title (a short noun phrase), Status, Context, Decision, Consequences
[raw/adr--nygard-format--cognitect-2011.md].

Section rules from the primary source:

- **Context** carries the forces at play, technological, political, social, and
  project-local, in neutral factual language that shows the tension between competing
  concerns rather than arguing for the outcome [raw/adr--nygard-format--cognitect-2011.md].
- **Decision** is written in full sentences, active voice, phrased "We will ..."
  [raw/adr--nygard-format--cognitect-2011.md].
- **Consequences** lists everything that follows, positive, negative, and neutral
  [raw/adr--nygard-format--cognitect-2011.md].

The problem it exists to solve: a newcomer to a project either accepts a past decision
without understanding it or reverses it without understanding what it was holding up. Nygard:
"if the project accumulates too many decisions accepted without understanding, then the
development team becomes afraid to change anything and the project collapses under its own
weight" [raw/adr--nygard-format--cognitect-2011.md].

### MADR

Eight sections, five of them optional: Context and Problem Statement, Decision Drivers
(optional), Considered Options, Decision Outcome, Consequences (optional), Confirmation
(optional), Pros and Cons of the Options (optional), More Information (optional)
[raw/adr--madr-template--adr-github-2024.md].

Optional YAML frontmatter: `status`, `date`, `decision-makers`, `consulted`, `informed`
[raw/adr--madr-template--adr-github-2024.md]. Version 4.0.0 shipped 2024-09-17 and added
bare and minimal variants so a small decision does not carry all eight sections
[raw/adr--madr-template--adr-github-2024.md].

MADR's stated goal is to make any important decision easy to record and to version, which is
why the acronym broadened from Architectural to Any
[raw/adr--madr-template--adr-github-2024.md].

### Y-statement

One sentence with five slots: in the context of USE CASE, facing CONCERN, we decided for
OPTION to achieve QUALITY, accepting DOWNSIDE. An extended form adds a because clause
[raw/adr--templates-overview--adr-github.md].

### Choosing between them

No source ranks them. `adr.github.io` catalogues all three and explicitly gives no selection
guidance and no canonical status lifecycle [raw/adr--templates-overview--adr-github.md]. The
observable difference: MADR keeps Considered Options and Pros and Cons as first-class
sections, so the rejected alternatives survive; Nygard folds all of that into Context
[raw/adr--madr-template--adr-github-2024.md].

For material reconstructed from meetings this matters concretely. A meeting where three
options were argued produces MADR content. A meeting where a decision was announced produces
Nygard content at best and a Y-statement at worst. Selecting the format by how much the
capture actually supports is this skill's own design decision, not a researched finding.

### Lifecycle and immutability

Four statuses, consistent across the primary and the practitioner source: Proposed, Accepted,
Deprecated, and Superseded by ADR-NNNN
[raw/adr--nygard-format--cognitect-2011.md, raw/adr--operational-practice--konishi-2026.md].

- Proposed is the only mutable state. Accepted is immutable
  [raw/adr--operational-practice--konishi-2026.md].
- Numbers are assigned monotonically and never reused, even for a deprecated record
  [raw/adr--operational-practice--konishi-2026.md].
- A reversed decision is not edited or deleted. The old record stays and is marked
  superseded, with the replacement's number in the status field so the chain is traversable
  forward [raw/adr--nygard-format--cognitect-2011.md,
  raw/adr--operational-practice--konishi-2026.md].

**This is the single most important structural finding for this skill.** The supersession
chain is a native, standard, widely understood way to represent "the answer changed on this
date and here is what it was before". A recency-wins rule with an audit trail is not an
invention; it is how decision records already work.

### File naming and index

`NNNN-kebab-case-title.md` in `docs/adr/` or `docs/decisions/`, for example
`0014-store-sessions-in-postgres.md` [raw/adr--operational-practice--konishi-2026.md]. An
index file listing every record by number, title, and status is required, because without it
"the directory is a wall of filenames that nobody can navigate"
[raw/adr--operational-practice--konishi-2026.md].

### What earns a record

"ADRs are for decisions that are hard to reverse, that span multiple components, or that
materially affect operability or security. A formatter choice is not an ADR. A datastore
choice is" [raw/adr--operational-practice--konishi-2026.md]. The opposite failure is also
named: only cosmic decisions recorded, with the load-bearing middle layer missing
[raw/adr--operational-practice--konishi-2026.md].

### Anti-patterns

Seven, from the practitioner source: momentum dies after the first five records; trivia
recorded while load-bearing decisions are skipped; advocacy documents that hide the
tradeoffs; silent edits to accepted records, which breaks the audit trail; storage in a wiki
nobody checks; decision drift where the system changes and the record does not; and a single
owner, so the practice lapses when that person leaves
[raw/adr--operational-practice--konishi-2026.md].

Evidence note: that source is one practitioner's experience with no disclosed measurement
[raw/adr--operational-practice--konishi-2026.md]. Its naming, numbering, and lifecycle
conventions agree with the Nygard primary and are corroborated
[raw/adr--nygard-format--cognitect-2011.md]. The cadence and the anti-pattern list are not.

---

## 3. What makes a requirements document useful rather than a wish list

A 14-section anatomy: Overview and Context, Goals and Success Metrics, Users and Use Cases,
Scope, Functional Requirements, Acceptance Criteria, Non-Functional Requirements, Design and
UX, Analytics and Telemetry, Dependencies and Constraints, Risks and Assumptions, Rollout and
Ops, Open Questions, Changelog [raw/prd--structure--shauchenka-2026.md].

The diagnosis: "Most costly rework doesn't come from buggy code - it comes from unclear
intent" [raw/prd--structure--shauchenka-2026.md]. The named failure shape is a wish list or a
spec dump written without clarity about who it serves and what outcome it moves
[raw/prd--structure--shauchenka-2026.md].

Three practices named as separating good from bad
[raw/prd--structure--shauchenka-2026.md]:

1. Lead with outcomes. "Your PRD should begin with the user problem and the business
   outcome, not with interface details or database fields."
2. Write testable acceptance criteria in Given / When / Then form. Vague criteria are named
   as a specific pitfall.
3. Enumerate non-functional requirements explicitly, using ISO/IEC 25010 as a checklist.
   Omitting them is "a recipe for rework".

The specificity rule: prefer specific thresholds over adjectives, with a p95 response time
stated as a millisecond figure as the good example and the word "fast" as the bad one
[raw/prd--structure--shauchenka-2026.md]. The original renders the threshold with a less-than
sign, written out in words here so this archive stays free of angle brackets
[raw/prd--structure--shauchenka-2026.md].

**Why the specificity rule is doubly useful here.** It is also a test of the source material.
If the capture never contained a number, the requirement cannot honestly be written with one,
and that absence is a finding rather than a hole to fill with an adjective. That inversion is
this skill's reading, not the source's.

**Named gap: non-goals.** This source does not use the term. It carries the same idea under
Scope, split into in and out [raw/prd--structure--shauchenka-2026.md]. No source in this
archive establishes an explicit Non-Goals heading as researched practice. The archive
supports "state what is out of scope"; the specific heading is a convention this skill
adopts, and it is labelled as one.

Evidence quality: practitioner opinion, internally consistent, one external standard
referenced, no measurement of PRD quality against project outcomes
[raw/prd--structure--shauchenka-2026.md].

---

## 4. Documentation as context for a model: what is actually evidenced

This is where the archive is most uneven, and the honest answer is that most of the
circulating advice is convention.

### Evidenced, with a stated mechanism

**Context is a budget and more is not better.** As the token count in the context window
grows, the model's ability to recall accurately from that context decreases. The stated
architectural reason: transformer attention forms n squared pairwise relationships for n
tokens, so attention thins as context grows
[raw/ai-ingestion--context-engineering--anthropic-2025.md]. The governing principle offered is
"the smallest possible set of high-signal tokens that maximize the likelihood of some desired
outcome", immediately qualified with "minimal does not necessarily mean short; you still need
to give the agent sufficient information"
[raw/ai-ingestion--context-engineering--anthropic-2025.md].

The context rot claim is presented without an inline citation in the fetched text, so it is
vendor guidance with a stated mechanism rather than a cited study
[raw/ai-ingestion--context-engineering--anthropic-2025.md].

**Ambiguity is not resolvable by the reader.** "If a human engineer can't definitively say
which tool should be used in a given situation, an AI agent can't be expected to do better"
[raw/ai-ingestion--context-engineering--anthropic-2025.md]. Generalized: an ambiguity a human
would resolve by asking a colleague is one a model resolves by guessing.

**Self-contained sections retrieve better than dependent fragments.** Both methods that beat
naive chunking in the retrieval study work by injecting document-level context back into a
fragment that lost it at the split: late chunking embeds the whole document before
segmenting, contextual retrieval prepends a situating summary to each chunk
[raw/retrieval--chunk-context--arxiv-2504-19754.md].

The measured gains are small and inconsistent, and this must be stated: contextual retrieval
with rank fusion reached NDCG at 5 of 0.317 against 0.312 without fusion; late chunking beat
early chunking generally but not always, and on NFCorpus with BGE-M3 early chunking won
[raw/retrieval--chunk-context--arxiv-2504-19754.md]. The reranking step is described as
crucial to realizing any consistent gain
[raw/retrieval--chunk-context--arxiv-2504-19754.md]. Dynamic segmentation helped but cost 2 to
4 times the processing time [raw/retrieval--chunk-context--arxiv-2504-19754.md].

The study is about automated chunking of existing prose, not about how a person should write
[raw/retrieval--chunk-context--arxiv-2504-19754.md]. It supports the general principle that a
section which stands alone survives retrieval better than one depending on a distant
antecedent. It does not license confident claims about writing style.

**Internal vocabulary is by construction absent from the model's prior.** The mechanisms are
coherent: an undefined internal coinage cannot be resolved from parametric knowledge because
it was never in training data; a term appearing in three casing or punctuation variants
fragments retrieval, because documents about one concept stop looking related; a query using
the acronym misses a document using the expanded form
[raw/glossary--acronyms-rag--shelf-2026.md].

That is the argument for a project glossary. Note what it is not: it is not "models like
glossaries". It is that private vocabulary either gets defined or gets guessed
[raw/glossary--acronyms-rag--shelf-2026.md].

**Predictable file shape enables selective loading.** Agents are advised to hold lightweight
identifiers and load data at runtime through tools rather than preloading everything
[raw/ai-ingestion--context-engineering--anthropic-2025.md]. Cloudflare's agent markdown
serves a fixed three-part layout, frontmatter metadata then body then structured data, in a
constant order so a consumer can rely on position
[raw/ai-ingestion--markdown-for-agents--cloudflare-docs.md]. The value being demonstrated is
predictability, not markdown as such.

### Measured, narrowly

Token reduction from HTML to markdown is exposed per page through the `x-markdown-tokens` and
`x-original-tokens` response headers, which is a real measurement surface rather than a
blanket ratio [raw/ai-ingestion--markdown-for-agents--cloudflare-docs.md]. The vendor's
accompanying "resulting in better results" clause is an assertion
[raw/ai-ingestion--markdown-for-agents--cloudflare-docs.md].

### Asserted, not evidenced

State this plainly wherever this skill relies on it.

| Common advice | Status in this archive |
|---|---|
| Clear heading hierarchies | asserted, no source [raw/ai-ingestion--llm-friendly-docs--fern-2026.md] |
| Self-contained sections under headings | asserted in the vendor source [raw/ai-ingestion--llm-friendly-docs--fern-2026.md], independently supported in mechanism by [raw/retrieval--chunk-context--arxiv-2504-19754.md] |
| Do not spread one concept across sections | asserted, no source [raw/ai-ingestion--llm-friendly-docs--fern-2026.md] |
| State relationships explicitly rather than implying them | asserted, no source [raw/ai-ingestion--llm-friendly-docs--fern-2026.md] |
| Explicit type and error definitions | asserted, no source [raw/ai-ingestion--llm-friendly-docs--fern-2026.md] |
| Markdown cuts tokens by over 90 percent | asserted with no method or sample [raw/ai-ingestion--llm-friendly-docs--fern-2026.md]; directionally consistent with the per-page headers in [raw/ai-ingestion--markdown-for-agents--cloudflare-docs.md] but the specific figure is unbacked |
| Publish llms.txt | the spec argues from context window cost and extraction noise [raw/ai-ingestion--llms-txt--llmstxt-org.md], and reports wide adoption, but presents no measurement that a model answers better given it [raw/ai-ingestion--llms-txt--llmstxt-org.md] |
| 70 percent of three-letter acronyms are ambiguous | no attribution, no methodology, do not repeat [raw/glossary--acronyms-rag--shelf-2026.md] |
| Markdown headings versus XML tags | the vendor guidance offers them as alternatives and ranks neither [raw/ai-ingestion--context-engineering--anthropic-2025.md] |

**The corpus study that publishes no numbers.** The GitHub piece is headlined on more than
2,500 repositories and reports five practices: commands early with flags, code examples over
prose, explicit boundaries about what must never be touched, version-specific stack naming,
and six coverage areas that put a file in the top tier
[raw/ai-ingestion--agents-md-corpus--github-blog-2026.md]. It publishes no median length, no
section frequency, no tier comparison, and no criterion for "top tier"
[raw/ai-ingestion--agents-md-corpus--github-blog-2026.md]. It is a large-sample qualitative
observation reported as a list of opinions, better grounded than pure assertion because
someone looked at a corpus, and it should not be cited as a measurement
[raw/ai-ingestion--agents-md-corpus--github-blog-2026.md].

The two items from it with the clearest mechanism and the clearest analogue in a project
pack: name the specific version of the thing the project actually uses, and say plainly what
is out of scope [raw/ai-ingestion--agents-md-corpus--github-blog-2026.md].

### Named gap

No source in this archive measures the effect of document structure on downstream task
performance for a human-authored project knowledge base. The closest is the chunking study,
which measures retrieval metrics on public benchmark corpora rather than task success on
private project documents [raw/retrieval--chunk-context--arxiv-2504-19754.md]. Anyone claiming
a specific structure makes AI sessions measurably more productive is, on this archive,
asserting it.

---

## 5. Conflicting sources: the strongest evidence in this archive

This section carries the load for the contradiction register, and unlike section 4 it rests
on peer-reviewed measurement.

### Models do not surface contradictions unprompted

WikiContradict, NeurIPS 2024 Datasets and Benchmarks track. 253 human-annotated instances
built from roughly 1,200 Wikipedia articles that editors had tagged as inconsistent, filtered
and validated down [raw/contradiction--wikicontradict--neurips-2024.md]. Annotations record
semantic type, modality, origin (same or different article), and reasoning type, explicit
versus implicit [raw/contradiction--wikicontradict--neurips-2024.md].

The question tested is not which answer the model picks. It is whether the answer reflects
the conflict at all [raw/contradiction--wikicontradict--neurips-2024.md].

Finding, quoted: "When provided with two passages containing contradictory facts, all models
struggle to generate answers that accurately reflect the conflicting nature of the context"
[raw/contradiction--wikicontradict--neurips-2024.md].

Correct-response rates under the prompt that **explicitly instructs the model to attend to
contradictions** [raw/contradiction--wikicontradict--neurips-2024.md]:

| Model | Correct |
|---|---|
| Llama-3-70b-instruct | 43.8 percent |
| Mistral-7b-instruct | 20.8 percent |
| GPT-4 | 10.4 percent |

Llama-3-70b-instruct rose from 10.4 to 43.8 percent once told to look for contradictions, and
the gain landed mostly on explicit cases
[raw/contradiction--wikicontradict--neurips-2024.md]. Every model except Flan-ul2 did better
on explicit contradictions than on implicit ones needing inference
[raw/contradiction--wikicontradict--neurips-2024.md].

Three consequences follow directly:

1. A model handed conflicting material usually produces a confident single answer rather than
   flagging the conflict [raw/contradiction--wikicontradict--neurips-2024.md].
2. Explicit instruction to look for conflicts helps substantially, so detection must be a
   named step and not a hoped-for side effect
   [raw/contradiction--wikicontradict--neurips-2024.md].
3. Even when instructed, the best measured rate was under 50 percent, so detection cannot be
   left to the same pass that writes the document, and the resolution needs a human
   [raw/contradiction--wikicontradict--neurips-2024.md].

### An unresolved conflict degrades surrounding performance

Context-memory conflict study, arXiv preprint, three 7B-class models across five task
families under three conditions: no contradiction, high plausibility contradiction, low
plausibility contradiction [raw/contradiction--knowledge-conflict--arxiv-2506-06485.md].

- Mistral-7B on contextual knowledge tasks: 65.3 percent under no contradiction against 43.5
  percent under low plausibility contradiction, a drop of 21.8 percentage points
  [raw/contradiction--knowledge-conflict--arxiv-2506-06485.md].
- The ordering no-contradiction, then high-plausibility, then low-plausibility held
  consistently [raw/contradiction--knowledge-conflict--arxiv-2506-06485.md].
- The ordering persisted even when the model was explicitly told to ignore its internal
  knowledge [raw/contradiction--knowledge-conflict--arxiv-2506-06485.md].
- With conflicting passages presented at once, accuracy was at least 10 percent higher on the
  more plausible pairing [raw/contradiction--knowledge-conflict--arxiv-2506-06485.md].
- Human and model agreement fell to kappa 0.79 against kappa 0.90 between human annotators,
  so conflict makes evaluation harder too
  [raw/contradiction--knowledge-conflict--arxiv-2506-06485.md].

Caveats stated in the raw file: preprint status, and all models in the 7B class, so the
absolute numbers do not transfer to frontier models. The direction is the durable part
[raw/contradiction--knowledge-conflict--arxiv-2506-06485.md].

**The conclusion that shapes this skill.** A pack containing an unresolved contradiction does
not merely fail on the contradicted question. It degrades performance on surrounding work,
and the model does not signal that it is degraded
[raw/contradiction--knowledge-conflict--arxiv-2506-06485.md]. Combined with the finding that
models rarely surface the conflict on their own
[raw/contradiction--wikicontradict--neurips-2024.md], the case for resolving conflicts before
the pack ships, rather than annotating them and moving on, is as evidenced as anything in
this archive.

---

## 6. Staleness: what actually rots

146 practitioners across two surveys, 125 from ABB and 21 from online forums, 88 of them with
more than 10 years of experience, ICSE 2020
[raw/docs-maintenance--practitioner-survey--aghajani-icse-2020.md].

Reported percentages [raw/docs-maintenance--practitioner-survey--aghajani-icse-2020.md]:

| Issue | Category | Percent |
|---|---|---|
| Clarity | how it is written | 88 |
| Missing documentation for a new feature or component | up to dateness | 69 |
| Installation, deployment and release documentation | what is documented | 68 |
| Missing user documentation | what is documented | 65 |
| Faulty tutorial | what is documented | 65 |
| Accessibility and findability | how it is written | 65 |
| Lack of time to write documentation | process and tooling | 65 |
| Inappropriate installation instructions | correctness | 63 |
| Code and documentation inconsistency | up to dateness | 59 |
| Erroneous code examples | correctness | 59 |

Two findings drive design here.

**Clarity outranks completeness as a felt problem, 88 against 68**
[raw/docs-maintenance--practitioner-survey--aghajani-icse-2020.md]. A shorter pack that is
unambiguous beats a longer one that is thorough. This agrees independently with the attention
budget argument [raw/ai-ingestion--context-engineering--anthropic-2025.md], which is the only
place in this archive where a human-reader finding and a model-reader finding point the same
way.

**The dominant form of staleness is absence, not error.** The single most recurring issue was
missing documentation for a new feature or component at 69 percent, ahead of code and
documentation inconsistency at 59 percent
[raw/docs-maintenance--practitioner-survey--aghajani-icse-2020.md]. So a refresh check should
look first for what has happened since the pack was written and was never written down, and
only second for what is now wrong.

Scope limit: this study predates the question of documentation written for machine
consumption and says nothing about it
[raw/docs-maintenance--practitioner-survey--aghajani-icse-2020.md].

### Maintenance mechanics

Point-of-change detection is argued over scheduled review, on the grounds that a quarterly
audit finds drift months late after many merges have already introduced inaccuracies
[raw/docs-maintenance--living-docs--falconer-2026.md]. Signals named: renamed variables,
services or endpoints; deprecated flags still referenced; changed internal terminology;
modified endpoints or workflows; code snippets failing CI; and timestamp comparison between a
document's last edit and the last change to what it describes
[raw/docs-maintenance--living-docs--falconer-2026.md].

Ownership is argued to follow the code path rather than volunteers, so the alert reaches the
person who made the change [raw/docs-maintenance--living-docs--falconer-2026.md].

Evidence quality, stated: weak. The 10-hours-per-week figure is attributed to McKinsey but not
traceable from the article, the 30 percent onboarding claim has no citation, and the
drift-breeds-drift assertion has none
[raw/docs-maintenance--living-docs--falconer-2026.md]. Take the signal list as practitioner
structure. Do not repeat the numbers.

**Transfer limit worth naming.** Most of those signals hook a commit diff. A pack sourced from
meetings and messages has no commit diff. Only the timestamp comparison transfers cleanly
[raw/docs-maintenance--living-docs--falconer-2026.md]. The substitute this skill uses, new
decisions and new meetings since the pack date, is derived from the ADR supersession model
[raw/adr--operational-practice--konishi-2026.md] and the absence-first staleness finding
[raw/docs-maintenance--practitioner-survey--aghajani-icse-2020.md], not from the maintenance
source.

The ADR practice source adds a quarterly architecture review of the whole collection for
staleness and gaps [raw/adr--operational-practice--konishi-2026.md], which is the cadence the
maintenance vendor argues against
[raw/docs-maintenance--living-docs--falconer-2026.md]. **Conflict stated, not smoothed.**
Preference: the quarterly review, for this skill only, because the vendor's alternative
depends on a merge event that does not exist for a knowledge pack built from conversation.
The vendor's criticism of quarterly review is probably right in its own setting.

---

## 7. Positioning: five components, in order

Competitive alternatives, key unique attributes, value, target customer characteristics,
market category [raw/brand--positioning-components--dunford.md]. Worked in that order, because
each element derives from the one before it and a category chosen first will not survive
contact with the alternatives [raw/brand--positioning-components--dunford.md].

Definition, quoted: "Positioning defines how your product is a leader at delivering something
that a well-defined set of customers cares a lot about"
[raw/brand--positioning-components--dunford.md].

The test, quoted: "Good positioning sets off a set of assumptions about my product that are
true. Bad positioning sets off a set of assumptions about my product that aren't true"
[raw/brand--positioning-components--dunford.md].

Pitfalls: defining competitive alternatives too broadly, including phantom competitors
customers never actually consider; and assuming a new category must be created
[raw/brand--positioning-components--dunford.md]. The claim that 90 percent of recent public
technology companies positioned into existing markets carries no citation in the source and is
the author's assertion [raw/brand--positioning-components--dunford.md].

Why this framework suits material reconstructed from calls: all five components are things a
founder says out loud repeatedly, and competitive alternatives in particular surface as
offhand remarks about who a prospect is comparing against
[raw/brand--positioning-components--dunford.md]. It also makes gaps visible, producing an
empty cell rather than a vague paragraph where a project has never articulated its target
customer [raw/brand--positioning-components--dunford.md].

---

## 8. Named gaps in this archive

1. **No measurement of documentation structure against AI task success on private project
   material.** Section 4 is mostly mechanism and convention. The one measured study is
   retrieval metrics on public benchmarks
   [raw/retrieval--chunk-context--arxiv-2504-19754.md].
2. **No source establishes an explicit Non-Goals heading.** The archive supports stating what
   is out of scope [raw/prd--structure--shauchenka-2026.md]; the heading is a house
   convention.
3. **No source covers reconstructing documentation from conversational capture.** Every
   documentation source assumes an author who already knows the answer. The reconstruction
   problem, and therefore the confirmation gates, is governed by
   `references/evidence-standards.md` rather than by this archive.
4. **No source ranks decision-record formats or gives a selection rule**
   [raw/adr--templates-overview--adr-github.md]. The format-by-capture-depth rule in section 2
   is this skill's design decision.
5. **The sensitive-material segregation design has no support in this archive.** No
   documentation source addresses it. It comes from `references/evidence-standards.md` rules 7
   and 10.
6. **Frequency of contradiction in real project talk is unmeasured.** WikiContradict measures
   model behavior given a contradiction; it says nothing about how often one occurs in a
   quarter of meetings [raw/contradiction--wikicontradict--neurips-2024.md]. Any claim about
   how many conflicts a project contains would be invented.

---

## 9. Design decisions taken without archive support

Labelled here so no guide implies they are researched.

| Decision | Basis |
|---|---|
| Format decision records by how much the capture supports rather than by a house standard | inference from the format differences in section 2 |
| Recency wins by default, with the earlier reading retained and dated | modelled on ADR supersession [raw/adr--operational-practice--konishi-2026.md], extended to non-decision facts, which no source does |
| Segregate financial, equity, legal, and personnel material into a separate controlled file | `references/evidence-standards.md` rules 7 and 10, not this archive |
| One fact per line where the fact is atomic | consistent with self-contained sections [raw/retrieval--chunk-context--arxiv-2504-19754.md], but no source prescribes line granularity |
| The specific pack file set and naming scheme | assembled from sections 1, 2, 3, and 7; no source prescribes a pack |
| Refresh cadence of one month for active projects | no source. Nearest anchor is quarterly ADR review [raw/adr--operational-practice--konishi-2026.md] |
