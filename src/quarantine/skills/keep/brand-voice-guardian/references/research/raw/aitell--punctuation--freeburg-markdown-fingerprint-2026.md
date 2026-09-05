# The Last Fingerprint: How Markdown Training Shapes LLM Prose

- **Title:** The Last Fingerprint: How Markdown Training Shapes LLM Prose
- **Author:** E. M. Freeburg (independent researcher)
- **Published:** March 2026
- **arXiv id:** 2603.27006v1
- **URL:** https://arxiv.org/html/2603.27006v1
- **Fetched:** 2026-08-17
- **Source type:** academic-preprint (arXiv, NOT peer-reviewed, single independent author)

## Why this source matters here

It is the only source located that measures em dash rates ACROSS MODELS and against a
stated human baseline, and the only one that reports what happens when a model is
explicitly told not to use them. Both facts matter for a QA skill: the first tells you
the tell is provider-specific, the second tells you suppression is unreliable.

Archived with a health warning. This is a single-author preprint with no peer review.
The measured rates are used; the causal story about markdown training is reported as the
author's hypothesis, not as established.

## Method

Twelve models from five providers, roughly 240,000 generated words. Three experiments:

1. **Two-condition test.** Unconstrained generation versus prose-only prompts.
2. **Suppression gradient.** Adds an explicit prohibition on em dashes.
3. **Base versus instruct comparison.** Llama 3.1 8B before and after RLHF.

## Findings

### Measured em dash rates

| Condition | Rate, em dashes per 1,000 words |
|---|---|
| LLM output, unconstrained, across 12 models | 0.0 to 10.62 |
| Human baseline | mean 3.23, range 0.33 to 17.12 |
| GPT-4.1 with an explicit "no markdown" instruction | 9.10 |
| Llama models | 0.0 (produced none at all) |

### The two readings that matter

1. **Human range overlaps LLM range completely.** The human baseline range of 0.33 to
   17.12 per 1,000 words contains the entire observed LLM range of 0.0 to 10.62. Some
   humans use em dashes at a HIGHER rate than any model measured. Em dash density alone
   therefore cannot separate a human writer from a model.
2. **Suppression fails on some models and is unnecessary on others.** GPT-4.1 continued
   at 9.10 per 1,000 words while explicitly instructed not to use markdown. Llama
   produced zero regardless of instruction.

### Other structural findings

Under prose-only constraints, other markdown-derived features were eliminated
universally: headers, bullet points, bold emphasis, numbered lists. The em dash was the
feature that persisted. The author's hypothesis is that it occupies a dual-register
position, being simultaneously valid prose punctuation and a structural marker, and that
persistence functions as a signature of the specific fine-tuning procedure applied.

## Claims this source supports

1. Em dash rates vary enormously by provider, from zero to over 10 per 1,000 words.
2. The human baseline range fully overlaps the LLM range, so em dash density is not a
   discriminator on its own.
3. Instructing a model not to use markdown does not reliably stop em dashes on all
   models.
4. Bullet lists, headers, bold and numbered lists are markdown-derived structural
   habits that DO respond to prose constraints, unlike the em dash.

## Limits of this source for our purpose

- Not peer-reviewed. One author. No replication located.
- The human baseline construction was not extracted in this fetch, so the 3.23 mean
  cannot be traced to a named corpus from what was read.
- The markdown-training causal claim is a hypothesis presented by the author. This
  archive uses the RATES and not the explanation.
