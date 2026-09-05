# brand-voice-guardian

The last read before you hit send: it marks up your draft, counts the AI tells, rewrites it in your voice, and flags claims it could not corroborate against your record.

## What it does

Something is about to go out under your name and it does not sound like you. A teammate wrote it, a model did, or you wrote it tired. People who know you notice, and you cannot always say what is wrong.

Hand it the draft. It runs against your voice skill and returns a marked-up copy with every flagged span, a counted tell inventory, a clean rewrite in your voice, a separate fact-check pass, and a note on each change so you need it less next time.

It is the only skill here whose main input is something you supply, not mined capture. It tone-corrects and never invents substance: no added numbers, no added examples, no strengthened superlatives. A dropped hedge counts as fabrication.

## When to use it

- A teammate drafted something shipping under your name.
- You used a model for a first draft and it shows.
- You are about to publish and want one more read.

Just ask. Trigger phrases include "does this sound like me", "check this draft", "run this past my voice", "does this read as AI", and "de-AI this".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand | Per draft, always | Frame the run, tell inventory, fact check, rewrite, approval. |

**No routine, and it should not have one.** Its input is a draft a human hands over, and no schedule produces one. A timer would only check stale drafts.

For a recurring writing routine, `content-repurposer` and `said-it-already` have real ones, and `routine-architect` sets up and tunes routines on your approval.

## What you get

One file, `voice-check-YYYY-MM-DD-HHMM.md`, timestamped because you will run several drafts in a sitting.

The fact check comes first, ahead of every tone flag, because a factual problem outranks a tonal one. Then the marked-up draft. Then the tell inventory, a row per tell with its category, evidence tier, count, rate and severity, so a flag arrives as a count of participial clauses rather than "this reads as AI". Then the clean version, why each change, and any conflict left for you.

## What it needs

- A draft. No draft is the one thing that ends the run.
- A voice skill from one of the voice creators. Without one it says so and drops to a corpus fallback or generic pass, never a fabricated profile.
- The Littlebird MCP on a Power or Pro plan for the fact check. Without it the pass runs list-only: claims extracted, marked not checked, handed over as a checklist.

## Limits worth knowing

**It does not promise to make your writing undetectable, and nobody honestly can.** Seven detectors flagged 61.22% of genuine essays by non-native English writers as AI, and a vocabulary prompt cut that to 11.77% without changing who wrote them. Detectors measure predictability, not authorship. This skill makes text sound like you, which is a different claim.

**Several famous tells are labelled CRAFT.** Sentence-length uniformity, triadic lists and the tidy conclusion have no measured human baseline. They get flagged anyway, and labelled as reasoning rather than measurement.

**Absence of corroboration is not evidence a claim is false.** Littlebird captures what crossed a screen, so a true fact that never did returns nothing.

**It drafts and holds, and never sends.** Nothing is posted or written anywhere without you approving the final text.

## Related skills

- [combined-voice-creator](../combined-voice-creator/README.md), the strongest profile to check against, and the first to install.
- [littlebird-voice-creator](../littlebird-voice-creator/README.md), when Littlebird capture is your only source.
- [facebook-voice-creator](../facebook-voice-creator/README.md), when a Facebook export is.
- [content-repurposer](../content-repurposer/README.md), whose packs are the intended input here.
- [said-it-already](../said-it-already/README.md), when the question is whether to publish it at all.

## Under the hood

`SKILL.md` is the full instruction set: nine steps, three modes, five absolute rules on the rewrite. Domain guides are `references/ai-tell-catalog.md`, `references/severity-and-registers.md`, `references/fact-check-pass.md`, `references/detection-reality.md` and `references/voice-skill-integration.md`.

`references/research/` archives 14 primary sources, six peer-reviewed, and every domain claim traces to one.
