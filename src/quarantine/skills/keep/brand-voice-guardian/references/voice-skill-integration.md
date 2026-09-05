# Voice skill integration

How this skill finds, reads, and uses a personal voice skill, and exactly what it can and
cannot do without one.

**The rule underneath everything in this file: never fabricate a voice profile.** Not from
the draft, not from one sample, not from a conversation, not from what the user says about
how they write. A profile is derived from a corpus or it does not exist.

---

## Part 1: Why a voice skill is the reference and this skill is the check

These are two halves of one system and they were built to be used together.

| Skill | Job |
|---|---|
| `littlebird-voice-creator`, `facebook-voice-creator`, `combined-voice-creator` | BUILD the profile from a real corpus |
| `brand-voice-guardian` | ENFORCE it against a specific draft |

The voice creator skills produce a folder with a known shape, described in the
marketplace's own `voice-skill-template.md`:

```
firstname-lastname-voice/
├── SKILL.md                      the always-loaded guardrail
└── references/
    ├── fingerprint.md            full linguistic fingerprint, corpus-derived
    ├── anti-ai-rules.md          hard NEVER and ALWAYS ruleset
    ├── corpus.md                 REAL writing, verbatim, ground truth
    └── samples/
        ├── long-form.md          approved pieces, 500 words and up, by register
        ├── short-form.md         approved pieces under 3 sentences
        └── quick-statements.md   approved one-liners, 8 words or less
```

**That anti-AI ruleset is the marketplace's core intellectual property. This skill is the
QA pass that enforces it.** It does not restate it, extend it, or override it. It reads it
and checks against it.

---

## Part 2: Find the voice skill

Do this in step 1 of the run, before establishing register and long before drafting,
because the answer changes what the whole run is worth.

**LIST the skills available in this session.** Do not assume any are present and do not
assume names. Look for:

- A skill whose name ends in `-voice` or `-voice-skill`.
- A skill whose description says it writes in the authentic voice of a named person.
- A skill produced by one of this marketplace's three voice creators.

Where more than one is installed, ask the user which one applies to this draft. Do not
merge two profiles. A person may legitimately have separate profiles for separate
identities and merging them destroys both.

---

## Part 3: Read the profile, in this order

Load progressively. Do not read the whole voice skill for a two-line comment.

### Always

**The voice skill's SKILL.md.** The persona, the register list, the non-negotiable hard
rules, and the biography guardrails. This is the always-loaded layer for a reason: it
contains the rules that produce Critical-severity flags.

Extract into working memory:

| What | Used for |
|---|---|
| The register list | `severity-and-registers.md` part 1. THIS LIST OUTRANKS the default register table. |
| The hard NEVER rules | Critical tier. Every one of these is an absolute. |
| The dash and punctuation fingerprint | Catalog 1.1 and 6.1 |
| Emoji rate, hashtag rate, exclamation rate, with their numbers | Catalog 6.7 |
| Biography guardrails, the NEVER-claim list | Feeds the FACT-CHECK pass, not the tone pass |
| The calibration test | The final read-aloud check |

### For anything longer than a one-liner

**The voice skill's own `anti-ai-rules.md`.** The person's NEVER and ALWAYS ruleset. Note
that this and the three files below live inside the INSTALLED VOICE SKILL's own references
folder, not this skill's. Resolve them relative to wherever that skill is installed.

**That file outranks `ai-tell-catalog.md` wherever the two disagree.** The catalog is
population-level. This file was calibrated against one person. If the catalog says a
construction is a tell and the person's own rules permit it, the person's rules win, and
the flag does not get raised.

### For any substantive rewrite

**The voice skill's `fingerprint.md`.** Sentence architecture, punctuation quirks with counts,
emoji and hashtag rules with counts, the lexicon and word bank, content habits, biography
guardrails.

The fingerprint is where the user-specific layer of the tell catalog gets its numbers
(`ai-tell-catalog.md`, category 6). Without it, that whole category is unavailable.

### Before finalizing the clean rewrite

**The voice skill's `corpus.md`.** The verbatim ground truth.

**Calibrate RHYTHM against the corpus, not just vocabulary.** This is where the rewrite
either lands or does not. Matching someone's word list while missing their cadence produces
a draft that uses their words and sounds nothing like them.

Never quote the corpus into the deliverable. It is reference material, and it is the user's
own private writing.

### For register-matched pattern matching

**The voice skill's `samples/` folder**, filtered to the target register and length class. These are
user-APPROVED generated pieces. They are the closest available model for what a good output
of this exact operation looks like.

