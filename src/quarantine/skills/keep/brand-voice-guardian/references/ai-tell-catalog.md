# The AI tell catalog

The checkable inventory. Every entry names something you can COUNT in a draft, not
something you can sense about it.

Read `research/distilled-ai-detection-and-stylometry.md` before changing anything here.

---

## How to use this file

**Count. Do not vibe.** Every tell below has a counting rule. Run the rule, record the
number, and report the number. "This reads like AI" is not a finding. "Four present
participial clause openers in eleven sentences" is a finding, because the user can check
it and disagree with it.

**Every flag names its evidence tier.** Three tiers, and they are about how well
evidenced the TELL is, not how severe the instance is:

| Tier | Meaning |
|---|---|
| **MEASURED** | A peer-reviewed or measured study in the archive reports a rate or a ratio for this feature. The number is cited. |
| **STRUCTURAL** | Observed and reported in the archive, but without a human-baseline rate to compare against. |
| **CRAFT** | Authored reasoning. No measurement in the archive. Widely believed, not evidenced here. Say so when flagging it. |

CRAFT tells are not banned. They are the majority of what people mean by "AI tells" and
several of them are genuinely useful. They are labeled because a user deserves to know
which flags rest on a study and which rest on an opinion.

**Nothing in this catalog is proof of machine authorship.** Every feature listed appears
in genuine human writing. See `detection-reality.md`. The catalog identifies text that
does not sound like the user, which is a different and answerable question.

**This catalog dates.** Marker vocabulary is measured on the 2024 model generation, and
different providers have measurably different house styles, with em dash rates spanning
0.0 to 10.62 per 1,000 words across twelve models
(`research/distilled-ai-detection-and-stylometry.md`, section 2). Re-verify before
treating any word list as current.

---

## Category 1: Punctuation

### 1.1 The em dash and en dash

- **Tier:** MEASURED, and the measurement cuts both ways.
- **Count:** Occurrences of the em dash character and the en dash character. Report a raw
  count and a rate per 1,000 words.
- **Evidence for:** In 10,000 ecology abstracts, em dash frequency more than doubled
  between 2021 and 2025, and no other punctuation mark showed a comparable increase
  (`research/distilled-ai-detection-and-stylometry.md`, section 3).
- **Evidence against treating it as proof:** Measured LLM rates span 0.0 to 10.62 per
  1,000 words across twelve models. The human baseline is a mean of 3.23 with a range of
  0.33 to 17.12. **The human range fully contains the LLM range.** Some humans use em
  dashes more heavily than any model measured (same section).
- **How to flag it:** As a VOICE violation when the user's voice profile says they do not
  use them, which is the common case in this marketplace. Never as evidence of machine
  authorship on its own.
- **Severity:** Critical when the voice profile forbids them. See `severity-and-registers.md`.
- **Fix:** Deterministic replacement, not a request. Telling a model not to use em dashes
  is unreliable: GPT-4.1 continued at 9.10 per 1,000 words while explicitly instructed not
  to use markdown (same section). Do the substitution yourself. A spaced hyphen, a comma,
  a colon, a full stop, or a recast sentence, whichever the user's profile supports.

### 1.2 The paired-dash aside

- **Tier:** CRAFT.
- **Count:** Sentences containing a parenthetical set off by dashes on both sides.
- **Why it is separate from 1.1:** Replacing the characters without touching the
  construction leaves a sentence that still has the shape. A writer who does not use em
  dashes usually does not build the aside either. They start a new sentence.
- **Fix:** Break it into two sentences, or drop the aside if it is not carrying weight.

### 1.3 The semicolon in casual register

- **Tier:** CRAFT. Note that the one em dash measurement in the archive observed
  semicolons DECLINING over the same window, and the author of that measurement was
  explicitly unsure why (`research/distilled-ai-detection-and-stylometry.md`, section 3).
  Do not build a strong claim on this.
- **Count:** Semicolons, against register. Zero expected in short social and message
  registers for most writers.
