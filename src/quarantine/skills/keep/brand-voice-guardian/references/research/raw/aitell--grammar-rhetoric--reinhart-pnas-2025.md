# Do LLMs write like humans? Variation in grammatical and rhetorical styles

- **Title:** Do LLMs write like humans? Variation in grammatical and rhetorical styles
- **Authors:** Alex Reinhart, David West Brown, Ben Markey, Michael Laudenbach, Kachatad
  Pantusen, Ronald Yurko, Gordon Weinberg
- **Journal:** Proceedings of the National Academy of Sciences, vol. 122, article
  e2422455122, 2025. DOI 10.1073/pnas.2422455122
- **Preprint read:** arXiv:2410.16107v1, 22 October 2024
- **URL:** https://arxiv.org/pdf/2410.16107v1
- **Journal URL:** https://www.pnas.org/doi/10.1073/pnas.2422455122 (returned HTTP 403 on
  fetch; the arXiv preprint was read instead and is cited as the read source)
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed, PNAS; preprint version read)

## Why this source matters here

This is the archive's evidence for **grammatical and structural** tells rather than
vocabulary tells. It is corpus-comparative, uses an established linguistic feature set
(Biber features), and it measures the thing a voice QA pass actually needs: how LLM
sentences are BUILT differently, and whether LLM output varies as much as human output.

## Method

Two parallel corpora constructed so that human and LLM texts answer the same prompts:

- **COCA AI Parallel (CAP)**: 12,000 human texts drawn from the Corpus of Contemporary
  American English across 8 registers.
- **Human AI Parallel English (HAP-E)**: 12,000 human texts from 6 sources (academic,
  news, fiction, spoken, blogs, TV and movie scripts).

Final analyzed sets: 9,615 COCA texts and 8,290 HAP-E texts with complete responses from
all six LLMs tested. Comparison is on Biber lexicogrammatical features.

## Findings

### Measured grammatical differences

| Feature | LLM behavior versus human |
|---|---|
| Present participial clauses | Instruction-tuned LLMs use them at **2 to 5 times the human rate** |
| Nominalizations | **1.5 to 2 times** the human rate |
| Agentless passive voice | GPT-4o at roughly **half** the human rate; Llama base models closer to human |
| Noun-heavy information density | Elevated in instruction-tuned models |
| `that` clauses as subjects | Elevated |
| Phrasal coordination | Elevated |
| Downtoners (barely, nearly) | Less frequent in GPT models, more frequent in Llama base variants |

### Lexical grandiosity with measured multiples

GPT-4o overuses specific words relative to human rate:

| Word | Multiple of human rate |
|---|---|
| camaraderie | 171x |
| tapestry | 147x |

The paper characterizes these as words that connote some form of complex relation among
objects, producing a grandiose tone.

### Instruction tuning makes output LESS human

The single most useful finding in this paper for a voice QA tool. The authors state that
instruction tuning appears to make the model output less human, not more: the Llama 3
base models use features at rates similar to human texts, while GPT-4o and Llama 3
instruction-tuned models show much wider variation.

### Reduced stylistic variation and failure to adapt register

LLMs demonstrate reduced stylistic variation compared with human writers. Base models
better match human writing diversity. Instruction-tuned variants fail to adapt style
across registers.

This is direct evidence for the **register-drift tell**: a human writes an academic
paragraph and a blog paragraph differently, and an instruction-tuned model flattens the
difference.

### Detection generalization is poor

Random forest classifiers on Biber features achieved over 98% accuracy separating an
individual LLM from humans within the study corpora. Performance dropped to roughly 50%
on an external dataset (the M4 corpus). The authors read this as limited
generalizability.

Models were also not reliably confused with one another. Classification errors mostly
confused Llama 3 8B with Llama 3 70B rather than conflating different model families,
which indicates per-provider house styles rather than one uniform "AI style".

## Claims this source supports

1. LLM prose differs from human prose in measurable GRAMMAR, not just word choice:
   participial clauses, nominalizations, noun-heavy density, passive rate.
2. Present participial clauses at 2 to 5 times human rate is the largest single
   grammatical multiple reported here, which makes it the highest-yield structural tell.
3. Instruction-tuned models show LESS stylistic variation than humans and fail to adapt
   across registers. Register flatness is a real, measured tell.
4. Instruction tuning moves output further from human baseline, not closer.
5. There is no single "AI style". Providers have distinguishable house styles, so a tell
   list is model-generation-specific and dates.
6. Feature-based detection that scores 98% in-corpus can fall to about 50% out of
   corpus. In-corpus accuracy claims do not transfer.

## Limits of this source for our purpose

- Registers covered are published and broadcast registers. Short social comments and
  client emails are not among the 8 COCA registers analyzed.
- Feature rates are reported as multiples in the preprint text read here. Per-register
  breakdowns were not extracted.
- Model versions tested are of the 2024 generation.
