# Detection reality: what this skill will not promise

The positioning document. Read it before telling a user anything about detectors.

**The one-line version: this skill makes text sound like the user. It does not make text
undetectable, because nobody can honestly promise that, and a detector's verdict is not
information about who wrote something.**

Every number below traces to `research/distilled-ai-detection-and-stylometry.md`, which
traces to a file in `research/raw/`.

---

## Part 1: The three things that are true at once

A great deal of confusion in this field comes from collapsing these into one claim. They
are separate and they are all supported.

### 1. LLM text carries measurable linguistic signatures

Established at population scale by peer-reviewed work.

- Over 15 million biomedical abstracts, 2010 to 2024. The 2024 vocabulary shift was
  concentrated in style words: of 379 excess style words, **66% were verbs and 14% were
  adjectives**, against **79.2% nouns** for the Covid-era shift. At least **13.5%** of
  2024 abstracts were LLM-processed, stated as a lower bound, reaching **40%** in some
  subcorpora (section 1).
- Two purpose-built parallel corpora, 9,615 and 8,290 documents. Instruction-tuned LLMs
  use present participial clauses at **2 to 5 times** the human rate and nominalizations
  at **1.5 to 2 times** (section 2).

This is why the tell catalog is real work and not theater.

### 2. No detector reliably identifies an individual document

- OpenAI built one, measured **26% true positives** against **9% false positives**, and
  withdrew it for low accuracy inside six months (section 4).
- A peer-reviewed evaluation of 14 tools found **74%** accuracy on unmodified AI text,
  with **all tools scoring below 80%**, and concluded the tools are neither accurate nor
  reliable and should not be used as evidence (section 4).
- Detector AUROC is theoretically bounded by the total variation distance between the
  human and AI text distributions. As those converge, achievable accuracy falls toward
  chance. Detection is not an engineering problem awaiting a better detector (section 4).

### 3. The signature and the detector are different things

The population-level signature is real and a human editor can act on it. The per-document
verdict is the part that does not work.

**Conflating them is the central error in this field, and it runs in both directions.**
Detector vendors use fact 1 to sell fact 2. Humanizer vendors use fact 2 to sell evasion.
This skill acts on fact 1 and makes no claim about fact 2.

---

## Part 2: Detectors measure predictability, not authorship

This is the finding that settles the positioning, and it is worth stating carefully
because it is counterintuitive.

Seven detectors were run over 91 TOEFL essays by non-native English writers and a set of
US eighth-grade essays by native writers (section 4).

| Corpus | Result |
|---|---|
| Non-native writers | **61.22%** average false positive rate |
| Native writers | near-perfect, correctly identified as human |

**All seven detectors unanimously misclassified 18 of the 91 essays, 19.78%, as
AI-authored.**

Then the essays were revised with a prompt asking for word choices that sound more like a
native speaker. The average false positive rate fell from **61.22% to 11.77%**, a drop of
49.45 percentage points.

Nobody changed who wrote the essays.

The mechanism is perplexity. Lower perplexity means more predictable language. Non-native
writers show limited linguistic variability, producing low perplexity, which detectors
read as machine-generated (section 4).

**So a detector is a vocabulary-range meter with an authorship label on it.**

### What follows

1. **A detector "pass" means the text is lexically varied.** It does not mean a human
   wrote it, and it does not mean the user wrote it.
2. **A detector "fail" means the text is predictable.** It does not mean a machine wrote
   it. It happens to genuine human writing at a rate of 61.22% for one identifiable
   population.
3. **Detector agreement is not evidence.** Tools sharing a mechanism reproduce the
   mechanism's error. Seven of seven condemned one in five genuine human essays.
4. **The false positives land on identifiable people:** non-native English writers, and
   users of machine translation including second-language students translating their own
   work (section 4). This is why the skill never tells a user that a detector verdict
   means anything about them.

---

## Part 3: What editing actually does to a detector score

The user will ask. The honest answer is in the archive.

| Text state | Detection accuracy |
|---|---|
| AI text, unmodified | 74% |
| **AI text, manually edited by a human** | **about 42%** |
| AI text, machine-paraphrased | 26% |

(section 4)

So yes, editing lowers detection. **That is not a reason to use this skill and it is not
what the skill sells.**

Three reasons the number is not a promise:

1. **The 42% figure is measured on 2023 tools with edits made for that study.** It is not
   a prediction about what any current detector will say about any particular rewrite.
2. **False positive rates across those same 14 tools spanned 0% to 50%** (section 4). Tool
   choice determines the verdict more than the text does. There is no single score to
   move.
3. **Detection is very unreliable below 1,000 characters**, by the vendor's own statement
   (section 4). Most social posts, comments and business emails are shorter than that.
   **Most of what this skill reviews sits below the length at which any detector was ever
   claimed to work**, so for the majority of runs the score was never meaningful in either
   direction.