- **Fix:** Full stop. Almost always.

### 1.4 The colon-led list in prose

- **Tier:** CRAFT.
- **Count:** Sentences of the form "There are three things: X, Y, and Z" and similar
  colon-then-enumeration constructions.
- **Fix:** Say the things. Drop the announcement that you are about to say them.

---

## Category 2: Lexical

### 2.1 Style-word verbs and adjectives

- **Tier:** MEASURED, and this is the most important framing in the catalog.
- **The finding:** The 2024 vocabulary shift in published writing was concentrated in
  STYLE words, not content words. Of 379 excess style words identified in 2024, **66% were
  verbs and 14% were adjectives**. For contrast, the Covid-era excess vocabulary was
  **79.2% nouns** (`research/distilled-ai-detection-and-stylometry.md`, section 1).
- **Consequence:** Weight verbs and adjectives. A tell list made mostly of nouns is
  measuring subject matter, not machine authorship.

**Measured markers, with their ratios, from the archive:**

| Word | Measured ratio | Note |
|---|---|---|
| delves, delve, delving | r = 28.0 | Highest measured ratio in the archive |
| underscores, underscore | r = 13.8 | |
| showcasing, showcase | r = 10.7 | |
| camaraderie | 171x human rate (GPT-4o) | |
| tapestry | 147x human rate (GPT-4o) | |

**Measured common-word markers by frequency gap:** potential (0.052), findings (0.041),
crucial (0.037).

**The measured ten-word common set, verbatim:** across, additionally, comprehensive,
crucial, enhancing, exhibited, insights, notably, particularly, within.

All of the above from `research/distilled-ai-detection-and-stylometry.md`, section 1.

**Extended list, tier CRAFT, no measurement in this archive:** leverage as a verb,
seamless, robust, navigate the landscape, unlock, elevate, realm, plethora, myriad,
testament to, moreover, furthermore, thus, hence, foster, harness, embark, pivotal,
intricate, multifaceted, nuanced, holistic, vibrant, bustling, ever-evolving,
game-changer, at the forefront, in today's fast-paced.

These overlap heavily with the ruleset in this marketplace's voice skill template
(`voice-skill-integration.md`). Where the user's own voice skill lists a word, that
listing outranks this catalog, because it was derived from their actual corpus.

- **Count:** Instances per 100 words, listed by word.
- **Caution:** Several of these are ordinary English. `crucial`, `potential`, `findings`,
  `within` and `particularly` all appear constantly in genuine human writing. A single
  instance is not a finding. A cluster in a short draft is.
- **Fix:** The user's own word for the same job, taken from their voice profile. Where no
  profile exists, the plainest available synonym. Never a fancier one.

### 2.2 Words the user does not use

- **Tier:** MEASURED as a principle, through stylometry. Function words are among the best
  discriminators between authors because they are used largely unconsciously and are
  topic-independent (`research/distilled-ai-detection-and-stylometry.md`, section 5).
- **Count:** Words present in the draft that do not appear anywhere in the user's corpus,
  excluding proper nouns and subject-specific terms.
- **Why this beats the generic list:** It is calibrated to one person. The generic list is
  calibrated to a population.
- **Requires:** An installed voice skill with a corpus. Unavailable otherwise. Say so.

### 2.3 The vocabulary-richness trap

- **Tier:** MEASURED, as a warning about the method rather than as a tell.
- Vocabulary richness depends heavily on text length and is considered unreliable used
  alone (`research/distilled-ai-detection-and-stylometry.md`, section 5).
- **Rule:** Never judge a short comment against a long-form voice profile on vocabulary
  breadth. The measure is length-confounded and the flag will be wrong.

---

## Category 3: Grammar and sentence construction

This category is the highest-yield one in the catalog and the one most tell lists miss
entirely, because these features are invisible unless you are looking for them.

### 3.1 The present participial clause

