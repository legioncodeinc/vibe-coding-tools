# How AI meeting notes actually work

- **Title:** How AI Meeting Notes Actually Work
- **URL:** https://circleback.ai/blog/how-ai-meeting-notes-work
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (Circleback, an AI meeting-notes vendor, describing the
  pipeline including its own category's weaknesses)

## Extracted claims

### Transcription accuracy

- Leading ASR models reach "word error rates below 3% on clean, read-aloud audio."
- Real meeting audio degrades this sharply. The article cites WhisperX benchmarks with
  "error rates climbing to approximately 12% on close-talk recordings" and "above 35% on
  far-field audio from a single room microphone."
- Primary determinant is capture path: a direct meeting-platform connection beats a laptop
  microphone in a conference room.

### Speaker diarization

- Systems build "a mathematical representation called a speaker embedding: a numerical
  fingerprint of their vocal characteristics including pitch, cadence, tone, and speaking
  rhythm."
- State-of-the-art diarization error rates are "11 to 13%."
- "The primary driver of these errors is crosstalk: accuracy drops substantially when two
  people talk simultaneously."
- The consequence the article names explicitly: "If the system assigns your comment to a
  colleague, and that comment contains a commitment, the resulting action item gets
  attributed to the wrong person."

### Action item extraction

- The mechanism is scanning "the speaker-attributed transcript for commitment language:
  'I'll send that over,' 'let's schedule a follow-up,' 'can you handle that by Friday?'"
- Maturity assessment: this stage is "less mature than it appears." Researchers found "a
  lack of techniques as well as metrics for evaluating these techniques," and there is "no
  widely accepted benchmark for measuring how reliably AI identifies tasks, owners, and
  deadlines."
- Context loss: "The same words carry different weight depending on meeting structure and
  norms."

### Error compounding

- "Errors compound. If the speech-to-text step mishears a word, the summary inherits that
  mistake."

## Direct implication for the skill

Three hard design constraints come straight out of this source:

1. Diarization error of 11 to 13 percent is the quantified reason the skill must take
   owner attribution from the summary's Action Items block and never from raw transcript
   chunks. The raw chunks are the layer where the error lives.
2. Because there is no accepted benchmark for extraction reliability, the skill cannot
   claim its harvest is complete. It reports what the summaries contained, not what the
   meeting contained.
3. Because errors compound down the pipeline, a commitment quoted from a summary should be
   quoted verbatim rather than paraphrased, so the user can see the wording that the
   pipeline actually produced and judge it.
