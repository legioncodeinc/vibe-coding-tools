# Littlebird Skills project guidance

This is the always-on briefing for any coding agent working in this repository. Claude
Code, Cursor, Codex, and Cowork all read this file, directly or through a thin import.

## What this repo is

A Claude plugin marketplace of skills built on the Littlebird MCP. Littlebird captures
screen activity and transcribes meetings, so the record of the user's work already
exists. Every skill here turns some part of that record into something actionable.

Thirty skills live under `skills/`, in six groups:

- **Money and business operations.** money-leak-auditor, renewal-sentinel,
  invoice-chaser, deal-pipeline-reconstructor.
- **Lead generation and growth.** lead-harvester, comment-to-crm-piper,
  content-repurposer, said-it-already, testimonial-miner, competitor-watch.
- **Meetings and follow-through.** meeting-scribe, commitment-tracker,
  who-am-i-ghosting, pre-call-prep, client-health-radar.
- **Personal productivity.** daily-brief, day-reconstructor, focus-forensics,
  learning-capturer, weekly-review.
- **Knowledge and writing.** sop-forge, knowledge-base-builder, osint-investigator,
  research-synthesizer, brand-voice-guardian.
- **Meta and automation.** routine-architect, skill-suggester.
- **Voice.** combined-voice-creator, littlebird-voice-creator, facebook-voice-creator.
  These predate the current structure and do not carry a research archive.

The repo root is simultaneously the plugin (`.claude-plugin/plugin.json`, skills
auto-discovered from `skills/`) and the marketplace (`.claude-plugin/marketplace.json`
listing the plugin with source `./`). Keep both manifests in sync when anything is added
or renamed.

**One plugin, deliberately.** Installed plugins are copied to a cache directory and
cannot reference files outside themselves, so splitting into several plugins would break
the cross-skill references that exist today. If a split is ever revisited, the blockers
are: content-repurposer reads thirteen paths under `said-it-already/references/`, and
every skill README links siblings at `../<skill-name>/README.md`.

## Operating rules

1. Do not add em dashes or en dashes to authored prose anywhere in this repo. Use
   ordinary punctuation and the spaced hyphen " - " for asides. This repo exists to kill
   AI tells; its own files don't get to have them. Preserve literal data and verbatim
   source material exactly as captured. Check the actual characters before committing,
   do not eyeball it.
2. Protect user work. Never discard unrelated changes, rewrite history, or delete broad
   paths without clear authorization and a verified target.
3. Raw personal data never ships. Facebook exports, Littlebird retrievals, and any user
   corpus are working material only. They get processed in temp space and deleted. Only
   distilled, user-confirmed content lands in a skill.
4. Every fact a skill encodes about a person, a company, a commitment, or a number gets
   confirmed with the user first. Unconfirmed facts do not ship, ever.
5. Skill frontmatter uses only the Agent Skills spec fields: `name`, `description`,
   `license`, `compatibility`, `metadata`, `allowed-tools`. Anything else fails a
   claude.ai or Cowork upload. Nest `version`, `author`, and `requires` inside `metadata`.

## The skill contract

Every skill under `skills/` follows this shape:

```
skills/<skill-name>/
├── SKILL.md          Instructions for the model. Spec-six frontmatter.
├── README.md         The page a human reads to decide. No frontmatter.
├── references/
│   ├── <guides>.md                   Domain guides, one per major verb
│   ├── littlebird-mcp-reference.md   Shared, duplicated across skills
│   ├── evidence-standards.md         Shared, duplicated across skills
│   └── research/
│       ├── README.md
│       ├── distilled-<topic>.md      Cited distillation
│       └── raw/                      One file per archived source
└── scripts/          Only where a deterministic helper earns its place
```

`SKILL.md` carries these sections in order: Purpose, Littlebird MCP calls used, Trigger,
Routine cadence, Process, Output, Guardrail, Related skills. The folder name and the
frontmatter `name` must match exactly, or Cursor's discovery breaks silently.

**Shared references are duplicated, not linked.** `littlebird-mcp-reference.md` and
`evidence-standards.md` are copied verbatim into every skill that needs them, because a
copied plugin cannot reach outside its own directory. If you edit one, update ALL copies
in the same change. The same rule already applied to the voice skills' Facebook guides
and `voice-skill-template.md`.

## The evidence standards (do not dilute them)

These are why the marketplace is trustworthy. They are set out in full in each skill's
`references/evidence-standards.md`.

1. **Receipts or it did not happen.** Every claim from capture carries source, app, and
   timestamp.
2. **Observed, inferred, external, and unknown are four different things**, and the
   difference is visible to the reader. Never promote an inference by dropping the hedge.
   Never turn an absence into a negative finding.
3. **The attribution guardrail.** Capture shows what the user was viewing, not what they
   wrote. Raw meeting transcripts are weakly diarized, so attribution comes from the
   summary's structured blocks and transcript is quoted for wording only.
4. **Partial rosters are reported as partial.** Social and app UIs collapse lists, so any
   roster built from them names the gap size alongside the named set.
5. **Skills refuse numbers they cannot honestly measure.** Several skills decline a score
   or a total on researched grounds. Do not add one back for polish.
6. **Draft and hold.** Nothing reaches another human without the user approving the final
   text, not a summary of the intent.
7. **Empty retrieval ends the run.** Report the gap, never fabricate.

## Facts agents get wrong here

- **Routines CAN be created from an interactive session** with
  `LB_INTERNAL_CREATE_ROUTINE`. They are only unavailable from inside a running routine.
  Skills offer to create their own routine after showing the prompt and schedule for
  approval. Do not tell a user to go configure one by hand.
- **Use the real MCP tool names**, listed in any skill's
  `references/littlebird-mcp-reference.md`. There is no `search_context`, no
  `search_chats`, no `get_calendar`, no `voice.apply`, and no `act.*`. Upcoming calendar
  events come from `LB_INTERNAL_LIST_MEETINGS` with a future `end_date`.
- **Other products are separate connectors**, not Littlebird. A skill that wants Gmail,
  a CRM, or a payment processor lists its available tools first and degrades gracefully.
- **No angle brackets anywhere in frontmatter.** This bans the YAML folded-scalar marker
  too, since that marker is itself a greater-than character. Use a quoted scalar.
- **No backtick-bang command injection** in a skill body. Cowork replaces those lines
  with a dead placeholder. Have the model run the command through its own tools.

## Research requirements

A skill's domain claims trace to its own archive or they are not facts. Sweep primary
sources, archive one file per source with title, URL, fetch date, and source type, then
write a distillation where every claim ends in a bracketed citation to its raw file.
Official docs outrank vendor blogs outrank community posts. Where sources conflict, state
both readings and which one you prefer and why. Where coverage is thin, name the gap.
Never pad with training data.

## Validation before commit

- Every SKILL.md parses: valid YAML frontmatter, spec-only fields, a description stating
  both what the skill does and when to trigger it, `name` matching the folder.
- No angle brackets in frontmatter, no backtick-bang injection, no Claude Code string
  substitutions like `$ARGUMENTS` or `${CLAUDE_PLUGIN_ROOT}`.
- Every relative reference path resolves, including `../<skill>/README.md` sibling links.
- No em or en dashes in authored prose (verbatim corpus material is exempt).
- `plugin.json` and `marketplace.json` are valid JSON and agree on names and versions.
- No raw personal data, exports, or mined content committed anywhere.
- The Ship Gate runs in order before any commit: security, then quality, then repo
  health. The user reviews the reports and approves the commit.