- **Tier:** MEASURED. **The largest single multiple in the archive.**
- **The finding:** Instruction-tuned LLMs use present participial clauses at **2 to 5
  times the human rate** (`research/distilled-ai-detection-and-stylometry.md`, section 2).
- **What it looks like:** A clause headed by an `-ing` verb, usually trailing the main
  clause, occasionally opening it. "The team shipped the feature, **creating** a new
  problem." "**Building** on that, we..." "...**, allowing** users to..."
  "...**, ensuring** that..." "...**, highlighting** the need for..."
- **Count:** Number of participial clauses, and the count of sentences containing one, as
  a fraction of total sentences. Report both.
- **The trailing `-ing` comma clause is the signature form.** Comma, then an `-ing` verb,
  then a consequence. Search for it directly.
- **Fix:** Break into two sentences, or make the consequence its own clause with a real
  subject. "The team shipped the feature. That created a new problem."
- **Severity:** Structural. Three or more in a short piece marks the whole draft.

### 3.2 Nominalization

- **Tier:** MEASURED. **1.5 to 2 times the human rate** in instruction-tuned LLM output
  (`research/distilled-ai-detection-and-stylometry.md`, section 2).
- **What it looks like:** A verb turned into a noun and given a weak verb to carry it.
  "the implementation of", "the optimization of", "provide clarification", "conduct an
  evaluation", "make a determination", "the utilization of".
- **Count:** Instances per 100 words. Also count the abstract-noun endings: `-tion`,
  `-ment`, `-ance`, `-ity`, `-ization`.
- **Fix:** Return the verb. "We implemented it." "We optimized it." "We decided."

### 3.3 Noun-heavy information density

- **Tier:** MEASURED as a direction, elevated in instruction-tuned models
  (`research/distilled-ai-detection-and-stylometry.md`, section 2). No human-baseline rate
  is available for a clean threshold, so the threshold below is CRAFT.
- **What it looks like:** Long noun phrases with stacked modifiers. "a comprehensive
  customer onboarding experience optimization framework".
- **Count:** Longest noun phrase in the draft, measured in words. Count noun phrases of
  four or more words.
- **Fix:** Unstack it into a clause with a verb in it.

### 3.4 `That` clauses as subjects, and phrasal coordination

- **Tier:** MEASURED as elevated, no baseline rate
  (`research/distilled-ai-detection-and-stylometry.md`, section 2).
- **What it looks like:** "That the project succeeded was..." and heavy use of paired
  coordinate phrases, "the speed and the accuracy", "the clarity and the tone".
- **Count:** Instances.

### 3.5 Passive voice, and why it is NOT a simple flag

- **Tier:** MEASURED, and the direction is the opposite of the folk belief.
- **The finding:** GPT-4o uses agentless passive at roughly **half** the human rate
  (`research/distilled-ai-detection-and-stylometry.md`, section 2).
- **Consequence:** Flagging passive voice as an AI tell is backwards for at least one
  major model. Do not carry the rule over from general writing advice. If passive rate is
  reported at all, report it against the user's own profile, not against a universal
  target.

---

## Category 4: Structure

### 4.1 Register flatness, the whole-piece tell

- **Tier:** MEASURED. **The most important tell in this catalog after 3.1.**
- **The finding:** LLMs demonstrate reduced stylistic variation relative to human writers,
  and instruction-tuned variants **fail to adapt style across registers**
  (`research/distilled-ai-detection-and-stylometry.md`, section 2).
- **What it looks like:** A quick reply written at the same formality as a whitepaper. A
  text message with a topic sentence. Consistent tone from first word to last with no
  loosening anywhere.
- **Count:** Not a span count. Judge the whole piece against the target register, which
  `severity-and-registers.md` requires you to establish FIRST.
- **Why it matters more than the word list:** It is the tell that survives word
  substitution. A draft can pass every lexical check and still be obviously wrong because
  it holds one temperature throughout.
- **Fix:** Not a find-and-replace. Re-draft to the register. See
  `severity-and-registers.md`.

### 4.2 Markdown bleed

