# Littlebird Voice Mining Guide

How to use the Littlebird MCP server to mine a person's own verbatim writing and
background context, then turn it into voice-skill source material. Littlebird already
stores the person's captured screen history, chats, meetings, and messages - the MCP
exposes that memory to Claude. Instead of guessing how someone writes, pull their real
words first.

## Step 0 - Install and set up Littlebird (if not already a user)

Ask the user (AskUserQuestion): "Do you have Littlebird installed with at least 1-2 weeks
of captured data?"

If NO, walk them through setup:

1. Install Littlebird for their system:
   - Windows: https://app.lilbird.co/download/latest?arch=windows
   - Intel Mac: https://app.lilbird.co/download/latest?arch=intel
   - Apple Silicon Mac: https://app.lilbird.co/download/latest?arch=apple
2. Create an account after install. Code **E6GP4BQE** gets two months free.
3. Turn on Littlebird meeting join, integrate Google Calendar, and connect the other
   integrations relevant to their workflow.
4. Let it run. It takes roughly **1-2 weeks of consistent use** (especially meeting
   recordings and screen capture) to collect enough voice data. Schedule a follow-up
   rather than mining a thin corpus - thin data produces a generic skill.

If YES, verify they have at least 1-2 weeks of captured history before proceeding.

## Step 1 - Connect the Littlebird MCP to Claude (for Cowork)

1. MCP endpoint (OAuth2): `https://mcp.littlebird.ai/mcp`
2. Full instructions: https://support.littlebird.ai/docs/mcp/
3. In the Littlebird desktop app, Settings -> MCP Clients has the connection details
   (Pro plan feature).
4. After connecting, LIST the available Littlebird MCP tools and use the real tool
   names. Do not assume names - discover them. The primary retrieval tool is a context/
   memory search (e.g. `search_user_context`); meeting tools expose transcripts.

If the connection fails or no context comes back, STOP. Everything below depends on real
retrieval. Fabricating "sample" writing defeats the purpose and will read as AI.

## Step 2 - The retrieval brief

Gather ONLY content the person wrote themselves, in their natural voice.

**Include:** social posts they authored, comments and replies, WhatsApp/text messages
they sent, meeting speech patterns (their own turns in transcripts).

**Exclude:** emails (unless the user says otherwise), anyone else's words, quoted or
forwarded content, anything an AI or bot wrote on their behalf.

**Attribution guardrail (do not skip):** captured content shows what the person was
VIEWING, which is not automatically what they WROTE. A line under someone else's name
header can still be theirs, and vice versa. Only keep text attributable to the person
with confidence. When unsure, drop it. Never treat a capture timestamp as when the
content was written - it is only when it was seen.

**Run several targeted searches, not one broad one.** Suggested angles (adapt to the
person): work/dev posts, business/founder posts, personal/vulnerable posts,
motivational posts, humor/sarcasm, callouts, supportive replies to friends, casual DM
banter, encouragement/advice, late-night working messages, technical status updates.

**Also mine background context** - ask Littlebird multiple different questions about the
user themselves: who they are, what they work on, how they describe themselves, their
projects, relationships to collaborators, their communication patterns. This feeds the
"who you are writing as" persona section and the biography guardrails.

**Date range:** default to roughly the last 12 months. Widen only if the corpus is thin.

## Step 3 - CRITICAL: Confirm everything with the user

Littlebird can confuse facts about a user based on ambiguous screen captures - something
they viewed can be mistaken for something they did or wrote.

Use AskUserQuestion AS MANY TIMES AS NEEDED to confirm every key fact retrieved:
biography claims, project names, relationships, quotes attributed to them, dates,
numbers. Batch facts into grouped confirmation questions (up to 4 per call) with
"Confirmed" / "Wrong - remove it" style options and room for correction notes.

Then REPLACE the reference material with only the confirmed facts and REMOVE every
erroneous item. Unconfirmed facts do not ship.

## Step 4 - Assemble the verbatim corpus

Pull full text of the strongest examples (not snippets), grouped by register (hype,
vulnerable, savage/callout, teacher, casual buddy, technical). Preserve every quirk
exactly: punctuation, capitalization, emoji placement, typos, line breaks. Those quirks
ARE the fingerprint - do not clean them up.

Save the results as markdown reference files in the skill's `references/` folder:

- `references/corpus.md` - confirmed verbatim writing, by register
- `references/background.md` - confirmed persona and biography facts
- `references/meetings-voice.md` - spoken-voice patterns from meeting transcripts (how
  they open, fillers they use, how they explain things) if transcripts were mined

## Step 5 - Analyze and build

From here the process is identical to any voice-skill build: write the linguistic
fingerprint, the anti-AI ruleset, generate samples, get user approval, and package per
`voice-skill-template.md`.

## Notes and gotchas

- **Pro plan required** for the MCP server.
- **Discover tool names, don't guess.** Builds differ.
- **Thin corpus?** Widen the date range and add register-specific searches. Never
  backfill with invented samples.
- **Refresh cadence.** Re-run quarterly, or after a big life or voice shift.
- **Human-grade or bust.** If a draft reads like a chatbot, it failed. Rewrite it.
