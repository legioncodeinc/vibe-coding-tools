# Writing the pack so a model can actually use it

The house rules for structure, and an honest account of which of them are evidenced and which
are convention. Every claim here traces through
`research/distilled-documentation-architecture.md` to a raw file.

---

## Read this first: how much of this is actually known

The "write your documentation for AI" genre is large, confident, and mostly unsourced. The
representative vendor article archived here makes eleven structural recommendations and cites a
source for none of them, and its one hard number, a claim that markdown cuts token consumption
by over 90 percent, comes with no method and no sample
[research/distilled-documentation-architecture.md section 4]. The GitHub corpus piece is
headlined on more than 2,500 repositories and publishes no median length, no section frequency
distribution, no tier comparison, and no criterion for the "top tier" it sorts files into
[research/distilled-documentation-architecture.md section 4].

And the named gap that matters most: **no source in this archive measures the effect of
document structure on downstream task performance for a human-authored project knowledge base**
[research/distilled-documentation-architecture.md section 8]. The closest measured study is
about automated chunking of existing prose against public benchmark corpora, not about how a
person should write [research/distilled-documentation-architecture.md section 4].

So the rules below are sorted by what stands behind them. Follow all of them. Do not tell the
user the ones in the third tier are findings.

---

## Tier 1: rules with measurement or a stated mechanism

### 1. Context is a budget. More is not better.

As the token count in the context window grows, a model's ability to recall accurately from
that context decreases, for the architectural reason that transformer attention forms n squared
pairwise relationships for n tokens
[research/distilled-documentation-architecture.md section 4].

The governing principle: the smallest possible set of high-signal tokens that maximizes the
likelihood of the desired outcome, immediately qualified with the note that minimal does not
mean short and the agent still needs sufficient information
[research/distilled-documentation-architecture.md section 4].

Applied:

- Cut anything that does not change what a reader would do or believe.
- Do not restate the same fact in three documents. State it once, in the file whose mode owns
  it, and reference it.
- Resist the urge to include every meeting. The pack is the distillate, not the archive.

This rule agrees independently with the human-reader evidence: in a survey of 146 practitioners,
clarity was flagged by 88 percent while missing content topped out at 68 percent, so a shorter
unambiguous pack beats a longer thorough one
[research/distilled-documentation-architecture.md section 6]. That is the only place in this
archive where a finding about human readers and a claim about model readers point the same way,
which is why it leads.

### 2. Ambiguity is not resolvable by the reader.

The stated rule: if a human engineer cannot definitively say which tool should be used in a
given situation, an agent cannot be expected to do better
[research/distilled-documentation-architecture.md section 4].

Generalized to a knowledge pack: an ambiguity a human would resolve by asking a colleague is one
a model resolves by guessing, silently.

Applied:

- **No ambiguous pronouns across sections.** "It", "this", and "they" must resolve within the
  same section, ideally within the same paragraph. Across a heading boundary, repeat the noun.
- **No unresolved "we decided to change the approach"** without naming the old approach and the
  new one.
- **No relative time.** "Last quarter" is unresolvable to a reader six months later. Write the
  date.
- Where a genuine ambiguity exists in the source material, it is an open question or a
  contradiction, not a sentence with a hedge in it.

### 3. Sections should stand alone.

Both retrieval methods that beat naive chunking in the measured study work by injecting
document-level context back into a fragment that lost it at the split
[research/distilled-documentation-architecture.md section 4].

The honest size of that finding: contextual retrieval with rank fusion reached NDCG at 5 of
0.317 against 0.312 without, late chunking beat early chunking generally but not always, and the
reranking step was described as crucial to any consistent gain
[research/distilled-documentation-architecture.md section 4]. Small and inconsistent. The
mechanism is the transferable part, not the effect size.

Applied:

- A section under a heading should make sense if it is the only thing a reader sees.
- Repeat the subject at the start of each section rather than carrying it over from the
  previous one.
- Do not spread one concept across several sections. If a concept needs three sections, it
  needs a document.

### 4. Define the vocabulary before first use.

A project's private vocabulary was never in any model's training data, so it cannot be resolved
from parametric knowledge; and a term written in several casing or punctuation variants
fragments retrieval, because documents about one concept stop looking related
[research/distilled-documentation-architecture.md section 4].

Note precisely what the argument is. It is not that models like glossaries. It is that private
vocabulary either gets defined or gets guessed
[research/distilled-documentation-architecture.md section 4].

Applied:

- Every project-specific term gets a glossary entry before it appears in any other document.
- One canonical spelling and casing, used everywhere in the pack, with variants recorded in the
  glossary entry rather than used in prose.
