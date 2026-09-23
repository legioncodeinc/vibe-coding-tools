# Distilled: AI text detection, LLM linguistic signatures, and stylometry

Stage 3 of the forge pipeline for `brand-voice-guardian`. Written from a fresh read of
the 14 files in `raw/`. Every claim ends in a bracketed citation to the raw file it came
from. Claims with no citation are not in this document.

Read this before authoring or changing anything in `../ai-tell-catalog.md` or
`../detection-reality.md`.

---

## 0. The honest read on this domain, stated first

Three things are true at once, and a skill that hides any of them is selling something.

1. **LLM text does carry measurable linguistic signatures.** This is established at
   population scale by peer-reviewed work on both vocabulary
   [raw/aitell--lexical-shift--kobak-science-advances-2025.md] and grammar
   [raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md].
2. **No detector reliably identifies an individual document.** The best-positioned vendor
   in the world built one, measured 26% true positives against 9% false positives, and
   withdrew it inside six months
   [raw/detect--vendor-retirement--openai-classifier-2023.md]. A 14-tool peer-reviewed
   evaluation concluded the tools are neither accurate nor reliable
   [raw/detect--tool-accuracy--weber-wulff-ijei-2023.md].
3. **The signatures and the detectors are different things.** The population-level
   signature is real and is what a human editor can act on. The per-document verdict is
   the part that does not work. Conflating them is the central error in this field.

The gap between 1 and 2 is the entire design space for this skill. It can act on 1. It
must never promise 2.

---

## 1. Lexical signature: what the words give away

### The finding that reframes the whole word-level question

The 2024 vocabulary shift in published biomedical writing was concentrated in **style
words, not content words**. Of 379 excess style words identified in 2024, **66% were
verbs and 14% were adjectives**. For contrast, the Covid-era excess vocabulary of 2020 to
2022 was **79.2% nouns**
[raw/aitell--lexical-shift--kobak-science-advances-2025.md].

That contrast is the load-bearing evidence. A topic fad moves nouns. An LLM moves verbs
and adjectives. A tell catalog that lists mostly nouns is measuring subject matter.

### Measured marker words

Frequency ratio `r`, observed 2024 frequency over projected counterfactual
[raw/aitell--lexical-shift--kobak-science-advances-2025.md]:

| Word | r |
|---|---|
| delves | 28.0 |
| underscores | 13.8 |
| showcasing | 10.7 |

Frequency gap `delta` for common words, same source:

| Word | delta |
|---|---|
| potential | 0.052 |
| findings | 0.041 |
| crucial | 0.037 |

The ten-word common set used in the prevalence estimate, in full: `across, additionally,
comprehensive, crucial, enhancing, exhibited, insights, notably, particularly, within`
[raw/aitell--lexical-shift--kobak-science-advances-2025.md].

A separate corpus study measured per-word multiples for GPT-4o against human rate:
**camaraderie 171x, tapestry 147x**, characterized as words connoting complex relation
among objects, producing a grandiose tone
[raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md].

### Prevalence

At least **13.5%** of 2024 biomedical abstracts were LLM-processed, stated as a lower
bound, reaching **40% for some subcorpora**
[raw/aitell--lexical-shift--kobak-science-advances-2025.md].

### What this does NOT license

The excess-vocabulary method operates over 15 million documents. It cannot classify one
[raw/aitell--lexical-shift--kobak-science-advances-2025.md]. Borrow the word list. Do not
borrow the confidence.

---

## 2. Grammatical signature: what the sentence construction gives away

Measured differences between instruction-tuned LLM output and human text across two
purpose-built parallel corpora, 9,615 and 8,290 documents
[raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md]:

| Feature | LLM rate versus human |
|---|---|
| **Present participial clauses** | **2 to 5 times** human rate |
| **Nominalizations** | **1.5 to 2 times** human rate |
| Agentless passive (GPT-4o) | about **half** human rate |
| Noun-heavy information density | elevated |
| `that` clauses as subjects | elevated |
| Phrasal coordination | elevated |

Present participial clauses carry the largest single measured multiple in the archive.
That makes the participial-clause opener the highest-yield structural tell available, and
it is a construction most tell lists never mention because it is invisible unless you are
looking for it.

### Instruction tuning moves output AWAY from human

Llama 3 base models use features at rates similar to human texts. GPT-4o and the
instruction-tuned Llama 3 models show much wider variation from human baseline. The
authors state that instruction tuning appears to make the model output less human, not
more [raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md].

