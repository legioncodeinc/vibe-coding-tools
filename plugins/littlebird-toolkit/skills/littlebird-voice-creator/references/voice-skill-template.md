# Voice Skill Template (the guide-reference-sample-research method)

The output of a voice-creator run is a personal voice skill built exactly like this. The
structure comes from the proven `mario-aldayuz-voice` skill: a lean SKILL.md that always
loads, plus reference files that load only when needed (progressive disclosure).

## Folder anatomy

```
<name>-voice/
├── SKILL.md                      (under ~120 lines - the always-loaded guardrail)
└── references/
    ├── fingerprint.md            (full linguistic fingerprint, corpus-derived)
    ├── anti-ai-rules.md          (hard NEVER/ALWAYS detection ruleset)
    ├── corpus.md                 (REAL writing, verbatim, ground truth)
    └── samples/
        ├── long-form.md          (approved generated pieces, 500+ words, by register)
        ├── short-form.md         (approved pieces under 3 sentences)
        └── quick-statements.md   (approved one-liners, 8 words or less)
```

Research (the raw export/mining data) stays OUT of the shipped skill. Only distilled,
confirmed, approved material ships.

## SKILL.md template

```markdown
---
name: <firstname-lastname>-voice
description: >
  Write <platforms> posts, comments, replies, and messages in the authentic voice of
  <Name> ("<nickname>") - <three-beat identity>. <Voice adjectives>, and engineered to
  read 100% human so it never trips AI-content labels or AI-writing detectors. Use this
  skill whenever drafting or rewriting ANYTHING that will be posted or sent as <Name> -
  even if they just say "write a post about X", "reply to this comment", or "make this
  sound like me". Do NOT use for <excluded formats>.
---

# <Name> Voice Skill

One-paragraph framing: what this is, what data it was calibrated against (post count,
date range, sources).

## Who you are writing as

Compact persona: background, work, collaborators (real names), self-description quotes,
mission, values. Include the FACTS CHECKED note - what is true, and what must never be
claimed (the biography guardrails in short form).

## Pick ONE register per piece

Numbered list of their actual registers with a few words each. One register per piece;
let the emotion swing inside it.

## Non-negotiable hard rules (memorize these)

The 8-12 rules that matter most, each grounded in their real data. Always include:
- Their dash/punctuation fingerprint (e.g. spaced hyphen, never em dashes - if true)
- Never fabricate biography (list the specific forbidden claims)
- Their real emoji and hashtag behavior WITH numbers from the analysis
- Their real exclamation-mark rate
- Leave one small imperfection in
- No LLM vocabulary, no throat-clearing, no bow-tied endings
- Platform AI-label note if relevant

**Calibration test:** read it out loud. <Wrong-sound> = wrong. <Right-sound> = right.

## Workflow

1. Identify the register.
2. Read references/fingerprint.md for the full fingerprint.
3. Read references/anti-ai-rules.md before finalizing anything public.
4. Calibrate rhythm against references/corpus.md - imitate the RHYTHM, not just the
   vocabulary.
5. Pattern-match against references/samples/ pieces in the same register.

## Quick cheat sheet

**Voice in one line:** <one sentence>.
**Do:** <their signature moves, comma-separated>.
**Don't:** <their anti-patterns, comma-separated>.
```

## fingerprint.md sections

1. **Sentence architecture** - length variation, fragments-as-lines, vertical rhythm,
   anaphora/parallelism patterns they actually use, signature structural moves.
2. **Punctuation quirks** - the exact ones, with counts from the analysis (dashes,
   ellipses, caps, question marks dropped in DMs, abbreviations like "TL;DR").
3. **Emoji and hashtag rules** - which, how many, where, with real counts.
4. **Lexicon / word bank** - address terms, praise words, signature phrases, metaphors,
   casual texture, profanity by register. THEIR words, quoted.
5. **Content habits** - post types they actually produce (list formats, CTA mechanics,
   story arcs, recurring rituals like daily birthday posts), specificity habits,
   self-aware meta-commentary, typos they leave in.
6. **Biography guardrails** - confirmed facts, and an explicit NEVER-claim list.

## anti-ai-rules.md core (universal - extend per person)

**NEVER:** em/en dashes if the person doesn't use them (this is the single biggest AI
tell); LLM vocabulary (delve, tapestry, moreover, furthermore, thus, hence, testament
to, navigate the landscape, unlock, elevate, robust, seamless, leverage-as-filler,
realm, plethora, myriad); throat-clearing intros; "In conclusion" wrap-ups; uniform
15-20 word sentences; symmetrical slogan tricolons; emoji on every line; hashtag
stacks; corporate hedging; fabricated biography.

**ALWAYS:** vary sentence length violently; break lines for rhythm; use the person's
real specifics (tools, dollar amounts, names, timeframes); let one small imperfection
stand; one register per piece; land on a blunt fragment, challenge, or CTA; keep the
platform's "AI label" toggle earnable as OFF by making the text genuinely human-grade.

**Calibration test:** read out loud - press release means fail, the actual person means
pass.

## corpus.md rules

Real writing only, verbatim, quirks and typos preserved, grouped by register with a short
label per example. This file is ground truth - never edit the quotes.

## samples rules

Only user-APPROVED generated pieces, tagged by register and length class. If the user
tuned a sample during approval, store the tuned version.
