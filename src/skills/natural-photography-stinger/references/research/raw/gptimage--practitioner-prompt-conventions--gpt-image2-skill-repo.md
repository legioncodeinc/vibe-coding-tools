# GPT-Image2-Skill — prompt gallery, craft rules and CLI (community)
- URL: https://github.com/wuyoscar/GPT-Image2-Skill
- Fetched: 2026-08-17
- Source type: community (open-source prompt library + agent skill, derived from and citing the official OpenAI cookbook)

Useful because it operationalises the cookbook rules into production conventions
and records model behaviours the official docs don't state.

## What it is

Curated prompt gallery (28+ categories including photography), reference
markdown for parameter semantics, an agent skill, and a `gpt-image` CLI for
generations and edits.

## Prompt structure — matches the official order

> "background/scene → subject → key details → constraints"

> "state the intended use (ad, UI mock, infographic) so the model picks the right
> mode and polish level."

## Photorealism rule (verbatim)

> "say 'photorealistic' directly; 'real photograph', 'taken on a real camera',
> and 'iPhone photo' also help."

## Format agnosticism — a notable practitioner finding

> "Any format works; consistency matters more."

Minimal prompts, JSON structures, instruction-style prose, and tag/booru-style
lists all succeed. The claim is that **syntax choice does not drive quality**;
repeatability does.

> "For production, prefer a skimmable template over clever syntax."

This is a direct rebuttal of the widespread belief that a particular JSON schema
or magic-token stack unlocks realism on GPT Image models. There are no weights,
no `::` emphasis, no `--no` negatives.

## In-image text

> "Any text that must appear in the image — slogans, prices, kanji — should be in
> straight quotes. Do not paraphrase it inside the prompt."

## Parameter conventions

| Flag | Guidance |
|---|---|
| `--quality` | budget dial: `low` for drafts/sweeps, `medium` for exploration, `high` for text-heavy or shipping assets |
| `--size` | decide aspect ratio early (1:1, 3:4, 4:3, …) and **reinforce it in the prompt text**, not only via the flag |
| `--quality high` | treated as mandatory for "in-image text, dense diagrams, small labels, and multi-panel layouts" |

## Documented model behaviours / gotchas

- **Text**: requires `quality="high"` for reliability; lower quality degrades
  visibly on dense text.
- **Aspect ratio**: "model composition improves when aspect is both flagged and
  mentioned in prose" — i.e. the `size` parameter alone under-informs
  composition; say "wide horizontal frame" in the prompt too.
- **Subject hierarchy**: "Complex scenes work best when one subject is clearly
  primary."
- **Edit endpoint**: supports multiple `-i` image inputs for multi-reference
  edits; mask-based inpainting uses alpha transparency — **opaque = preserve,
  transparent = regenerate**.
- **Moderation**: the CLI defaults to `--moderation low` (vs. the API default
  `auto`) to enable broader exploration.

## Reference surfaces it ships

1. `gallery.md` — routing index
2. `gallery-*.md` — per-category prompt files
3. `craft.md` — a 19-section prompt checklist (JSON/config style, multi-panel
   boards, UI specs, data/diagram grammar, edit invariants)
4. `openai-cookbook.md` — mirror of OpenAI's parameter table and use-case examples

## Caveat

Community source. Its photorealism rules are restatements of the official
cookbook; its parameter conventions and behavioural gotchas are unverified
practitioner claims, not vendor-confirmed.