- **Tier:** MEASURED as behavior. Headers, bullet points, bold emphasis and numbered lists
  are markdown-derived habits that DO respond to prose constraints, unlike the em dash
  (`research/distilled-ai-detection-and-stylometry.md`, section 3).
- **What it looks like:** Bold lead-ins on every paragraph, a bulleted list inside a social
  post, a header in an email, numbered points in a comment.
- **Count:** Bold spans, bullets, headers, numbered items. Against register: near zero
  expected in social and message registers for most writers.
- **Fix:** Prose. Or, where a list genuinely belongs, the user's own list format from their
  corpus, which is frequently line breaks with no markers at all.

### 4.3 Sentence-length uniformity and low burstiness

- **Tier:** CRAFT. **Flag this honestly.** No measured study of burstiness or
  sentence-length variance was located in this sweep. Every source found for it was
  detector-vendor or humanizer marketing and was excluded
  (`research/distilled-ai-detection-and-stylometry.md`, section 9, gap 2). Reduced
  stylistic variation IS measured, but not as a sentence-length statistic.
- **Count:** Sentence lengths in words. Report mean, standard deviation, minimum and
  maximum. The numbers are real even though the threshold is not evidenced.
- **What to look for:** A tight cluster with no very short sentence and no very long one.
  The absence of a three-word sentence in a long piece is the usual shape.
- **Fix:** Break one long sentence in two. Let one land short. Do not manufacture variance
  mechanically across the whole piece, which produces its own pattern.
- **Say when flagging:** That this rule is authored craft, not a measured threshold.

### 4.4 The triad

- **Tier:** CRAFT. No measured study located
  (`research/distilled-ai-detection-and-stylometry.md`, section 9, gap 3).
- **What it looks like:** Lists of exactly three, especially three parallel items of
  similar length, and especially more than one triad in a short piece.
- **Count:** Number of three-item lists. Number of three-item lists whose items are within
  two words of each other in length.
- **Fix:** Two items, or four. Or three of visibly unequal weight. The tell is the
  symmetry, not the number.

### 4.5 Symmetrical paragraphs

- **Tier:** CRAFT (same gap).
- **Count:** Paragraph lengths in sentences and in words. Report the spread.
- **What to look for:** Every paragraph within a sentence or two of the same length, each
  opening with a topic sentence and closing with a summary line.
- **Fix:** One paragraph that is a single line. Human writing has them.

### 4.6 The tidy conclusion

- **Tier:** CRAFT (same gap).
- **What it looks like:** A closing paragraph that restates what was already said and
  resolves the tension the piece raised. Openers: "In conclusion", "Ultimately", "At the
  end of the day", "The key takeaway", "Whether you", "One thing is clear".
- **Count:** Present or absent. Binary.
- **Fix:** Delete it. Check whether the piece ends better one paragraph earlier. It usually
  does.
- **Note:** This is the single most reliable CRAFT tell in practice and one of the least
  evidenced in this archive. Both facts get stated.

### 4.7 Throat-clearing openers

- **Tier:** CRAFT.
- **What it looks like:** The first sentence establishes that the topic exists before
  saying anything about it. "In the world of X...", "As we all know...", "X has become
  increasingly important...", "When it comes to...".
- **Count:** Present or absent, on the opener specifically.
- **Fix:** Delete the first sentence and check whether the piece still works. It usually
  starts better.

---

## Category 5: Rhetorical habits

### 5.1 Hedging and qualification density

- **Tier:** CRAFT, and the archive actively complicates it. Downtoner frequency
  differences are reported and they run in **opposite directions by model family**: less
  frequent in GPT models, more frequent in Llama base variants
  (`research/distilled-ai-detection-and-stylometry.md`, section 9, gap 4).
- **Consequence:** There is no clean "AI hedges more" rule. Do not assert one.
- **Count:** Hedges per 100 words: may, might, could, perhaps, generally, typically,
  often, some, various, relatively, arguably, tend to, it is worth noting, it is important
  to.