- Expand each acronym on first use in each document, then use the acronym.
- Ordinary English words used in a project-specific way are the highest-risk terms, because a
  model will confidently apply the ordinary meaning. They get entries too.

### 5. Predictable structure enables selective loading.

Agents are advised to hold lightweight identifiers and load data at runtime through tools rather
than preloading everything [research/distilled-documentation-architecture.md section 4]. The
Cloudflare agent-markdown surface demonstrates the same idea in layout: a fixed three-part
order, metadata then body then structured data, so a consumer can rely on position
[research/distilled-documentation-architecture.md section 4]. The value demonstrated is
predictability, not markdown as such
[research/distilled-documentation-architecture.md section 4].

Applied:

- Numeric file prefixes so disk order and index order agree.
- The same heading set in every document of the same type across every project pack.
- The index carries a one-line description of every file, so a session can decide what to load
  without loading it.

---

## Tier 2: rules with a plausible mechanism and one supporting source

### 6. Name specific versions and specific values.

From the corpus observation: use a precise stack description rather than a vague reference
[research/distilled-documentation-architecture.md section 4]. From the requirements literature:
prefer a specific threshold over an adjective
[research/distilled-documentation-architecture.md section 3].

Applied: never write "fast", "modern", "recent", "large". Write the number, or write that the
number was not captured.

### 7. State what is out of bounds.

The other item from the corpus observation with a clear mechanism: tell the agent what it should
never touch [research/distilled-documentation-architecture.md section 4].

Applied: the non-goals section of the PRD and the omissions list in the index are both doing
this job. So is the pointer to the sensitive file, which names the existence of segregated
material without including it.

### 8. Markdown, with a curated index.

The llms.txt proposal argues from context window cost and extraction noise, specifies a fixed
shape of one H1, a summary blockquote, and H2-delimited sections of curated links with one-line
notes, and reports wide adoption including by major model providers
[research/distilled-documentation-architecture.md section 4].

The honest reading: adoption is evidence of adoption. The proposal presents no measurement that
a model answers better when given llms.txt than when given the same content arranged another way
[research/distilled-documentation-architecture.md section 4]. Adopt the shape for `00-index.md`.
Do not claim the benefit.

---

## Tier 3: convention, followed anyway, and labelled as convention

These are the ones the vendor genre asserts without sources
[research/distilled-documentation-architecture.md section 4]. They are not obviously wrong and
several have a plausible mechanism. They are not findings.

| Convention | Status |
|---|---|
| Clear heading hierarchies | asserted, no source |
| One fact per line where the fact is atomic | no source prescribes line granularity; consistent with rule 3 |
| Explicit relationships rather than implied ones | asserted, no source |
| Tables for anything with repeating structure | no source |
| Consistent heading text across documents of the same type | no source; follows from rule 5 by inference |

One more worth flagging: the vendor guidance offers markdown headers and XML tags as
alternatives for delimiting sections and ranks neither
[research/distilled-documentation-architecture.md section 4]. Anyone claiming one beats the
other is asserting it. This pack uses markdown headings because the pack is also read by humans.

---

## The concrete house rules

Consolidated, for use while writing.

**Headings.** Sentence case. The same heading set for every document of a given type. Never
skip a level. No heading that is only a label with no content under it.

**Sentences.** One fact per sentence where the fact is atomic. Present tense for current state,
past tense with an explicit date for history.

**Lists.** A bulleted list for unordered facts, a numbered list only for genuine sequence, a
table wherever items share a structure.

**Dates.** ISO form, `2026-08-17`, everywhere except inside a verbatim receipt, which keeps the
form the capture returned. Never a relative date.

**Names.** Full name on first use in each document, then a consistent short form. One canonical
form per entity across the whole pack.

**Numbers.** With their unit and their basis. Never a bare figure whose scale is implied.

**Receipts.** Every material fact carries one, per `evidence-standards.md` rule 1. Receipts go
at the end of the line or in a dedicated column, never mid-sentence, so a reader can skim the
claims without wading through provenance.

**Marking.** Observed, inferred, external, and unknown are visibly different, per
`evidence-standards.md` rule 2. In this pack: observed lines carry a receipt, inferred lines
begin with "Inferred:" and name what they rest on, external lines carry a URL, unknown items are
in the open questions file rather than hedged in place.

**What never appears in the pack.** Raw capture, transcript dumps, screenshot text, another
person's private message content beyond a short quote that is material to a recorded fact
(`evidence-standards.md` rule 7).