---

## Part 4: What the skill says, verbatim

Say this to the user once per run, in the report's method section. Adapt the wording to
the register of the conversation, keep the substance exactly.

> This pass makes your draft sound like you. It does not make it undetectable, and no tool
> can honestly promise that.
>
> AI text detectors do not measure who wrote something. They measure how predictable the
> language is. In peer-reviewed testing, seven mainstream detectors flagged 61% of genuine
> essays by non-native English writers as AI-generated, and all seven agreed on one in
> five of them. OpenAI's own detector caught 26% of AI text while falsely accusing 9% of
> human text, and was withdrawn for low accuracy after six months. A 14-tool evaluation
> concluded the tools are neither accurate nor reliable.
>
> So: a detector clearing your draft is not evidence you wrote it, and a detector flagging
> your draft is not evidence you did not. If a detector score improves after this pass,
> treat that as a side effect nobody controls, not as the result.
>
> What this pass can actually do is find specific constructions that do not match how you
> write, count them, show you where they are, and rewrite them in your voice.

### Things the skill must never say

| Forbidden | Why |
|---|---|
| "This will pass AI detection" | Unknowable. Depends on which detector, which version, which day. |
| "This is now undetectable" | Nobody can promise this. |
| "Your draft scored X% AI" | The skill runs no detector and should not imply one. |
| "This is 100% human" | The claim is meaningless and the skill is not the one who wrote it. |
| "Detectors will not flag this" | See the 0% to 50% spread. |
| "You are safe to publish this as your own work" | A disclosure question, not a tone question. See part 5. |

### The line the skill CAN hold

"Fewer constructions in this draft depart from your documented voice than before." That is
checkable, it is what was actually done, and it is what the tell inventory demonstrates.

---

## Part 5: Disclosure is a separate question, and editing does not settle it

Users conflate "does it sound like me" with "do I have to say an AI was involved". They
are unrelated questions and the second one has actual rules attached.

### Amazon KDP, the clearest platform definition located (section 7)

- **AI-generated:** created by an AI tool. Remains AI-generated **"even if you applied
  substantial edits afterwards"**. Must be disclosed.
- **AI-assisted:** the human created it, then used AI tools to edit, refine, error-check
  or improve. Must NOT be disclosed.

**The line is drawn by who wrote the first draft, not by how the finished text reads.**

This splits the skill's two jobs onto opposite sides of the line:

| Input to this skill | Category on that platform |
|---|---|
| The user's own draft, tone-corrected | AI-assisted. No disclosure obligation there. |
| An AI-produced draft, tone-corrected | Still AI-generated. However good the rewrite. |

One platform, book publishing, undated page. Re-check before relying on it. But the
principle is what the user needs to hear: **this skill cannot edit a draft out of a
disclosure category.**

### EU AI Act Article 50, applicable from 2 August 2026 (section 7)

Deployers must label AI-generated or manipulated text published to inform the public on
matters of public interest. Three cumulative criteria: published, informative to the
public, on a matter of public interest.

The exemption turns on human review or editorial control, defined as deliberate
examination of **the substance** by a person with relevant knowledge and professional
judgement, who holds ultimate legal responsibility for publication.

**The exclusion that matters here:** superficial, solely formal, or procedural checks,
with spell-checking and grammatical correction given as the examples, **do not qualify**.

A tone-only rewrite that does not engage substance and carries no named responsible person
sits closer to the excluded category than the exempting one. **This archive did not
determine where a voice-matching rewrite falls, and the skill does not pretend to.**

Providers must separately mark synthetic output in a machine-readable format. That channel
is untouched by any amount of stylistic editing, which is worth saying plainly: a
watermark or a provenance signal does not care how the prose reads.

### What the skill does with all of this

**Nothing, except say it once and stop.**

State that disclosure is a separate question, name the two rules found, and tell the user
it depends on their platform and their jurisdiction. Then get out of the way.

**The skill gives no legal advice, and it never advises a user on whether to disclose.**
It also never presents its own output as satisfying any disclosure obligation.

---

## Part 6: What the skill legitimately claims

For the record, and for anyone reviewing the marketing copy.

**Claims the archive supports:**

- It finds, counts and names specific constructions that measured research associates with
  LLM output: style-word verbs and adjectives, present participial clauses at 2 to 5 times
  human rate, nominalizations at 1.5 to 2 times, register flatness, and punctuation habits
  departing from the user's documented profile.
- It makes text sound more like a specific person, when it has a corpus-derived profile of
  that person to work from.
- It separates factual problems from tonal ones and refuses to invent substance.

**Claims the archive refutes:**

- That the result will pass any detector.
- That a detector verdict is information about authorship.
- That editing changes a disclosure obligation.

**The positioning that survives all of it:** make it sound like the user. Detector
behavior is a side effect nobody controls, measured on populations rather than on people.
