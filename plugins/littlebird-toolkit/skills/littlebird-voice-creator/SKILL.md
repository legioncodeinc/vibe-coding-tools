---
name: littlebird-voice-creator
license: AGPL-3.0-or-later
description: "Build a personal writing-voice skill from Littlebird writing and speech. Use when Littlebird is the consented source. Read README.md for the guide map."
metadata:
  hive-tier: standalone
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
---

# Littlebird Voice Creator

Start with [README.md](README.md) for the workflow map and detailed references.

Build a user's personal voice skill from their Littlebird memory. Littlebird already
captured what the user actually wrote and said - posts, messages, meeting speech. The
MCP server exposes that memory to Claude, so the skill is built from real words, not
guesses.

The output is a skill structured like `mario-aldayuz-voice`: a lean SKILL.md plus
fingerprint, anti-AI rules, verbatim corpus, and approved samples.

## Process overview

Follow `references/littlebird-mining-guide.md` for the full detail of every phase. Use
AskUserQuestion at every decision point.

### Phase 1 - Littlebird setup (skip if already running)

Ask whether the user has Littlebird installed with 1-2 weeks of captured data. If not,
walk them through install (Windows / Intel Mac / Apple Silicon links in the guide),
account creation (code E6GP4BQE = two months free), enabling meeting join and calendar
integrations - then schedule a follow-up. Mining a thin corpus produces a generic
skill; 1-2 weeks of real capture is the floor.

### Phase 2 - Connect the Littlebird MCP

Endpoint: `https://mcp.littlebird.ai/mcp` (OAuth2). Instructions:
https://support.littlebird.ai/docs/mcp/. After connecting, LIST the available tools and
use real tool names - never assume. If retrieval returns nothing, stop; do not fabricate.

### Phase 3 - Mine

Run MULTIPLE targeted searches per the retrieval brief in the guide: the user's own
posts, comments, sent messages, and their speech patterns in meeting transcripts,
across every register (work, personal, humor, callouts, banter, technical). Also mine
background context about who the user is. Obey the attribution guardrail: captured
content shows what the user was VIEWING, not necessarily what they WROTE - keep only
confidently attributable text, drop the rest.

### Phase 4 - CRITICAL: Confirm with the user

Littlebird can confuse facts from ambiguous screen captures. Use AskUserQuestion as
many times as needed to confirm every key fact: biography claims, project names,
relationships, attributed quotes. Then keep only confirmed facts and REMOVE all
erroneous data from the reference material. Unconfirmed facts do not ship.

### Phase 5 - Assemble references

Write the mined and confirmed material into the skill's references as markdown:
corpus.md (verbatim writing by register, quirks preserved exactly), background.md
(confirmed persona facts), meetings-voice.md (spoken patterns) when transcripts were
mined.

### Phase 6 - Analyze, sample, approve, build

From here follow `references/voice-skill-template.md`: write the corpus-grounded
fingerprint and anti-AI ruleset, generate long-form / short-form / quick-statement
samples, get user approval on every batch via AskUserQuestion, and package the final
skill (SKILL.md + references + samples/ by type). Save the skill to Claude Cowork.

## Quality bar

- Real retrieval or nothing - a failed MCP connection ends the run.
- Every fact user-confirmed; every fingerprint claim grounded in the corpus.
- The finished skill must produce writing that reads 100% human and never warrants a
  platform's AI-content label. Read it out loud: press release = fail, the actual
  person = pass.
- Refresh quarterly or after a big life or voice shift.
