# said-it-already

Your best content is what you already said out loud on a call and forgot by Thursday. This mines it, screens it, rebuilds it for reading, and hands you a bank of drafts.

## What it does

The hot take that landed. The client story with the real number in it. The explanation that finally made it click. Those moments beat anything invented at a blank page, because they were tested on a live human. They are also gone: nobody remembers what they said on Tuesday.

It searches your meetings and captured writing for seven kinds of moment: a hot take, a client story, an objection handled, an analogy, a teaching explanation, a contrarian observation, and a number said out loud. Each is screened for who said it and whether it can be published, then rebuilt as a draft.

The rebuild step exists because of a measurable finding. Spoken and written registers are different systems, not the same language at different tidiness levels: only about 3% of common four-word phrase bundles overlap, and speech runs about 6% disfluent. Explainers are more disfluent than listeners, so the teaching explanation, the highest-value seed type, has the ugliest verbatim. That is exactly why pasting transcript lines fails and the rebuild step exists.

It mines many sources for seeds. `content-repurposer` takes one artifact and expands it.

## When to use it

- It is Monday and you have nothing to post.
- You said something good on a call last week and cannot remember which call.

Just ask for it. Trigger phrases include "what should I post", "I have nothing to write about", "build my content bank", "turn my calls into content", "find my best quotes".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Weekly seed watcher | Friday 16:00 local | Names the week's candidates, splits out what it cannot attribute to you, flags anything confidential |
| Cowork run | Weekly, or on demand for a theme | Screening, the rebuild, the drafts, the approval gate |

Take the weekly routine. The material decays from memory within days, and Friday afternoon catches the week while it is fresh. The skill sets it up: it shows you the prompt and schedule, you approve, it creates it.

## What you get

One file, `content-bank-YYYY-MM-DD.md`, with 10 to 15 seeds. The do-not-publish list is section two, mandatory, and a bank shipped without one means the screen did not run. Section three, "Confirm this was you", holds candidates too weakly attributed to draft, with the verbatim and who else was in the meeting.

Then the bank. Each seed shows its id, type, register, theme, the verbatim exactly as captured, the receipt, speaker confidence, why it works, and the draft, always labeled together. After that: the format mix, coverage notes on meetings with no recording, and repeats worth one definitive piece.

## What it needs

- The Littlebird MCP on a Power or Pro plan. Unrecorded calls carry no transcript and cannot be mined.
- A personal voice skill, optional and load-bearing. If installed, it owns style while this skill keeps authority over facts. If not, it says so up front.
- Three or four content pillars. Without them it proposes a set from your meeting topics.

## Limits worth knowing

A low-confidence attribution is never drafted. Meetings have multiple speakers and raw transcript chunks are often tagged as others, which proves a line was said and not who said it. Wording comes from transcripts, attribution never does, and it never composites two similar lines from two calls.

Nobody has measured whether repurposed spoken content outperforms writing from scratch. The case for this skill is that the material is real and already tested on a listener, not a performance claim. The 10 to 15 seed target is a starting point, not a benchmark.

It drafts and holds. Nothing is posted or scheduled without you approving the actual text.

## Related skills

[content-repurposer](../content-repurposer/README.md), the sibling, when you already have one artifact to expand.
[brand-voice-guardian](../brand-voice-guardian/README.md), the QA pass on a finished draft.
[testimonial-miner](../testimonial-miner/README.md), for what other people said about you.
[combined-voice-creator](../combined-voice-creator/README.md), to build the voice the drafts use.

## Under the hood

`SKILL.md` has the full instruction set. `references/` holds `seed-types-and-extraction.md`, `attribution-screening.md`, `confidentiality-screen.md` and `spoken-to-written.md`.

`references/research/` archives 14 primary sources, including the register and disfluency studies behind the rebuild. Every domain claim traces to one.
