# Speech Emotion Recognition with ASR Transcripts: A Comprehensive Study on Word Error Rate and Fusion Techniques

- **Title:** Speech Emotion Recognition with ASR Transcripts: A Comprehensive Study on Word Error Rate and Fusion Techniques (Yuanchao Li, Peter Bell, Catherine Lai, Centre for Speech Technology Research, University of Edinburgh). arXiv:2406.08353v3, 23 March 2025.
- **URL:** https://arxiv.org/abs/2406.08353
- **Fetched:** 2026-08-17
- **Source type:** academic (arXiv preprint, speech technology research group)

## Why this source matters for client-health-radar

The skill reads sentiment off transcribed client calls. This is the benchmark paper on what
happens to emotion and sentiment models when the text comes from a speech recognizer
instead of a human transcriber. It is the direct evidence for how much the skill is allowed
to trust a sentiment reading taken off a Littlebird transcript.

## Extracted claims

Setup: eleven ASR models producing varying Word Error Rates, three corpora (IEMOCAP,
CMU-MOSI, MSP-Podcast), text-only and bimodal configurations, six fusion techniques.
RoBERTa-base as the text encoder.

- **Prior work disagrees on magnitude, and the paper says so.** "Schuller et al. observed
  that a WER of over 30% resulted in an SER accuracy drop of less than 3% on the FAU Aibo
  Emotion Corpus, whereas Li et al. reported a nearly 10% accuracy drop with a 30% WER on
  IEMOCAP."
- **Degradation is real but not linear.** "SER performance generally decreases as WER
  increases. On IEMOCAP and MOSI, there is nearly a 10% accuracy decrease with WERs around
  40%, regardless of Acc2, Acc4, or Acc7. However, exceptions exist."
- **Low WER is tolerable.** "SER is robust to relatively low WER, and in some cases, it is
  even better with ASR errors. From IEMOCAP, it is observed that a WER of approximately 12%
  has minimal impact on SER performance compared to ground-truth transcripts."
- **The exceptions are not principled.** Whisper-tiny beat neighboring models at similar WER;
  W2V960-large-self was worse despite lower WER. The paper's explanation: "This might be due
  to certain words being misrecognized as words that have little effect on or even positively
  contribute to their ground-truth emotion labels." Meaning the error direction is arbitrary
  with respect to the sentiment label.
- **Valence, which is the dimension closest to sentiment, tracks WER. Arousal and dominance
  do not.** "the CCC of valence mirrors the pattern observed in Acc4 for IEMOCAP and Acc2 for
  CMU-MOSI, suggesting that valence shares similarities with categorical emotion in terms of
  robustness to ASR errors. Given that valence is conceptually similar to sentiment
  (indicating positivity or negativity), this alignment is plausible." And: "valence is more
  influenced by textual content, whereas arousal and dominance are more influenced by audio
  cues."
- **Audio rescues most of the loss, and Littlebird gives text only.** "The decrease in Acc4
  based on WER reaches 10% without fusion on IEMOCAP, but only 4% with fusion."
- **Real conversational data is much worse than lab data.** MELD (TV sitcom dialogue) was
  dropped from the study: "its WERs are nearly double those of the other three corpora,
  ranging from 30% to 65%. Given that conducting SER using transcripts with such poor ASR
  performance is impractical in real-world scenarios, we decided to focus on the other three
  corpora."
- Best absolute numbers reported, for scale: IEMOCAP four-class accuracy 74.66 on the best
  ASR transcript vs 74.32 on ground truth; CMU-MOSI MAE 0.8558 vs 0.8902; MSP-Podcast CCC
  0.616 vs 0.613.
- Stated conclusion: "SER can tolerate relatively low WERs, especially in real-life speech
  scenarios" and "Bimodal SER with transcripts containing approximately 10% errors may not
  perform worse than those with ground-truth text."

## Direct implication for the skill

Two readings coexist and both are supportable. Text-only sentiment on a clean transcript is
not hopeless. Text-only sentiment on multi-speaker conversational audio, which is what a
client call is, sits closer to the MELD regime that the authors called impractical. The paper
also confirms the single most useful design constraint: even the best case is a
four-class-accuracy-in-the-seventies task on curated corpora, which is nowhere near good
enough to hang a per-client verdict on. Show the quote, not the score.
