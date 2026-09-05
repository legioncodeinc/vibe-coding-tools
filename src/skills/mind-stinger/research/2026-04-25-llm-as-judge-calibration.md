# LLM-as-Judge Calibration

**Source:** Zheng et al. 2023, *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena* (arXiv:2306.05685); RAGAS docs; Braintrust calibration guides.
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING** for the eval discipline. Cited in `guides/17-evaluation-discipline.md §3`.
**Numbers tag:** benchmarked (judge-human agreement is a measurable, reproducible quantity).

---

## TL;DR

LLM-as-judge is the workhorse for retrieval / faithfulness / routing evals, cheap and scales. It is NOT free: judge models hallucinate too. Calibrate the judge against human labels before trusting it.

Calibration procedure:

1. Sample 50-100 cases from a golden set.
2. Have a human label them (pass/fail or 0-1).
3. Run the judge on the same set.
4. Measure agreement (Cohen's kappa or simple accuracy).
5. If agreement < 0.7, refine the judge prompt or switch judge models.
6. Re-calibrate quarterly or when the judge model changes.

---

## Why calibration matters

LLM-as-judge introduces **judge bias**. Without calibration, the judge's bias becomes the eval suite's bias. Examples of common bias:

- **Position bias:** judge prefers answers in earlier positions in a comparison prompt.
- **Verbosity bias:** judge prefers longer answers.
- **Self-preference:** judge rates outputs from its own model family higher.
- **Format bias:** judge prefers a specific format (e.g., bullet points) regardless of correctness.

Calibration against human labels surfaces these biases. If kappa < 0.7, the judge isn't reliable.

---

## the deploying product's judge

`fast` model (Llama 3.1 8B) is the judge for `evaluateRetrievalPrecision()`, `evaluateRouting()`, and other LLM-based evals. Cheap, fast, and the same model family as the routing classifier.

**Critical:** when the SA changes the `modelFast` slot in `PlatformConfig`, the judge prompts need re-calibration. The new model may have different biases.

---

## Calibration cadence

| When | What |
|---|---|
| Quarterly | Re-run the human-vs-judge agreement calculation. |
| When `modelFast` slot changes | Re-calibrate before relying on the eval. |
| When judge prompt is edited | Re-calibrate. |
| When eval scores trend without obvious cause | Re-calibrate (the judge may have drifted). |

---

## Threshold (kappa)

- **kappa ≥ 0.8**: strong agreement. Trust the judge.
- **0.7 ≤ kappa < 0.8**: moderate agreement. Trust with caution; spot-check 5% of judge outputs.
- **kappa < 0.7**: judge is uncalibrated. Refine or switch.

For the deploying product's `evaluateRetrievalPrecision()` (binary "is this chunk relevant?" labeling), Llama 3.1 8B as judge typically achieves 0.75-0.85 kappa with a well-crafted prompt.

---

## Anti-patterns

- **Copy-pasting a judge prompt from a vendor blog without calibration.** Vendor's rubric ≠ the deploying product's rubric. Calibrate.
- **Using the judge model as the evaluated model.** A model is biased toward outputs that look like its own. Use a different model (or model family) where possible.
- **Single-pass labeling without inter-rater agreement on the human side.** Two humans disagreeing means the rubric is ambiguous; fix the rubric before trusting the judge.

---

## Implications

- Judge prompt copied from a blog → **must-fix**.
- Judge model swapped without recalibration → **must-fix**.
- No quarterly calibration → **must-fix**.
- Eval scores trending but no calibration → **must-fix** (the judge may be the cause, not the model).
- See `guides/17-evaluation-discipline.md §3`.
