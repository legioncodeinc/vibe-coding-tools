# Sentiment Word Aware Multimodal Refinement for Multimodal Sentiment Analysis with ASR Errors

- **Title:** Sentiment Word Aware Multimodal Refinement for Multimodal Sentiment Analysis with ASR Errors (Yang Wu, Yanyan Zhao, Hao Yang, Song Chen, Bing Qin, Harbin Institute of Technology; Xiaohuan Cao, Wenting Zhao, AI Lab of China Merchants Bank). arXiv:2203.00257v1, 1 March 2022. Findings of ACL 2022.
- **URL:** https://arxiv.org/abs/2203.00257
- **Fetched:** 2026-08-17
- **Source type:** academic (arXiv preprint, ACL Findings paper)

## Why this source matters for client-health-radar

This is the paper that isolates the specific failure mechanism: the recognizer gets the
sentiment-bearing word wrong. It supplies the two numbers the skill needs to justify never
trusting a sentiment score off a transcript without the quote attached.

## Extracted claims

Setup: the authors rebuilt CMU-MOSI three times by replacing the human transcripts with the
output of three real recognizers (SpeechBrain, IBM Watson Speech to Text, iFlytek), then ran
the then state of the art multimodal sentiment model, Self-MM.

- **The problem is stated plainly in the abstract:** "the performance of the state-of-the-art
  models decreases sharply when they are deployed in the real world. We find that the main
  reason is that real-world applications can only access the text outputs by the automatic
  speech recognition (ASR) models, which may be with errors... in some cases the sentiment
  words, the key sentiment elements in the textual modality, are recognized as other words,
  which makes the sentiment of the text change and hurts the performance of multimodal
  sentiment models directly."
- **Sentiment word substitution error rate, measured.** "The percentage of the sentiment word
  substitution error on the MOSI-IBM is 17.6%, which means about 17 of 100 utterances have
  this type of error."
- **The cost of one substituted sentiment word, measured.** "we split the test data of
  MOSI-IBM into two groups by whether there is a substitution error. We evaluate Self-MM on
  the test data and observe that the misclassification rate of the group in which the
  substitution error exists is higher than the other group (29.9% vs 15.8%)."
- **Worked example of the failure.** "The gold text is 'And I was really upset about it', but
  the ASR model (SpeechBrain) recognizes the sentiment word 'upset' wrongly as 'set', which
  results in the change of the sentiment semantics of the text."
- **The proposed fix needs audio and video, which a text transcript does not have.** The SWRM
  model detects the likely sentiment word position and refines the embedding "by incorporating
  multimodal clues", and the ablation confirms the multimodal part is load-bearing: "Comparing
  the SWRM w/o Multi-modal between SWRM, we can find that the model benefits from the visual
  and acoustic features."
- The case study shows the mechanism: the model spots "a mismatch between the negative word
  'cruel' and either the smile or the excited tone" and recovers the gold word "cool" from
  candidates. Without the smile and the tone there is no mismatch to spot.
- Stated conclusion: "we observe an obvious performance drop when the SOTA MSA model is
  deployed in the real world, and through in-depth analysis, we find that the sentiment word
  substitution error is a very important factor causing it."

## Direct implication for the skill

Roughly one in six utterances loses or corrupts its sentiment-bearing word before the text
ever reaches a reader, and the utterances that suffer that error are misclassified at close
to twice the rate of the ones that do not. The published remedy requires the face and the
voice. A skill reading Littlebird transcripts has neither. Therefore: quote the line, show it
to the user, and let the human supply the tone. Never present a computed sentiment number as
the finding.
