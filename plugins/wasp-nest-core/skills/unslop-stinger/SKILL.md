---
name: "unslop-stinger"
license: AGPL-3.0-or-later
description: "Cuts AI tells from text written for a human reader (commit messages, PR titles and bodies, docs, code comments, replies) and adds human voice: opinions, varied rhythm, concrete specifics. Use before committing, posting, or sending prose, or when the user says \"unslop this\", \"make this sound human\", \"remove AI tells\", or \"this reads like AI\". Leave prose you did not touch alone."
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: specialist
  paired-drone: unslop-wasp-drone
  research-window: 2026-10-05
  provenance: "Pattern catalog adapted from the unslop skill by Lauren Tan (MIT), with the Wasp Nest's own no-em-dashes rule folded in. See references/research/ for the source and its license."
---

# Unslop Stinger

Edit text to remove AI patterns and add human voice. Removing patterns is
half the job; sterile, voiceless writing is just as obvious as slop.

Read `guides/01-patterns.md` for the full catalog (31 patterns in five
families) plus the adding-soul checklist, and run the four-step loop below on
every invocation.

## The loop

1. **Scan** the text against the pattern catalog.
2. **Rewrite.** Preserve meaning, match intended tone.
3. **Add soul.** Opinions over neutral listing; varied sentence rhythm;
   first person where it fits; specific facts over atmospherics; a little
   mess beats perfect structure.
4. **Self-audit.** Ask "what makes this obviously AI generated?" and fix
   what remains.

## Standing rules

- Em dashes are an AI tell: periods and commas only, and parentheses or en
  dashes in their place just trade one tell for another. This matches the
  colony's no-em-dashes rule.
- Straight quotes, sentence case headings, no decorative emojis.
- The fix for a vague sentence is a concrete instruction, fact, or number.
  If you cannot restate it that way, cut it.
- If a sentence could appear unchanged in another project's docs, it says
  nothing about this one. Cut it or make it specific.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event that your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [readme-writing-stinger](../readme-writing-stinger/) - conversion-focused README authorship; unslop the draft after the structure is right
  - [technical-writing-craft-stinger](../technical-writing-craft-stinger/) - Diataxis and documentation structure; unslop handles voice, not organization
  - [before-after-stinger](../before-after-stinger/) - visual proof of UI change; the complement to prose that does not overclaim