Every model a user actually writes with is instruction-tuned.

### Register flatness is measured, not folklore

LLMs demonstrate reduced stylistic variation relative to human writers, and
instruction-tuned variants **fail to adapt style across registers**
[raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md].

This is the evidence base for treating register drift as a first-class tell, and it is
why a QA pass has to establish the target register BEFORE flagging anything. A construction
that is a tell in a text message is normal in a whitepaper.

### There is no single "AI style"

Classification errors confused Llama 3 8B with Llama 3 70B rather than conflating
different model families, indicating distinguishable per-provider house styles
[raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md]. Confirmed independently: em dash
rates across 12 models spanned **0.0 to 10.62 per 1,000 words**, with Llama producing
none at all [raw/aitell--punctuation--freeburg-markdown-fingerprint-2026.md].

Consequence: any tell catalog is model-generation-specific and dates. Say so in the
catalog.

---

## 3. Punctuation: the em dash, handled honestly

This is the most cited tell and the most abused one. The archive supports a narrow claim
and refutes a wide one.

### What is supported

In 10,000 ecology abstracts compared between 2021 and 2025, **em dash frequency more than
doubled, and no other punctuation mark showed a comparable increase**
[raw/aitell--punctuation--keck-ecology-em-dash-2025.md].

### What is refuted

Measured em dash rates per 1,000 words
[raw/aitell--punctuation--freeburg-markdown-fingerprint-2026.md]:

| Source | Rate |
|---|---|
| LLM output across 12 models | 0.0 to 10.62 |
| **Human baseline** | **mean 3.23, range 0.33 to 17.12** |

**The human range fully contains the LLM range.** Some humans use em dashes more heavily
than any model measured. Em dash density on its own cannot separate a human writer from a
model, and a flag raised on em dash density alone is not evidence of anything.

The author of the ecology measurement says the same in his own terms: the finding is not
proof of direct causality, only correlation
[raw/aitell--punctuation--keck-ecology-em-dash-2025.md].

### Suppression is unreliable

GPT-4.1 continued producing em dashes at **9.10 per 1,000 words while explicitly
instructed not to use markdown**. Llama produced zero regardless of instruction
[raw/aitell--punctuation--freeburg-markdown-fingerprint-2026.md].

Telling a model not to use em dashes does not reliably work. A deterministic
find-and-replace does.

### Other structural markdown habits DO respond to constraint

Headers, bullet points, bold emphasis and numbered lists were eliminated universally
under prose-only constraints. The em dash was the feature that persisted
[raw/aitell--punctuation--freeburg-markdown-fingerprint-2026.md].

### Why this skill still enforces a zero-em-dash rule

Not because the em dash proves machine authorship. Because for a given writer it is a
**voice** question with a knowable answer: either they use them or they do not, and this
marketplace's voice skills record which
[raw/stylometry--features--stamatatos-jasist-2009.md, on punctuation as an authorial
feature]. Enforcing the user's own documented habit is defensible. Enforcing it as
detector evasion is not.

---

## 4. Detection reality: the numbers, in one place

| Measurement | Value | Source |
|---|---|---|
| OpenAI's own classifier, true positive rate | **26%** | [raw/detect--vendor-retirement--openai-classifier-2023.md] |
| OpenAI's own classifier, false positive rate | **9%** | same |
| OpenAI classifier lifespan | withdrawn for low accuracy inside 6 months | same |
| 14 tools, accuracy on unmodified AI text | **74%**, all tools under 80% | [raw/detect--tool-accuracy--weber-wulff-ijei-2023.md] |
| 14 tools, accuracy on human text | 96% | same |
| Accuracy after **manual human editing** of AI text | **about 42%** | same |
| Accuracy after machine paraphrase | **26%** | same |
| False positive spread across the 14 tools | **0% to 50%** | same |
| 7 detectors, false positives on non-native-writer essays | **61.22%** | [raw/detect--false-positives--liang-patterns-2023.md] |
| Same 7 detectors on native-writer essays | near-perfect | same |
| Non-native essays unanimously misclassified by all 7 | **19.78%** | same |
| Same essays after a vocabulary-enhancement rewrite | **11.77%**, a fall of 49.45 points | same |
| Turnitin's own stated **sentence-level** false positive rate | **around 4%** | [raw/detect--vendor-claims--turnitin-false-positive-2023.md] |
| Turnitin's own stated document-level rate, at 20% or more AI | under 1% | same |

