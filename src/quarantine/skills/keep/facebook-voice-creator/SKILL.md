---
name: facebook-voice-creator
description: >
  Guide a user through building their own personal writing-voice skill from their
  Facebook data export. Walks them through exporting their Facebook data (with
  screenshots), waits for the export, then unpacks, sanitizes, and analyzes their real
  posts and messages to produce a calibrated voice skill that writes exactly like them
  and reads 100% human. Use this skill whenever a user says "build my voice skill",
  "make Claude write like me", "clone my writing style", "create a voice skill from my
  Facebook", "analyze my posts", or uploads a Facebook data export zip. Not for brand
  voice guidelines for a company (use a brand-voice skill) - this is for one person's
  authentic personal voice.
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
---

# Facebook Voice Creator

Build a user's personal voice skill from their real Facebook writing. The output is a
skill like `mario-aldayuz-voice`: a lean SKILL.md plus fingerprint, anti-AI rules,
verbatim corpus, and approved samples - all derived from what the user actually wrote,
never from guesses.

Why Facebook data: a data export contains months of the user's unfiltered writing across
every register they have - long rants, quick jokes, DMs, comments. That beats any
interview or questionnaire. The whole method is: real words first, analysis second,
imitation last.

## Process overview

Run these phases in order. Use the AskUserQuestion tool at every decision point - the
reference guides specify each question and its recommended answer.

### Phase 1 - Export (user-driven, ~5 minutes of clicking)

Read `references/facebook-export-guide.md` and walk the user through the Facebook
export flow step by step, showing them the screenshots in `assets/` as you go.

Critical settings to confirm with AskUserQuestion (recommended answers first):
1. Customize information: **Posts (required)**, Messages (optional), Profile
   information (optional). Nothing else.
2. Date range: **6 months** or 1 year.
3. Format: **JSON** (not the HTML default - this matters).
4. Media quality: **Lower**.

### Phase 2 - Wait (async, 2-3 hours)

Facebook builds the export in roughly 2-3 hours and the user has only 4 days to
download it. Do not block - tell the user to return with the zip. If there is other
work in this conversation, proceed with it.

### Phase 3 - Process the upload

When the user uploads the .zip, read `references/facebook-data-processing.md` and
follow it exactly: unpack, delete all media leaving only raw JSON, fix the latin-1/UTF-8
mojibake, extract text, and SANITIZE - keep only content written by the user themselves
(confirm their exact Facebook display name first). Nothing from other people's comments
or messages may enter the corpus.

### Phase 4 - Analyze

Run both analysis passes from the processing guide: scripted stylometrics (dash usage,
emoji counts, exclamation rate, hashtags, openers, caps, lengths) and qualitative
register reading of at least 15-20 long posts and 30-40 short ones. Confirm biography
facts with the user before encoding them as guardrails - never encode unverified claims
(service history, credentials, life events).

### Phase 5 - Samples and approval

Draft sample posts in the user's voice: long form (500+ words), short form (under 3
sentences), and quick statements (8 words or less). Present them via AskUserQuestion
for approval or tuning. Iterate until the user signs off. Only approved samples ship.

### Phase 6 - Build and save the skill

Assemble the final skill using `references/voice-skill-template.md`: SKILL.md plus
references/fingerprint.md, anti-ai-rules.md, corpus.md, and samples/ split by type
(long-form.md, short-form.md, quick-statements.md). Save the skill to Claude Cowork
(package as .skill and present it with a Save skill button). Delete the raw export
data - it is private and does not belong in the shipped skill.

## Quality bar

- Every fingerprint claim is grounded in counts or quotes from the real corpus.
- Every biography fact is user-confirmed. The guardrails list what must NEVER be
  claimed.
- The calibration test lives in the output skill: read it out loud - if it sounds like
  a press release it failed, if it sounds like the user it passed.
- The finished skill must produce writing that reads 100% human and never warrants a
  platform's AI-content label.