---

## Part 4: The three modes

The skill runs in one of three modes and it says which one at the top of every report.

### Mode A: Full function. Voice skill installed.

Everything works.

- All four severity tiers are available, including Critical.
- The user-specific catalog layer (category 6) runs.
- The rewrite is voice-matched.
- Register comes from the person's own register list.
- The "why each change" section can cite the person's own rule for each flag, which is what
  makes that section teach rather than assert.

### Mode B: Generic pass. No voice skill installed.

The skill still runs. It runs SMALLER, and it says so before doing any work.

**What still works:**

- Catalog categories 1 through 5, the population-level tells, at their stated evidence
  tiers.
- The full fact-check pass. This does not depend on a voice profile at all.
- Register establishment, using the default table and asking the user.
- Structural, Moderate and Low severity, with most Moderate flags demoted to Low.
- A cleaned-up rewrite that removes measured AI constructions.

**What does NOT work, and must be stated plainly:**

- **Tone matching is unavailable.** The rewrite removes machine constructions. It does not
  make the draft sound like the user, because nothing in the session knows how the user
  sounds.
- **The Critical tier is empty by construction.** Nothing has been stated as an absolute.
  Do not promote a Structural flag to fill it.
- **Category 6 does not run at all.** Punctuation habits, contraction rate, sentence-opener
  inventory, line-break rhythm, emoji and hashtag rates. All unavailable.
- **Most Moderate flags become Low.** A word can only be "a word the user does not use" if
  there is a corpus to check.

**Say this to the user before starting the work, not in a footnote afterwards:**

> No personal voice skill is installed in this session, so I can run the generic AI-tell
> pass and the fact check, but I cannot tell you whether this sounds like YOU. I can only
> tell you whether it sounds machine-written. Those are different questions and the second
> one is the one worth answering.
>
> This marketplace has three skills that build the profile from your real writing:
> `combined-voice-creator` if you have both Littlebird data and a Facebook export, which
> is the strongest option, `littlebird-voice-creator` for Littlebird alone, and
> `facebook-voice-creator` for a Facebook export alone.
>
> I can build the profile first, or run the generic pass now. Your call.

Ask with `AskUserQuestion`. Take the answer before doing any work.

### Mode C: Corpus fallback. No voice skill, but Littlebird is connected.

The middle option, and it needs its limits stated carefully because it is the mode most
likely to overclaim.

**What this mode is:** pull a sample of the user's real writing from Littlebird capture and
use it as a comparison reference for THIS ONE RUN.

**What it is not:** a voice profile, and it never gets called one.

**Retrieval brief.** Run narrow parallel queries, never one broad one
(`littlebird-mcp-reference.md`):

| Target | Query construction |
|---|---|
| Their own written output | `search_user_context` with `search_queries_messages`, 3 to 5 narrow queries on subjects they write about, bounded by `date_range` to the last 90 days |
| Text they composed rather than read | `search_user_context` with `filters.data_source: snapshots`, targeting compose surfaces |
| Their spoken register, as a weak proxy | `LB_INTERNAL_SEARCH_MEETINGS`, then `LB_INTERNAL_GET_MEETING_TRANSCRIPT` for wording only |

**The attribution guardrail governs this mode absolutely.** Capture shows what the user was
VIEWING, not necessarily what they WROTE (`evidence-standards.md` rule 4):

- Text in a compose box is probably theirs. Text in a feed is probably not.
- A message tagged `(From:[user])` is theirs. Everything else is not.
- A transcript chunk tagged `[Others]` proves someone said it, not who.
- Anything a bot, an assistant, or a template produced on their behalf is not their words.

Attribution is guilty until proven innocent. Discard anything you cannot place.

**Spoken register is a weak proxy for written register and must be labeled as one.** How a
person talks in a meeting is not how they write a client email. Use transcript material for
lexicon and characteristic phrasing only, never for punctuation, structure, or rhythm,
which do not survive the transition from speech.

**Hard limits on this mode:**

1. **Nothing retrieved becomes a Critical flag.** Critical requires a stated absolute, and
   a sample of writing states nothing.
2. **A sample is not a profile.** Say "compared against a sample of your recent writing"
   and never "compared against your voice profile".
3. **Confirm before encoding.** Anything that will be written down as a durable fact about
   how the user writes gets confirmed first (`evidence-standards.md` rule 6). In practice:
   show the user what you pulled and ask whether it is representative before you compare
   anything to it.
