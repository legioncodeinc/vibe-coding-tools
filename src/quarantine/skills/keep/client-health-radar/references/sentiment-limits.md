# Sentiment limits

What this skill can and cannot detect about how a client feels, why, and what it does instead.

Read this before writing anything that characterizes a client's mood, tone, temperature or
trajectory. The rules here override any instinct to summarize a call as positive or negative.

## The short version

**Do not emit a sentiment score.** Not a number, not a five-point scale, not an emoji, not the
words "positive" or "negative" applied to a whole call. Emit dated quotes and observable
behavior, and let the user read the tone.

Where the skill characterizes direction over time, it characterizes **change in observable
behavior** (who attends, what gets asked for, how fast people reply, whether meetings get
cancelled, whether the client asks strategic questions or only about deliverables), not
**polarity of language**.

## Why: what the measurements actually say

Everything in this section traces through `references/research/distilled-client-health.md`,
section 6, to three academic sources.

### It is not solved on clean written text

Four models including BERT on six English sentiment datasets. Best-model accuracy ran from 53.0
on SST to 84.2 on hotel reviews, and error rates ranged 8.3 to 20.5 percent
(`references/research/distilled-client-health.md`, section 6.1). The best number in that set is
the genre written specifically to express polarity. The naturalistic sets are far worse.

### The specific things it fails on are how professional clients talk

From the annotated failure set, with counts
(`references/research/distilled-client-health.md`, section 6.1):

| Failure phenomenon | What it sounds like on a client call |
|---|---|
| **Modality**, which defeated every model tested | "I would have loved to see this last week." "We were hoping to be further along." |
| **Mixed**, where nearly a third of errors contain a "but" clause | "The design work has been great, but the timeline is a problem." |
| **Reducers**, the rarest but cleanest failure | "It's fine, I suppose." "Kind of what we expected." |
| **Shifters**, which quietly flip polarity, most commonly the word "miss" | "We missed the window on this one." |
| **Comparative** | "It's better than the last agency, at least." |
| **Idiom** | "We're just spinning our wheels here." |
| **Sarcasm and irony**, which need world knowledge to detect at all | "Great, another revision round." |
| **No sentiment at all** | "Can you send us the asset list?" |

Read that last row again. The single strongest churn signal a service business has, a client
quietly requesting an asset inventory, carries no sentiment lexicon whatsoever. A sentiment model
scores it neutral. It is on the practitioner warning list as a sign the client is preparing to
leave (`references/research/distilled-client-health.md`, section 4).

### The direction of error is against you

"the strong negative is the most difficult and least common class, while positive is the easiest
to classify" (`references/research/distilled-client-health.md`, section 6.1). The models are
worst at exactly the thing this skill exists to catch, and they fail toward reassurance.

### Trained humans do not agree either

Roughly a fifth of the hard cases were annotated as having a completely incorrect gold label, and
277 of the 836 failure sentences carried an incorrect-label annotation
(`references/research/distilled-client-health.md`, section 6.1). If expert annotators cannot
agree on the sentiment of these sentences, a per-client verdict built on them is not a finding.

### More data does not fix it

Ten times the training data raised SST accuracy from 53.0 to 55.1, and made irony and shifters
worse (`references/research/distilled-client-health.md`, section 6.1). This is not a problem that
scale has solved.

### Transcription corrupts the exact words sentiment depends on

Measured, not estimated
(`references/research/distilled-client-health.md`, section 6.2):

| Measurement | Value |
|---|---|
| Utterances where the sentiment-bearing word was substituted by the recognizer | 17.6 percent |
| Misclassification rate on utterances WITH a substitution | 29.9 percent |
| Misclassification rate on utterances WITHOUT one | 15.8 percent |

The worked example is a client-call-shaped sentence: "And I was really upset about it" was
recognized as containing "set" instead of "upset". The published fix for this needs the speaker's
face and the speaker's tone of voice to spot the mismatch
(`references/research/distilled-client-health.md`, section 6.2). A text transcript has neither.

### How much the transcription step costs is genuinely contested

Two readings, both from the same benchmark paper
(`references/research/distilled-client-health.md`, section 6.3):

| Reading | Evidence |
|---|---|
| Small cost | 12 percent word error rate has "minimal impact"; and one corpus showed under 3 percent accuracy drop at over 30 percent word error rate |
| Large cost | Nearly 10 percent accuracy drop at 40 percent word error rate, and prior work found the same at 30 percent |

This skill takes the pessimistic reading for the client-call case, for three reasons stated in
the same paper (`references/research/distilled-client-health.md`, section 6.3):

1. The one corpus of real multi-speaker conversation was dropped from the study because its word
   error rates ran 30 to 65 percent, which the authors called "impractical in real-world
   scenarios". A recorded client call is closer to that corpus than to a lab recording.