### The four conclusions that follow

**A. Detectors measure predictability, not authorship.** The mechanism is perplexity.
Non-native writers exhibit limited linguistic variability, producing low perplexity, which
detectors read as machine-generated
[raw/detect--false-positives--liang-patterns-2023.md]. The proof is that a prompt asking
for more native-sounding word choices cut the false positive rate from 61.22% to 11.77%
without changing who wrote the essay [same].

**B. The false positives land on identifiable people.** Non-native English writers
[raw/detect--false-positives--liang-patterns-2023.md] and users of machine translation,
including second-language students translating their own work
[raw/detect--tool-accuracy--weber-wulff-ijei-2023.md]. This is the reason the skill must
never tell a user that a detector's verdict on their writing means anything about them.

**C. Detector agreement is not evidence.** All seven detectors unanimously condemned
19.78% of genuine human essays [raw/detect--false-positives--liang-patterns-2023.md].
Consensus among tools that share a mechanism reproduces the mechanism's error.

**D. Span-level flagging is the error-prone level.** The one vendor that publishes both
figures states around 4% at sentence level against under 1% at document level, roughly a
four-fold difference [raw/detect--vendor-claims--turnitin-false-positive-2023.md]. Any
tool that highlights individual spans, including this skill, inherits the span-level error
rate.

### The theoretical ceiling

Detector AUROC is bounded by the total variation distance between the human and AI text
distributions. As those distributions converge, achievable AUROC falls toward chance
[raw/detect--limits--sadasivan-tmlr-2025.md]. Detection is not an engineering problem
awaiting a better detector.

Recursive paraphrasing significantly reduces detection rates across neural, zero-shot,
retrieval-based and watermarking detectors, with only slight quality degradation, and
watermark signatures can be inferred without white-box access and used to make HUMAN text
classify as AI [raw/detect--limits--sadasivan-tmlr-2025.md]. Per-detector numeric drops
were not retrieved and are a named gap.

### Length

Detection is very unreliable below **1,000 characters**, by the vendor's own statement
[raw/detect--vendor-retirement--openai-classifier-2023.md]. Most social posts, comments
and business emails are shorter than that. Most of what this skill reviews sits below the
length at which any detector was ever claimed to work.

### The conflict this archive does not resolve

An independent 14-tool evaluation measured Turnitin at a **0%** false positive rate on its
test corpus [raw/detect--tool-accuracy--weber-wulff-ijei-2023.md], while Turnitin itself
publishes **around 4%** at sentence level [raw/detect--vendor-claims--turnitin-false-positive-2023.md].
Different levels of analysis and different corpora, so not strictly contradictory, but
neither validates the other. Both readings are kept. Preferred reading for skill design:
**use the higher figure**, because a QA pass operates at span level and because
underestimating a false positive rate is the failure mode that harms a user.

---

## 5. Stylometry: what actually carries authorial signal

From the canonical survey of authorship attribution
[raw/stylometry--features--stamatatos-jasist-2009.md]:

| Finding | Consequence for a voice profile |
|---|---|
| The most common words (articles, prepositions, pronouns) are among the best discriminators between authors, because they are used largely unconsciously and are topic-independent | A voice profile built on a person's favorite NOUNS captures their subject matter, not their authorship. The identifying layer is the layer they are not thinking about. |
| Character n-grams are among the most effective features, beaten in one cited experiment only by a combination of frequent words **and punctuation marks** | Punctuation habits are authorial, not cosmetic. This is the legitimate basis for treating a dash habit as a voice rule. |
| Vocabulary richness depends heavily on text length and is unreliable used alone | Never judge a short comment against a long-form profile on vocabulary breadth. The measure is length-confounded. |
| No text-length threshold for reliable attribution can yet be defined; short-text results are promising but inconclusive | A one-line comment cannot be verified as the user's. Say so rather than flagging it confidently. |
| Topic-independence is the property that makes a feature authorial | A feature that changes when the subject changes is measuring the subject. |

The survey predates LLMs entirely and addresses attribution among a closed candidate set,
which is a different task from verifying one known author. Its feature taxonomy transfers.
Its methods do not [raw/stylometry--features--stamatatos-jasist-2009.md].

---

## 6. Editing practice: what restrains an over-eager pass