4. **Raw capture never ships.** Process in temp space, produce the finding, delete the raw
   (`evidence-standards.md` rule 7).
5. **Empty retrieval drops the run to Mode B.** If retrieval returns nothing usable, say so
   and continue as a generic pass. Do not reason from what would probably be there
   (`evidence-standards.md` rule 9).

**Always offer the upgrade.** At the end of a Mode C run, point at the voice creator
skills. Mode C rebuilds a thin sample every single run. A voice skill is built once, from a
much larger corpus, with the user confirming every fact.

---

## Part 5: When the profile and the catalog disagree

A live conflict on most runs. The resolution order is fixed:

1. **The user's explicit instruction for this draft.** Highest authority. Always.
2. **The voice skill's hard NEVER and ALWAYS rules.** Absolutes.
3. **The voice skill's fingerprint, with its counts.** Measured on this person.
4. **The register requirement.** The user's own register list first, the default table
   second.
5. **`ai-tell-catalog.md`, MEASURED tier.** Population-level, with a study behind it.
6. **`ai-tell-catalog.md`, CRAFT tier.** Authored reasoning. Lowest.

**A CRAFT-tier catalog entry never overrides a documented personal habit.** If the person
demonstrably writes in triads, triads are their voice, and flagging them is exactly the
overcorrection the restraint rule in `severity-and-registers.md` exists to prevent.

Where the conflict is genuine and the resolution order does not settle it, **hand it back
to the user rather than deciding**. Professional editing practice resolves the
voice-versus-house-style conflict through conversation between two named parties
(`research/distilled-ai-detection-and-stylometry.md`, section 6), and that conversation is
unavailable to an automated pass. So the pass surfaces the conflict instead of pretending
to have authority it does not have.

---

## Part 6: A teammate's draft is a different job

The case the skill must not get wrong, and the one with no research behind it. Nothing in
the archive addresses correcting a third party's draft into someone else's voice. The
editing literature runs the opposite direction, an editor serving an author's voice
(`research/README.md`, gap 4). **This section is authored reasoning and is labeled as
such.**

### Establish whose name it ships under, in step 1

One question, asked before any work:

**"Whose name does this go out under?"**

| Answer | What the skill does |
|---|---|
| **The user's name.** A teammate drafted it, the user signs it. | Correct into the user's voice. This is the skill's core job and it is legitimate: it is the user's byline, so it should be the user's voice. |
| **The teammate's name.** The user is reviewing or helping. | **Do NOT correct into the user's voice.** Run the generic AI-tell pass and the fact check only. Explicitly disable voice matching for this run. |
| **A shared or company byline.** | Ask which voice the brand uses. If it is the user's, treat as case one. If it is a house voice, this skill is the wrong tool and the user needs a brand voice guideline, not a personal voice profile. Say so. |
| **Unclear.** | Stop and ask. Do not guess. |

### Why the second case matters

Rewriting a colleague's draft into the user's voice, when it ships under the colleague's
name, is a real harm with three parts:

1. **It erases the colleague's voice from their own byline.** Their readers now get someone
   else's cadence attributed to them.
2. **It is usually invisible to them.** They get back a polished draft and may not notice
   what changed at the level of rhythm and word choice.
3. **It makes the colleague's future writing look inconsistent**, which is the exact
   problem this skill exists to solve, inflicted on a third party.

**The generic pass is still genuinely useful in that case.** Catalog categories 1 through 5
run, the fact check runs, and the colleague gets their machine constructions flagged in
their own voice. That is a good outcome and the skill should offer it warmly rather than
treating it as a downgrade.

### The always-applies rules, whoever wrote the draft

Independent of byline:

- **The fact-check pass always runs.** A false claim is a false claim regardless of whose
  name is on it. Arguably it matters MORE on a teammate's draft, because the user has less
  direct knowledge of the underlying facts.
- **The tone-correct-only rule always holds.** Never invent substance, in either direction.
- **Approval on the actual text is always required.** Including, and especially, when the
  user is about to send corrections to a colleague. Approving a plan is not approving the
  words.

### One more case worth naming

**The user's own older writing.** People's voices change. A profile built from a 2024
corpus flagging a 2026 draft may be measuring drift rather than error, and the drift may be
the user growing rather than slipping.

Where the draft is the user's own and the flags cluster on habits rather than on
constructions, say so, and suggest re-running the voice creator on fresher material rather
than correcting the present toward the past.
