# combined-voice-creator

Builds your personal writing-voice skill from both your Littlebird memory and your Facebook export, so Claude writes in your voice, not a tidy imitation of it.

## What it does

Ask a model to write like you and it writes a description of you. Told to be casual it gets chatty, told to be direct it gets blunt. None of it came from your sentences, because it never had any.

This skill uses two corpora. Littlebird supplies recent captured writing, sent messages, spoken meeting patterns and background context. A Facebook export supplies months of public writing across every register you have: long rants, jokes, comments, DMs. Together they cover how you write in public and how you talk off duty.

It merges them with source tags, dedupes the overlap, runs scripted stylometrics plus a register read, then drafts samples until you sign off. The result is one installed skill, and it is what the rest of the marketplace composes with: several skills draft through your voice skill when one exists, and `brand-voice-guardian` checks drafts against it.

## When to use it

- You want Claude drafting things you would actually send.
- You are tired of editing the model's voice out of your posts.
- You have both Littlebird and a Facebook account.

Just ask. Trigger phrases include "build my voice skill", "make Claude write like me", "clone my voice", "create my writing style skill", and "the most complete version of my voice".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand, two sittings | Once, then again if your writing shifts | Export, mine Littlebird meanwhile, process, analyze, sample, approve, package. |

**No routine, and it should not have one.** This is a build with your approval at each decision point, not a condition anything can watch.

Plan for a gap. Facebook takes two to three hours to build the export and gives you four days to download it, so that starts first and the mining happens while you wait.

## What you get

An installed skill, packaged and saved to Claude Cowork: a lean `SKILL.md`, plus `references/fingerprint.md`, `anti-ai-rules.md`, `corpus.md` and `samples/` split into long-form, short-form and quick-statements.

The fingerprint is counted, not guessed: dashes, ellipses, emoji, exclamation rate, hashtags, openers, capitals, length distribution, with the gaps between posts, DMs and speech noted where the sources disagree. Samples ship only once you approve them.

## What it needs

- Littlebird installed with one to two weeks of capture, and the MCP connected. Thin capture makes a generic skill.
- A Facebook export: Posts required, Messages and Profile optional, six months or a year, JSON not the HTML default.
- Your exact Facebook display name, so only your words enter the corpus.
- Time to answer questions. Every biography fact is confirmed before encoding.

## Limits worth knowing

**Real data or nothing.** No fabricated corpus, ever. If retrieval comes back empty, the run stops.

**Captured screens show what you were viewing, not always what you wrote.** Text that cannot be confidently attributed to you is dropped, costing corpus size on purpose.

**Nothing ships unconfirmed.** You confirm every biography fact and attributed quote, and anything wrong is purged before packaging. The guardrails list what must never be claimed about you.

**No raw personal data ships.** Media is deleted at unpack, the export and mined material are wiped afterwards, and the skill carries only your confirmed writing.

## Related skills

- [littlebird-voice-creator](../littlebird-voice-creator/README.md), when Littlebird is your only source.
- [facebook-voice-creator](../facebook-voice-creator/README.md), when the export is your only source.
- [brand-voice-guardian](../brand-voice-guardian/README.md), the QA pass that checks drafts against what this builds.
- [content-repurposer](../content-repurposer/README.md), which drafts derivatives through your voice skill.
- [said-it-already](../said-it-already/README.md), for turning what you already said into publishable seeds.

## Under the hood

`SKILL.md` is the full instruction set: five phases, both tracks, and the quality bar the finished skill must clear. The step-by-step guides live in `references/` (the export walkthrough, the mining brief, the processing and sanitizing pass, the voice skill template), with screenshots in `assets/`.

This one predates the current house structure and carries no research archive. Everything it does is in `SKILL.md` and those guides.