Two professional sources, and the most important thing they share is a refusal.

### The restraint rule

> "If the only reason I can muster for revising text is 'I would never write it like
> that,' I leave the sentence alone."
> [raw/editing--voice-preservation--evans-cell-mentor-2015.md]

Revision of grammatically sound prose is licensed on **three named conditions only**:
repetitive, awkward, or unnecessarily wordy [same]. An editor prone to inserting their own
voice should err on the side of querying the author rather than changing the text [same].

An automated pass has this failure mode in amplified form, because the model has a
stronger house style than any human copyeditor and no hesitation about applying it. Every
flag this skill raises must be able to state a reason that is not preference.

### The legitimate purposes of style editing

Consistency, clarity, accuracy, and reader comprehension. Overreach is defined by effect:
edits that compromise accuracy or confuse the target audience
[raw/editing--voice-vs-house-style--gladish-science-editor-2025.md]. Where a style change
alters meaning, the author decides [same].

### The refusal, recorded as a finding

Both sources decline to reduce voice preservation to a procedure. One states directly that
there is no way to give a how-to lesson on preserving voice
[raw/editing--voice-preservation--evans-cell-mentor-2015.md]. The other supplies principles
and interviews rather than a rule set, and resolves the voice-versus-house-style conflict
through conversation between two named parties
[raw/editing--voice-vs-house-style--gladish-science-editor-2025.md].

That conversation is unavailable to an automated pass. Which is exactly why an automated
pass hands conflicts back to the user instead of deciding them.

---

## 7. Policy and labeling: what the rules actually turn on

### EU AI Act Article 50, applicable from 2 August 2026

Deployers must clearly label AI-generated or manipulated text published to inform the
public on matters of public interest. Three cumulative criteria: published, informative to
the public, on a matter of public interest
[raw/policy--eu-ai-act--article-50-commission-faq-2026.md].

The exemption turns on **human review or editorial control**, defined as deliberate
examination of the SUBSTANCE by a person with relevant knowledge and professional
judgement, exercised by someone holding ultimate legal responsibility for publication
[same].

**The exclusion that matters most here:** superficial, solely formal, or procedural checks,
with spell-checking and grammatical correction given as the examples, **do not qualify**
[same].

A tone-only rewrite that does not engage substance and carries no named responsible person
sits closer to the excluded category than the exempting one. This archive did not determine
where a voice-matching rewrite falls, and does not pretend to.

Providers must separately mark synthetic output in a machine-readable format [same]. That
channel is untouched by any amount of stylistic editing.

### Amazon KDP, the clearest platform definition located

- **AI-generated:** content created by an AI tool, and it remains AI-generated "even if
  you applied substantial edits afterwards". Must be disclosed
  [raw/policy--publishing--amazon-kdp-ai-content.md].
- **AI-assisted:** content the human created, then used AI tools to edit, refine,
  error-check or improve. Must NOT be disclosed
  [same].

**The line is drawn by who wrote the first draft, not by how the finished text reads**
[same].

This settles a question users will ask, and it splits this skill's two jobs onto opposite
sides of the line. Tone-correcting the user's own draft produces AI-assisted content.
Tone-correcting an AI-produced draft leaves it AI-generated, however good the rewrite.

Undated page, one platform, book publishing only [same]. Re-check before relying on it.

---

## 8. The synthesis, and what the skill may therefore claim

**May claim.** The skill can find, count and name specific constructions that measured
research associates with LLM output: verb and adjective style words
[raw/aitell--lexical-shift--kobak-science-advances-2025.md], present participial clauses
at 2 to 5 times human rate and nominalizations at 1.5 to 2 times
[raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md], register flatness [same], and
punctuation habits that depart from the user's own documented profile
[raw/stylometry--features--stamatatos-jasist-2009.md].

**May claim.** The skill can make text sound more like a specific person, when it has a
corpus-derived profile of that person to work from
[raw/stylometry--features--stamatatos-jasist-2009.md].

**May NOT claim.** That the result will pass any detector. Detection accuracy on edited
text runs around 42% [raw/detect--tool-accuracy--weber-wulff-ijei-2023.md], false positives
run to 61.22% on some human populations
[raw/detect--false-positives--liang-patterns-2023.md], and the achievable ceiling is bounded
by distributional convergence [raw/detect--limits--sadasivan-tmlr-2025.md]. A pass or fail
from any detector is not information about who wrote the text.

