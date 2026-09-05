# GPT detectors are biased against non-native English writers

- **Title:** GPT detectors are biased against non-native English writers
- **Authors:** Weixin Liang, Mert Yuksekgonul, Yining Mao, Eric Wu, James Zou
- **Journal:** Patterns (Cell Press), published 10 July 2023
- **Preprint:** arXiv:2304.02819, submitted 6 April 2023
- **URL read:** https://arxiv.org/pdf/2304.02819 and https://arxiv.org/abs/2304.02819
- **Journal URL:** https://www.cell.com/patterns/fulltext/S2666-3899(23)00130-7 (returned
  HTTP 403 on fetch; arXiv version read instead)
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed, Patterns)

## Why this source matters here

This is the source that decides how a voice QA skill must POSITION itself. If detectors
systematically misfire on a specific class of human writer, then "make it pass a
detector" is not a coherent product goal, and telling a user their draft is safe because
a detector cleared it is actively misleading.

## Method

Seven widely used GPT detectors run over:

- 91 TOEFL essays written by non-native English speakers.
- A set of US eighth-grade student essays (native writers).

Detectors tested: Originality.AI, Quil.org, Sapling, OpenAI, Crossplag, GPTZero,
ZeroGPT.

## Findings

### False positive rates

| Corpus | Result |
|---|---|
| TOEFL essays, non-native writers | Over half flagged as AI-generated. **Average false positive rate 61.22%** |
| US eighth-grade essays, native writers | Near-perfect accuracy, correctly identified as human |

### Unanimous misclassification

**All seven detectors unanimously identified 18 of the 91 TOEFL essays, or 19.78%, as
AI-authored.** Roughly one in five genuine human essays was condemned by every tool
tested at once. Detector agreement is therefore not evidence of correctness.

### The prompt that fixed it

TOEFL essays were revised with the instruction "Enhance the word choices to sound more
like that of a native speaker". The **average false positive rate fell by 49.45
percentage points, from 61.22% to 11.77%.**

This is the finding with the sharpest implication. What the detectors were measuring was
not machine authorship. It was vocabulary range.

### Mechanism

Detectors lean on text perplexity. Lower perplexity means more predictable, more
constrained language. Non-native authors exhibited limited linguistic variability,
producing lower perplexity, which the detectors read as machine-generated. The paper
concludes that GPT detectors may penalize writers with limited linguistic expressions.

## Authors' recommendation

The authors call for a broader conversation about the ethical implications of deploying
ChatGPT content detectors, and caution against their use in evaluative or educational
settings.

## Claims this source supports

1. Seven mainstream detectors averaged a **61.22% false positive rate** on genuine human
   essays by non-native English writers.
2. The same detectors were near-perfect on native-writer essays. The failure is
   distributed unevenly across a protected-adjacent class of writer.
3. **19.78% of the non-native essays were unanimously misclassified by all seven.**
   Detector consensus does not mean the answer is right.
4. Raising vocabulary sophistication cut the false positive rate to 11.77%, showing the
   detectors track lexical range rather than authorship.
5. The mechanism is perplexity, which is a proxy for predictability, not a proxy for who
   typed it.
6. The paper's own authors advise against using these tools evaluatively.

## Limits of this source for our purpose

- 2023 study. Detector vendors have shipped many versions since. No located replication
  covers the current generation.
- Essay register, academic testing context. Not social posts or business email.
- 91 essays is a small corpus.
