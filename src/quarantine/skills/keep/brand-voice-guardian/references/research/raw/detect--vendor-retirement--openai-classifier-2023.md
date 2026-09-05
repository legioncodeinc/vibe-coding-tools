# New AI classifier for indicating AI-written text (and its retirement)

- **Title:** New AI classifier for indicating AI-written text
- **Publisher:** OpenAI
- **Published:** 31 January 2023. Retirement notice dated 20 July 2023.
- **URL:** https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (first-party vendor announcement, and the strongest
  possible source for its own claim because it is a vendor reporting against interest)

## Why this source matters here

The company with the most training data, the most model access, and the most commercial
incentive to ship a working AI text detector, built one, measured it, and withdrew it.
That is the most persuasive single fact available about the state of detection, and it
comes from the vendor's own page.

## Findings

### The retirement notice, verbatim

"As of July 20, 2023, the AI classifier is no longer available due to its low rate of
accuracy."

The classifier ran for under six months.

### Measured performance, as stated by OpenAI

| Metric | Value |
|---|---|
| True positive rate (correctly identifies AI-written text) | **26%** |
| False positive rate (incorrectly labels human-written text as AI-written) | **9%** |

Three quarters of AI text passed. Nearly one in ten human texts was condemned.

### Stated limitations, as listed by OpenAI

1. Very unreliable on short texts, defined as **below 1,000 characters**.
2. Human-written text will sometimes be **incorrectly but confidently** labeled as
   AI-written.
3. Performs significantly worse in non-English languages, and is unreliable on code.
4. Cannot reliably identify highly predictable text, where the correct answer is always
   the same.
5. **AI-written text can be edited to evade the classifier.**
6. Neural network classifiers are poorly calibrated outside their training data.

## Claims this source supports

1. OpenAI's own detector caught **26%** of AI text and falsely accused **9%** of human
   text, and was withdrawn for low accuracy after under six months.
2. Detection is unreliable below 1,000 characters. Most social posts, comments, and
   emails are shorter than that, which means most of what this skill reviews is below
   the length at which any detector was ever reliable.
3. Confident-but-wrong human misclassification is a named limitation by the vendor, not
   an outside criticism.
4. Editing AI text to evade a classifier is acknowledged by the vendor as effective.
5. Detector calibration does not hold outside training data.

## Limits of this source for our purpose

- 2023. It describes one retired product, not the current detector market.
- It is a product page, not a study. The 26% and 9% figures carry no published
  methodology, sample, or confidence interval.
- The existence of the retirement does not prove that no vendor has since done better.
  It proves that the best-positioned vendor could not in 2023 and chose to say so.