**May NOT claim.** That editing changes a disclosure obligation. On the one platform with
a clear rule, it explicitly does not
[raw/policy--publishing--amazon-kdp-ai-content.md], and under the one legal regime
located, formal-only passes are explicitly excluded from the exemption
[raw/policy--eu-ai-act--article-50-commission-faq-2026.md].

**The positioning that survives all of the above:** make it sound like the user. Detector
behavior is a side effect nobody controls, and it is measured on populations rather than
on people.

---

## 9. Named gaps, stated rather than padded

1. **No study measures tells in short-form social writing.** Every corpus in this archive
   is abstracts, essays, news, fiction, academic or broadcast prose
   [raw/aitell--lexical-shift--kobak-science-advances-2025.md,
   raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md,
   raw/detect--false-positives--liang-patterns-2023.md]. A comment, a reply, and a client
   email are the registers this skill most often sees, and nothing here measures them.
2. **No measured study of burstiness or sentence-length variance was located.** Sentence
   uniformity is one of the most widely repeated tells and every source found for it was
   detector-vendor or humanizer marketing, which is excluded by this archive's weighting.
   Reduced stylistic variation IS measured
   [raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md], but not as a sentence-length
   statistic. Any burstiness rule in this skill is authored craft, not evidence.
3. **No measured study of triadic lists, symmetrical paragraph structure, or the
   tidy-conclusion habit was located.** Markdown structural habits are measured
   [raw/aitell--punctuation--freeburg-markdown-fingerprint-2026.md] but the rule-of-three
   and the wrap-up paragraph are not. These are authored craft in this skill and are
   labeled as such.
4. **No measured study of hedging or qualification DENSITY was located.** Downtoner
   frequency differences are reported and they run in opposite directions by model family
   [raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md], which is the reverse of a clean
   rule.
5. **Detector evaluations are from 2023.** Both the 14-tool study and the seven-detector
   bias study [raw/detect--tool-accuracy--weber-wulff-ijei-2023.md,
   raw/detect--false-positives--liang-patterns-2023.md]. No replication on the current
   detector generation was located. The direction of the findings is not in dispute in
   anything retrieved, but the specific percentages are dated.
6. **Marker vocabulary is measured on the 2024 model generation**
   [raw/aitell--lexical-shift--kobak-science-advances-2025.md,
   raw/aitell--grammar-rhetoric--reinhart-pnas-2025.md]. Word lists date faster than
   structural findings.
7. **The Freeburg human baseline could not be traced to a named corpus** from what was
   retrieved [raw/aitell--punctuation--freeburg-markdown-fingerprint-2026.md]. The 3.23
   mean and the 0.33 to 17.12 range are used, with that provenance gap stated.
8. **Per-detector AUROC drops under recursive paraphrasing were not retrieved**
   [raw/detect--limits--sadasivan-tmlr-2025.md]. Only the qualitative result is available
   here.
9. **No source addresses correcting a THIRD PARTY's draft into someone else's voice.**
   The editing literature covers an editor serving an author's voice
   [raw/editing--voice-preservation--evans-cell-mentor-2015.md,
   raw/editing--voice-vs-house-style--gladish-science-editor-2025.md], which is the
   opposite direction. The teammate-draft case in this skill is unsourced and is authored
   reasoning.
10. **No fact-checking or claim-verification literature was swept.** The fact-check pass in
    this skill is built on the marketplace's own evidence standards, not on external
    research.

---

## 10. Source weighting used in this archive

| Type | Count | Weight applied |
|---|---|---|
| academic, peer-reviewed | 6 | highest. Kobak (Science Advances), Reinhart (PNAS), Liang (Patterns), Weber-Wulff (IJEI), Sadasivan (TMLR), Stamatatos (JASIST) |
| academic preprint, not peer reviewed | 1 | rates used, causal story not. Freeburg |
| official-docs, regulator or platform | 3 | high for what the rule IS. EU Commission, Amazon KDP, OpenAI retirement notice |
| community, independent measurement with published code | 1 | medium. Keck |
| community, professional practice | 2 | medium for craft, no measurement. Evans, Gladish |
| vendor-blog | 1 | lowest, archived only as a vendor caveat against interest. Turnitin |

Detector-vendor marketing and text-humanizer marketing were deliberately excluded. Several
searches during this sweep returned nothing else, which is recorded as gap 2 above rather
than filled with the marketing.
