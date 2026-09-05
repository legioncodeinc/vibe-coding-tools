# facebook-voice-creator

Builds your personal writing-voice skill out of your Facebook data export, from months of your real posts and messages instead of a description of how you write.

## What it does

Ask a model to write like you and it writes a description of you. Told to be casual it gets chatty, told to be direct it gets blunt. None of it came from your sentences.

A Facebook export holds months of unfiltered writing across every register you use: long rants, jokes, comments, DMs. That beats any interview or questionnaire. Real words first, analysis second, imitation last.

It walks you through the export with screenshots, waits, then unpacks the zip, strips the media, repairs the mojibake, keeps only text you wrote, and reads it twice: with scripted stylometrics, then as a human reading registers. The result is one installed skill, and it is what the rest of the marketplace composes with: several skills draft through your voice skill when one exists, and `brand-voice-guardian` checks drafts against it.

## When to use it

- You want Claude drafting things you would actually send.
- You are tired of editing the model's voice out of your posts.
- You have years of Facebook writing and nothing else.

Just ask. Trigger phrases include "build my voice skill", "make Claude write like me", "clone my writing style", "create a voice skill from my Facebook", and "analyze my posts".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand, two sittings | Once, then again if your writing shifts | Export walkthrough, wait, process, analyze, sample, package. |

**No routine, and it should not have one.** This is a build with your approval at each decision point, not a condition anything can watch.

Expect a gap. Facebook takes two to three hours to build the export and gives you four days to download it. The skill does not block: come back with the zip and it resumes.

## What you get

An installed skill, packaged and saved to Claude Cowork: a lean `SKILL.md` plus `references/fingerprint.md`, `anti-ai-rules.md`, `corpus.md` and `samples/` split by type.

The fingerprint is counted, not guessed: dash use, emoji, exclamation rate, hashtags, openers, capitals, post lengths. Samples come in three shapes: long form over 500 words, short form under three sentences, quick statements of eight words or less. Only approved ones ship. The calibration test ships too: read it out loud, press release means fail, you means pass.

## What it needs

- A Facebook account with real writing history, and five minutes of clicking.
- The right export settings, confirmed with you first: Posts required, Messages and Profile optional, six months or a year, JSON not HTML, media quality Lower.
- Your exact Facebook display name, so nobody else's words enter your corpus.
- No Littlebird MCP for this one. If you run Littlebird, `combined-voice-creator` uses both sources and goes deeper.

## Limits worth knowing

**Real data or nothing.** No fabricated corpus, and nothing you did not write enters the analysis.

**Nothing ships unconfirmed.** Biography facts are confirmed before encoding, and the guardrails list what must never be claimed about you: service history, credentials, life events.

**It reads the Facebook you, one register set.** Anything you never posted about is missing, and the fingerprint states what it measured.

**No raw personal data ships.** Media goes at unpack, the export goes after the build, and the skill carries only your writing.

## Related skills

- [combined-voice-creator](../combined-voice-creator/README.md), when you have Littlebird too and want depth.
- [littlebird-voice-creator](../littlebird-voice-creator/README.md), when Littlebird is the only source.
- [brand-voice-guardian](../brand-voice-guardian/README.md), the QA pass that checks drafts against what this builds.
- [content-repurposer](../content-repurposer/README.md), which drafts through your voice skill.
- [said-it-already](../said-it-already/README.md), for turning what you already said into seeds.

## Under the hood

`SKILL.md` is the full instruction set: six phases, the export settings that matter, and the bar the finished skill must clear. The guides live in `references/` (the export walkthrough, the processing and sanitizing pass, the voice skill template), with screenshots in `assets/`.

This one predates the current house structure and carries no research archive. Everything it does is in `SKILL.md` and those guides.
