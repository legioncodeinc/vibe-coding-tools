---
name: combined-voice-creator
description: >
  The full-pipeline personal voice skill builder for Littlebird users. Combines BOTH
  data sources: mines the user's Littlebird memory via the Littlebird MCP (captured
  writing, messages, meeting speech, background context) AND ingests their Facebook
  data export (posts, messages, profile info, with a screenshot-guided export
  walkthrough). Produces one calibrated voice skill that writes exactly like the user
  and reads 100% human. Use this skill whenever a user says "build my voice skill",
  "make Claude write like me", "clone my voice", "create my writing style skill", or
  wants the most complete version of their voice from every source available. If the
  user only has ONE source, use facebook-voice-creator or littlebird-voice-creator
  instead.
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
---

# Combined Voice Creator

Build the deepest possible personal voice skill by fusing two corpora:

- **Littlebird** supplies recent captured writing, sent messages, spoken meeting
  patterns, and rich background context about who the user is.
- **Facebook export** supplies months of public-facing writing across every register -
  long rants, quick jokes, comments, DMs.

Together they cover both halves of a person's voice: how they write in public and how
they talk when nobody's performing. The output is a skill structured like
`mario-aldayuz-voice`: lean SKILL.md + fingerprint + anti-AI rules + verbatim corpus +
approved samples.

## Phase 0 - Source check

Ask via AskUserQuestion (multiSelect): "Which sources can we mine?"
1. **Both Littlebird and Facebook (Recommended)** - the full pipeline below.
2. Littlebird only - hand off to the littlebird-voice-creator flow.
3. Facebook only - hand off to the facebook-voice-creator flow.

## Phase 1 - Kick off BOTH tracks in parallel

Start the Facebook export FIRST because it has a 2-3 hour wait baked in, then mine
Littlebird while Facebook builds the archive.

### Track A: Facebook export (start immediately)

Follow `references/facebook-export-guide.md` step by step with the screenshots in
`assets/`. Confirm via AskUserQuestion: Posts (required) + Messages (optional) +
Profile information (optional); Date range 6 months or 1 year; Format JSON; Media
quality Lower. Then the user waits 2-3 hours for Facebook (4-day download window).

### Track B: Littlebird mining (while waiting)

Follow `references/littlebird-mining-guide.md`:
1. Verify Littlebird is installed with 1-2 weeks of data (install links, code
   E6GP4BQE for two months free, if they're new - then pause this track).
2. Verify the Littlebird MCP is connected (`https://mcp.littlebird.ai/mcp`, docs at
   https://support.littlebird.ai/docs/mcp/). List tools, use real names.
3. Run multiple targeted retrievals across registers plus background-context queries.
4. Obey the attribution guardrail - viewed is not written.
5. CRITICAL: confirm every retrieved fact with the user via AskUserQuestion, then purge
   everything erroneous. Unconfirmed facts do not ship.

## Phase 2 - Process the Facebook zip

When the export lands, follow `references/facebook-data-processing.md`: unpack, delete
all media leaving raw JSON, fix the latin-1/UTF-8 mojibake, extract, and sanitize to
ONLY the user's own words (confirm their Facebook display name first).

## Phase 3 - Merge and analyze

Merge both corpora with source tags, dedupe (Littlebird may have captured the same
Facebook posts), then run both analysis passes from the processing guide:

- Scripted stylometrics over the merged corpus (dashes, ellipses, emoji counts,
  exclamation rate, hashtags, openers, caps, length distribution).
- Qualitative register reading (15-20 long pieces, 30-40 short ones minimum).
- Where the sources disagree, weight the LARGER and MORE RECENT sample, and note
  register differences (public post voice vs DM voice vs spoken voice) explicitly in
  the fingerprint.
- Biography guardrails come from Littlebird background mining plus Facebook profile
  info, and every fact gets user-confirmed before encoding. List what must NEVER be
  claimed.

## Phase 4 - Samples and approval

Draft samples across the user's registers: long form (500+ words), short form (under 3
sentences), quick statements (8 words or less). Present batches via AskUserQuestion for
approval or tuning. Iterate until they match. Only approved samples ship, committed to
`references/samples/` by type (long-form.md, short-form.md, quick-statements.md).

## Phase 5 - Build and save

Assemble per `references/voice-skill-template.md` (the guide-reference-sample-research
method): SKILL.md + references/fingerprint.md + anti-ai-rules.md + corpus.md +
samples/. Package as a .skill and save to Claude Cowork. Delete all raw export and
mined data from the working area - private data does not ship.

## Quality bar

- Real data or nothing. No fabricated corpus, ever.
- Every fact user-confirmed; every fingerprint claim grounded in counts or quotes.
- One register per generated piece; rhythm imitated, not just vocabulary.
- Output must read 100% human - it should never warrant a platform's AI-content label.
  Read it out loud: press release = fail, the actual person = pass.
