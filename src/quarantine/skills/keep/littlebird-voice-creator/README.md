# littlebird-voice-creator

Builds your personal writing-voice skill from what Littlebird already captured, so Claude writes from your real sentences, not a description of how you write.

## What it does

Ask a model to write like you and it writes a description of you. Told to be casual it gets chatty, told to be direct it gets blunt. None of it came from your sentences.

Littlebird already captured them: your posts, comments, sent messages, and how you talk in meetings, across every register you use, work, personal, humor, callouts, banter, technical. The MCP exposes that memory, so this skill mines real words instead of interviewing you.

It runs targeted searches per register, pulls background context about who you are, then stops and makes you confirm what it found before anything is written down. The result is one installed skill, and it is what the rest of the marketplace composes with: several skills draft through your voice skill when one exists, and `brand-voice-guardian` checks drafts against it.

## When to use it

- You want Claude drafting things you would actually send.
- You are tired of editing the model's voice out of your writing.
- You run Littlebird and have no Facebook export.

Just ask. Trigger phrases include "build my voice skill from Littlebird", "mine my Littlebird data", "make Claude write like me using Littlebird", and "what does Littlebird know about my writing style".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand | Once, then a refresh | Setup check, mine, confirm, assemble, analyze, sample, approve, package. |

**No routine, and it should not have one.** This is a build with your approval at each decision point, not a condition anything can watch.

Its own advice on the refresh is quarterly, or sooner after a big life or voice shift. A corpus a year out of date produces an old version of you.

## What you get

An installed skill, packaged and saved to Claude Cowork: a lean `SKILL.md` plus `references/fingerprint.md`, `anti-ai-rules.md`, `corpus.md` and `samples/` by type.

`corpus.md` holds your verbatim writing by register with quirks preserved exactly, `background.md` holds only confirmed facts, and `meetings-voice.md` holds spoken patterns where transcripts were mined. Samples come in three shapes, long form, short form and quick statements, and only approved ones ship. The calibration test ships too: read it out loud, press release means fail, you means pass.

## What it needs

- Littlebird installed with one to two weeks of captured data. Thin capture makes a generic skill, so if you are new it helps you install and returns later.
- The Littlebird MCP connected. Its SKILL.md states the Pro plan for this.
- Time to answer questions. Confirmation is its own phase here, not a formality.
- If you also have a Facebook export, `combined-voice-creator` uses both and goes deeper.

## Limits worth knowing

**Real retrieval or nothing.** A failed MCP connection ends the run, and empty retrieval is reported, not filled in.

**Captured screens show what you were viewing, not always what you wrote.** Only confidently attributable text stays in the corpus, which costs corpus size on purpose.

**Littlebird can confuse facts from ambiguous captures**, which is why confirmation is its own phase. You confirm biography claims, project names, relationships and attributed quotes, and anything wrong is removed before packaging. Unconfirmed facts do not ship.

**No raw personal data ships.** The finished skill carries your own confirmed writing and nothing else.

## Related skills

- [combined-voice-creator](../combined-voice-creator/README.md), when you have a Facebook export too and want depth.
- [facebook-voice-creator](../facebook-voice-creator/README.md), when the export is your only source.
- [brand-voice-guardian](../brand-voice-guardian/README.md), the QA pass that checks drafts against what this builds.
- [content-repurposer](../content-repurposer/README.md), which drafts through your voice skill.
- [said-it-already](../said-it-already/README.md), for turning what you already said into seeds.

## Under the hood

`SKILL.md` is the full instruction set: six phases, the retrieval brief, the attribution guardrail, and the bar the finished skill must clear. The guides live in `references/`, covering the mining brief and the voice skill template.

This one predates the current house structure and carries no research archive. Everything it does is in `SKILL.md` and those guides.
