# Testing of detection tools for AI-generated text

- **Title:** Testing of detection tools for AI-generated text
- **Authors:** Debora Weber-Wulff, Alla Anohina-Naumeca, Sonja Bjelobaba, Tomas Foltynek,
  Jean Guerrero-Dib, Olumide Popoola, Petr Sigut, Lorna Waddington
- **Journal:** International Journal for Educational Integrity, vol. 19, article 26, 2023
- **DOI:** 10.1007/s40979-023-00146-z
- **URL:** https://link.springer.com/article/10.1007/s40979-023-00146-z
- **Open access mirror:** https://eprints.whiterose.ac.uk/id/eprint/207396/1/s40979-023-00146-z.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (peer-reviewed, open access)

## Why this source matters here

The broadest head-to-head evaluation of AI text detectors located. It is the source for
the claim that detection degrades sharply once a text has been edited, which is exactly
what a voice QA pass does to a draft. A skill that rewrites drafts must know what it is
and is not doing to detector scores.

## Method

14 detection tools evaluated:

- **12 publicly available:** Check For AI, Compilatio, Content at Scale, Crossplag,
  DetectGPT, Go Winston, GPT Zero, GPT-2 Output Detector, OpenAI Text Classifier,
  Writeful GPT Detector, Writer, Zero GPT.
- **2 commercial systems:** Turnitin, PlagiarismCheck.

Texts included human-written originals, unmodified AI output, machine-translated human
text, manually edited AI text, and machine-paraphrased AI text.

## Findings

### Baseline accuracy

| Text class | Detection accuracy |
|---|---|
| Human-written text (correctly identified as human) | 96% |
| AI-generated text, unmodified | 74% |

The authors note that **all tools scored below 80% accuracy and only 5 scored over 70%.**

### Accuracy after obfuscation

| Manipulation | Accuracy |
|---|---|
| Machine-translated human text | Dropped 20 percentage points from baseline |
| **Manually edited AI text** | **about 42%** (versus 74% unmodified) |
| Machine-paraphrased AI text | **26%** |

The authors state that most AI-generated texts remain undetected when
machine-paraphrased.

### False positive spread

False positive rates ranged **from 0% (Turnitin) to 50% (GPT Zero)**. The spread across
tools is larger than the signal any one tool reports.

Machine-translated texts were flagged at particularly problematic rates, creating direct
risk for second-language students who use translation tools on their own writing.

## Conclusion stated by the authors

The available detection tools are **neither accurate nor reliable**, and should not be
used in academic settings as evidence of misconduct. They recommend a prevention-focused
approach over a detection strategy.

## Claims this source supports

1. Across 14 tools, unmodified AI text was detected at only **74%** accuracy, and every
   tool scored **below 80%**.
2. **Manual human editing of AI text dropped detection to about 42%.** Editing is the
   single most effective evasion measured here short of paraphrasing.
3. Machine paraphrasing dropped detection to **26%**.
4. False positive rates across tools spanned **0% to 50%**, meaning tool choice
   determines the verdict more than the text does.
5. Machine-translated human writing is systematically over-flagged, compounding the
   second-language bias reported elsewhere in this archive.
6. The peer-reviewed conclusion is that these tools are not reliable enough to found an
   accusation on.

## Limits of this source for our purpose

- 2023. Tool versions have changed. Turnitin's 0% false positive result in particular
  is a single evaluation on one test set and is not a general property.
- Academic-integrity framing. The test texts are student-style writing.
- The 42% figure for manually edited AI text is measured on edits made for the study,
  not on edits made by a voice-matching rewrite. Directionally relevant, not a
  prediction.
