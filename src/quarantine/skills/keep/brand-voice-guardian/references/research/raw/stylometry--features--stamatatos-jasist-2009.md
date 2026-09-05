# A Survey of Modern Authorship Attribution Methods

- **Title:** A Survey of Modern Authorship Attribution Methods
- **Author:** Efstathios Stamatatos
- **Journal:** Journal of the American Society for Information Science and Technology,
  vol. 60, no. 3, 2009, pp. 538 to 556
- **URL:** https://icsdweb.aegean.gr/stamatatos/papers/survey.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed survey, JASIST)

## Why this source is outside the 6-month window and kept anyway

The default research window for this archive is the last 6 months. This survey is from
2009. It is kept because it is the canonical statement of WHICH TEXTUAL FEATURES CARRY
AUTHORIAL SIGNAL, and because that question is prior to, and independent of, the LLM
question. Nothing located in the recent window restates the feature taxonomy with this
authority. Where a claim in this archive concerns what makes writing recognizably one
person's, it traces here.

## The feature taxonomy

Five categories:

| Category | Contents |
|---|---|
| **Lexical** | word and sentence length, vocabulary richness, word frequencies, word n-grams, errors |
| **Character** | character types, character n-grams, compression-based measures |
| **Syntactic** | part-of-speech tags, chunks, sentence structure, rewrite rules |
| **Semantic** | synonyms, semantic dependencies, functional features |
| **Application-specific** | structural, content-specific, language-specific features |

## Findings that matter for a voice QA pass

### Function words are the best authorial discriminators

The survey states that the most common words (articles, prepositions, pronouns and
similar) are found to be among the best features to discriminate between authors.

The reason given is the important part: such words are **used in a largely unconscious
manner by the authors and they are topic-independent.** Function words capture pure
stylistic choices of the authors across different topics.

Practical consequence: the parts of a person's writing that identify them are the parts
they are not thinking about. A voice profile built only on their vocabulary of favorite
NOUNS captures their subject matter, not their authorship.

### Character n-grams are highly effective

The survey reports character n-grams as among the most effective measures, outperformed
in one cited experiment only by a combination of frequent words and punctuation marks.
Punctuation appears in that winning combination, which is the survey's support for
treating punctuation habits as authorial rather than cosmetic.

### Vocabulary richness measures are unreliable alone

Vocabulary size depends heavily on text length. Various functions have attempted
stability over text length with questionable results. Such measures are considered
unreliable to be used alone.

Practical consequence: do not judge a short comment against a long-form voice profile on
vocabulary breadth. The measure is length-confounded.

### Text length has no established threshold

The survey identifies text length as perhaps the most important issue, and concludes
that it is not yet possible to define a text-length threshold. Some studies show
promising results on short texts of under 1,000 words, but findings remain inconclusive.

## Claims this source supports

1. Function words (articles, prepositions, pronouns) are among the best discriminators of
   authorship, because they are deployed unconsciously and are topic-independent.
2. Punctuation habits belong in the authorial feature set, not the cosmetic one.
3. Character n-grams are among the most effective attribution features.
4. Vocabulary richness is length-confounded and unreliable on its own.
5. There is no established minimum text length for reliable attribution, and short-text
   attribution remains inconclusive.
6. Topic-independence is the property that makes a feature authorial. A feature that
   changes when the subject changes is measuring the subject.

## Limits of this source for our purpose

- 2009. Predates neural methods entirely, and predates LLMs by more than a decade.
- Written for attribution among a closed set of candidate authors, which is a different
  task from verifying that one known author wrote a given draft.
- Says nothing about machine-generated text, which did not exist as a category in its
  frame.