- **How to flag:** Against the USER's own hedging rate from their profile, not against a
  universal target. A person who hedges constantly is not producing an AI tell by hedging.
- **The one exception that is not a hedging question:** A hedge that was in the user's
  source material and got dropped in the draft is a FACT problem, not a tone problem. See
  `fact-check-pass.md`.

### 5.2 The false balance move

- **Tier:** CRAFT.
- **What it looks like:** Every claim immediately followed by its counterweight. "X is
  powerful. However, it is not a silver bullet." "While Y has benefits, it also has
  drawbacks."
- **Count:** Instances of a claim followed within one sentence by a concessive.
- **Fix:** Pick one. If the counterweight matters, give it its own weight. If it does not,
  cut it.

### 5.3 Enthusiasm with no referent

- **Tier:** CRAFT.
- **What it looks like:** Strong positive adjectives attached to nothing specific.
  "incredible results", "a powerful approach", "truly transformative", "game-changing".
- **Count:** Evaluative adjectives with no number, name, or concrete noun within the same
  sentence.
- **Fix:** The specific thing, or delete. **Do not invent the specific thing.** If the
  draft says "incredible results" and supplies no number, the correction is to cut the
  adjective, not to supply a number. See the hard rule in SKILL.md.

### 5.4 Uniform politeness

- **Tier:** CRAFT.
- **What it looks like:** Every request softened identically, every disagreement
  cushioned, no sentence with an edge on it anywhere.
- **Fix:** Against the user's profile. Some people are uniformly polite. That is their
  voice and it is not a tell.

---

## Category 6: The user-specific layer

Everything above is population-level. This layer is the one that actually identifies a
person, and it only exists when a voice skill is installed.

Function words, the most common words in the language such as articles, prepositions and
pronouns, are among the best discriminators between authors, because they are used
largely unconsciously and are topic-independent
(`research/distilled-ai-detection-and-stylometry.md`, section 5). Punctuation habits belong
in the same authorial category, appearing alongside frequent words in the strongest
feature combination reported (same section).

So: **the parts of a person's writing that identify them are the parts they are not
thinking about.** A voice profile built on their favorite topic vocabulary captures their
subject matter, not their authorship.

Check these against the profile, in this order:

1. **Punctuation habits.** Dash usage. Ellipsis usage. Comma density. Whether they drop
   question marks in messages. Whether they use exclamation marks and at what rate.
2. **Contraction rate.** Highly individual, entirely unconscious, and one of the fastest
   ways a rewrite goes wrong.
3. **Sentence-opener inventory.** Which words they actually start sentences with.
4. **Line-break rhythm.** Where they break. Whether they write single-line paragraphs.
5. **Address terms and filler.** How they open, how they close, what they say when they
   have nothing to say.
6. **Capitalization and casing habits.** Lowercase openers, all-caps emphasis.
7. **Emoji and hashtag rate**, with the real numbers from their profile.
8. **Typos and imperfections they leave in.** A draft with none is a tell in itself.

Where the voice profile gives a number, use the number. This layer outranks every generic
entry above it, because it was derived from the user's actual corpus rather than from a
population.

---

## What the catalog output looks like

The tell inventory ships as a table. Concrete, countable, checkable:

| # | Tell | Category | Tier | Count | Rate | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Em dash | Punctuation | MEASURED | 6 | 12.4 per 1k words | Critical | Voice profile: never uses them |
| 2 | Trailing participial clause | Grammar | MEASURED | 4 | 4 of 11 sentences | Structural | 2 to 5x human rate |
| 3 | Tidy conclusion | Structure | CRAFT | 1 | final paragraph | Structural | Authored craft, no measurement |
| 4 | Style-word verbs | Lexical | MEASURED | 3 | delve x1, underscore x2 | Moderate | r = 28.0, r = 13.8 |

Totals by severity and by tier go at the top. A user who disagrees with a flag can point
at the row and say why, which is the whole point of counting.