2. Most of the resilience in the good results came from fusing the audio. Text-only degradation
   was 10 percent where fused degradation was 4 percent. Littlebird hands over text.
3. Valence, the dimension that actually corresponds to sentiment, is the one driven by the text
   and therefore the one that tracks transcription error. Arousal and dominance ride on audio
   cues, which are not available.

Even at the ceiling, the numbers are four-class accuracy in the seventies on curated corpora
(`references/research/distilled-client-health.md`, section 6.3).

## What this skill does instead

### Behavioral signals, ranked by how much they survive the transcription problem

| Rank | Signal | Why it survives |
|---|---|---|
| 1 | Unmet promises, with dates and restatement counts | Extracted from the summary's Action Items block with owner tags, not from tone. Arithmetic on dates |
| 2 | Silence gaps against the client's own derived baseline | Timestamps. No language interpretation at all |
| 3 | Meeting cancellations and reschedules | Calendar facts |
| 4 | Room composition changes | Attendee lists from the linked calendar event |
| 5 | Explicit exit-shaped requests: access, exports, asset inventories, documentation not previously needed | A literal request. Quoting it is the whole finding |
| 6 | Commercial facts: late invoices, budget language, postponed renewals | Named amounts, named dates |
| 7 | The language of their asks, quoted early vs late | Quotes shown side by side, user reads them |
| 8 | Tone or sentiment as a computed value | Not produced. See above |

Items 1 through 6 are facts with receipts. Item 7 is the only place language enters, and it
enters as evidence shown to the user rather than as a conclusion drawn for them.

### The register-change method, which replaces sentiment trajectory

The user asked for trajectory, and trajectory is a real and useful thing. Produce it without
scoring it.

For each client, take the earliest third and the latest third of the window. From each third,
pull two to four short quotes of the client's own words: how they open, what they ask for, how
they describe the work. Present them as a two-column comparison with dates on every line, and
add one line of observed structural difference underneath, expressed in countable terms.

The output looks like this, and this shape is mandatory:

```
Acme Industrial: how the asks changed

  June 12  "Loved the direction on the homepage. Can we push further on the
            case study section?"                    [Acme weekly, 2026-06-12, Topics Discussed]
  June 26  "What's the thinking on the nav? Curious how you got there."
                                                    [Acme weekly, 2026-06-26, Topics Discussed]

  Aug 04   "Can you confirm the deliverables for this month in writing?"
                                                    [Acme weekly, 2026-08-04, Action Items]
  Aug 11   "Who do we contact if we need the source files?"
                                                    [Acme weekly, 2026-08-11, Risks / Open Questions]

  Observed: 4 of 5 client asks in June were about direction and reasoning.
            5 of 5 in August were about confirmation, documentation and access.
            Client-side questions per meeting fell from 6 to 2.
            This is a description of what was asked, not a reading of how they feel.
```

That last line is not optional. It is what keeps the user in charge of the interpretation.

The structural claim underneath the quotes ("asks about direction" versus "asks about
confirmation and access") is an inference and is labeled as one
(`references/evidence-standards.md`, rule 2). The quotes and counts are observations and carry
receipts.

### The one place tone words are permitted

The `## Risks / Open Questions` block of a Littlebird meeting summary already contains concerns
in the summarizer's words. Quoting a line from it verbatim and attributing it to that block is
legitimate, because it is a retrieved artifact with a receipt rather than a fresh sentiment
judgment. Cite it as `[meeting name, date, Risks / Open Questions]`. Do not aggregate several of
these into a mood.

## What to tell the user, in the report itself

Every report carries this limitation note, in these words or very close to them:

```
What this cannot see: tone of voice, facial expression, and anything said outside a
recorded meeting or a captured thread. Transcription substitutes the emotion-carrying
word in roughly one utterance in six, and the published research says text-only
sentiment on conversational speech is the weakest signal available. This report
therefore ranks clients on behavior and dated evidence, not on how the calls sounded.
A client can be quietly furious and read as normal here. Read the quotes.
```

Say it once, near the top, every time. A user who understands the boundary will trust the parts
inside it. A user who is handed a confident mood score will discover the boundary the hard way,
on the client where it matters.

## The failure this section exists to prevent

The health-score literature's sharpest finding: when the relationship owner's own read carries
weight in the score, retention rates fall and churn rates rise, because owners want to believe an
account stabilized after one good interaction
(`references/research/distilled-client-health.md`, section 3).

There are two ways to build this skill wrong and they fail in the same direction.

1. Score the sentiment. The model is worst on strong negative and best on positive, so the score
   reassures.
2. Ask the user how the account feels. The user wants to believe it is fine, so the answer
   reassures.

Both produce a green client who is about to leave. The defense against both is the same: dated
behavioral evidence the user can check, presented whether or not it agrees with the mood in the
room.
