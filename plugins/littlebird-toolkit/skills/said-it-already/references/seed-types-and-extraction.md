# Seed types and extraction

Seven seed types. Each one is found by a different query, recognized by a different
signature, and rebuilt into a different post shape. Mining all seven with one generic
"find quotable moments" search returns the same three loud opinions every week.

Evidence note before you start: three independent sources converge on a similar moment
taxonomy, which is why the first four types below are on solid ground
(`research/distilled-content-mining-and-repurposing.md`, section 2). Two of the seven,
**the objection handled** and **the analogy**, are named by no source in the archive.
They are this skill's own craft additions. They are worth mining and they are marked
here as unsourced so nobody mistakes them for evidenced practice.

---

## The seed record

Every seed is a fixed-field record. The field set is small on purpose: a bank
over-engineered with fifteen tag dimensions becomes too much friction to maintain and
gets abandoned (`research/distilled-content-mining-and-repurposing.md`, section 5).

| Field | Content | Rule |
|---|---|---|
| `id` | `S-YYYY-MM-DD-nn` | Stable. Past reports are checked against it for de-duplication. |
| `type` | One of the seven below | Exactly one. A moment that fits two is filed under the stronger one. |
| `verbatim` | The original words, unedited | Mandatory. Includes the disfluency. See rule below. |
| `receipt` | Meeting name, date, and section, per `evidence-standards.md` rule 1 | Mandatory. No receipt, no seed. |
| `speaker_confidence` | High, Medium, or Low | Drives whether the seed can be drafted at all. See `attribution-screening.md`. |
| `register` | The situation it was said in | Client call, partner call, internal team, sales call, teaching or coaching, casual. |
| `why_it_works` | One or two sentences | Names the mechanism, not a compliment. See below. |
| `confidentiality` | Clear, Needs-scrub, or Do-not-publish | Set by `confidentiality-screen.md` before any drafting. |
| `theme` | The user's content pillar it belongs to | Three or four pillars, set with the user (`distilled`, section 5). |
| `draft` | The rebuilt piece | Written only after the two screens pass. |

**The verbatim field is never edited.** It is the ground truth and the receipt's payload.
Cleanup happens in `draft`, never in `verbatim`. This mirrors both the repo's corpus rule
in the voice skills and established transcript practice, where the editing level is
declared and the original word choice is not rewritten
(`research/distilled-content-mining-and-repurposing.md`, section 1).

**`why_it_works` is a mechanism, not praise.** "Strong line" is useless. "Names a cost the
reader has not priced in" is usable. Write the mechanism the reader will feel, because
that is what the hook has to preserve through the rebuild.

---

## Retrieval, per type

Run narrow parallel queries, never one broad one
(`littlebird-mcp-reference.md`, retrieval patterns). The window is set in the skill's
step 1. Substitute real dates.

Order of operations for every type:

1. `LB_INTERNAL_SEARCH_MEETINGS` with the type's queries, bounded by the window.
2. For each hit, `LB_INTERNAL_GET_MEETING` for the structured summary. **The `## For You`
   section is the highest-attribution surface in the whole MCP** and is where you look
   first (`littlebird-mcp-reference.md`).
3. `LB_INTERNAL_GET_MEETING_TRANSCRIPT` ONLY where you need exact wording for the
   `verbatim` field. Transcripts are long and weakly diarized. Pull wording from them,
   never attribution.

---

### 1. The hot take

**What it is.** A strong opinion stated plainly, with no hedge in front of it. The
speaker committed.

**Sourced.** Named as "strong claims or counterintuitive insights" and "strong opinions or
industry takes" by two independent vendors
(`research/distilled-content-mining-and-repurposing.md`, section 2).

**Search queries.**

- "the thing most people get wrong about"
- "I think the real problem is"
- "honestly I do not agree with that approach"
- "everyone says you should but"
- "the mistake I see over and over"

**Signature in a transcript.** A short declarative with no qualifier, often after a pause
or a "look," or "honestly,". Frequently followed immediately by the speaker softening it,
which is the tell that they knew it was strong.

**Common false positive.** The user AGREEING loudly with someone else's take. Reading a
statistic off a slide and reacting to it. Both are other people's opinions with the user's
enthusiasm attached. Check `attribution-screening.md`.

**Rebuild target.** Short form. Lead with the claim, no preamble. The softening clause the
speaker added afterward usually becomes the second line, because it is the nuance that
keeps the take from being a cheap shot.

---

### 2. The client story

**What it is.** A specific situation with a specific outcome. Not "we help clients with
X". A named month, a real number, a thing that went wrong first.

**Sourced.** This is the seed type with the strongest research behind it. Narrative
persuasion is measured across multiple meta-analyses, and the drivers are concrete imagery,
character identification, emotional shift, and real story structure
(`research/distilled-content-mining-and-repurposing.md`, section 4).

**Search queries.**

- "we had a client who was dealing with"
- "what happened was they came to us and"
- "so we tried that and it did not work at first"
- "by the end of the quarter they had"
- "the same thing happened with another customer"

**Signature.** Past tense, specific time markers, at least one number, and usually a
complication in the middle. Spoken client stories almost always arrive out of order,
because the speaker remembered a detail late and backed up.

**What to keep from the verbatim.** The concrete physical details and the real numbers.
Vivid imagery is a measured driver of belief change
(`research/distilled-content-mining-and-repurposing.md`, section 4). Strip the detail and
the story stops working.

**Rebuild target.** Long form on a three-beat spine: situation, complication, resolution.
Keep the situation and the complication short, because the audience is more interested in
the resolution (`research/distilled-content-mining-and-repurposing.md`, section 4). Impose
sequence: randomly re-arranged story parts measurably reduce transportation (same source).

**Hard constraint.** This is the seed type most likely to fail the confidentiality screen.
Run `confidentiality-screen.md` on every client story before drafting, not after.

---

### 3. The objection handled

**What it is.** Someone pushed back, and the user answered well in real time. The answer
is valuable precisely because it was not prepared.

**Unsourced.** No source in the archive names this as an extractable moment type
(`research/README.md`, gap 7). It is included on craft grounds: it is the only seed type
that arrives pre-tested against a real skeptic, and the objection itself is a ready-made
hook because it names an information gap the reader also has
(`research/distilled-content-mining-and-repurposing.md`, section 3, on Loewenstein's
information-gap account of curiosity).

**Search queries.**

- "but what about the cost of doing it that way"
- "I hear that a lot and here is what I tell people"
- "the pushback we usually get is"
- "that is a fair concern but the thing is"
- "why would we not just do it ourselves"

**Signature.** A question or challenge from another speaker, then a turn where the user
answers without hedging. Look for "the reason that does not work is" and "here is how I
think about it".

**Attribution warning specific to this type.** The objection and the answer are two
different speakers by definition. Weakly diarized chunks make it easy to attribute the
objection to the user or the answer to the client. **Both halves need speaker confirmation
or the seed goes to the confirm bucket.** See `attribution-screening.md`.

**Rebuild target.** Short form. Open with the objection in the objector's plain words, then
the answer. Do not name the objector or their company.

---

### 4. The analogy or metaphor

**What it is.** The user reached for a comparison to make something land, usually because
the literal explanation was not working.

**Unsourced.** No archive source names analogies as an extractable type
(`research/README.md`, gap 7). Included because analogies survive the register conversion
better than almost anything else: the image is portable even when the sentence is not.

**Search queries.**

- "it is basically like"
- "think of it the way you would think about"
- "imagine you are trying to"
- "the same way a restaurant would"
- "it is the difference between owning and renting"

**Signature.** "It is like", "think of it as", "imagine", "same way that". Often preceded
by a false start where the literal explanation failed first. Keep that false start in the
verbatim field; it frequently becomes the post's opening because it shows why the analogy
was needed.

**Rebuild target.** Quick statement or short form. Analogies bloat badly. If the rebuilt
version needs three sentences to set the analogy up, the analogy is not carrying its
weight.

**Quality check.** A borrowed analogy the user heard elsewhere is not a seed. If the
comparison is a common industry cliche, drop it.

---

### 5. The teaching explanation

**What it is.** The user explaining something clearly to a person who did not know it.
This is usually the single most valuable material on any call and the worst-reading
verbatim.

**Sourced.** Named as "process explanations and frameworks" by a repurposing vendor
(`research/distilled-content-mining-and-repurposing.md`, section 2). And there is a hard
measurement behind the difficulty: speakers doing the explaining produced 7.00 disfluencies
per 100 words against 4.93 for the listener, and harder material produced more disfluency
than familiar material (same distillation, section 1). **The best teaching passages are
measurably the messiest verbatim.** Expect them to look bad and rebuild them anyway.

**Search queries.**

- "so the way this actually works is"
- "let me back up and explain why that matters"
- "there are basically three things that have to happen"
- "the reason we do it in that order is"
- "a lot of people do not realize that"

**Signature.** Second person pronouns aimed at one listener, numbered structure stated out
loud ("first", "the second thing"), and a check-in ("does that make sense?"). The check-in
is a reliable marker that a teaching passage just ended.

**Rebuild target.** Long form, or a numbered short form. The spoken numbering usually
survives as the post's structure, which is why this type converts most reliably of all
seven.

**Cut hard.** The listener had context the reader will not have, and the speaker also
repeated themselves because the listener looked confused. Both have to go. See
`spoken-to-written.md`.

---

### 6. The contrarian observation

**What it is.** Distinct from the hot take. A hot take is an opinion. A contrarian
observation is a noticing: something true that runs against the consensus, usually stated
with mild surprise rather than force.

**Sourced.** "Counterintuitive insights" and "contrarian claim" are both named as moment
types (`research/distilled-content-mining-and-repurposing.md`, section 2). And surprise is
the one attention driver in the archive with real measurement under it: 72% of gaze shifts
went toward locations more surprising than average (same distillation, section 3).

**Search queries.**

- "which is strange because you would expect"
- "nobody talks about this but"
- "it turns out the opposite is actually true"
- "we assumed it would be X and it was not"
- "the counterintuitive thing here is"

**Signature.** A surprise marker: "turns out", "actually", "which is weird", "you would
think". Usually shorter than a hot take and less defended, because the speaker is
reporting rather than arguing.

**Rebuild target.** Short form. Open by stating the consensus in one line, then the
observation. The gap between them is the hook, and it works through an information gap
rather than a tease (`research/distilled-content-mining-and-repurposing.md`, section 3).

---

### 7. The number or result stated out loud

**What it is.** A figure the user said in passing: a percentage, a dollar amount, a
timeline, a count.

**Sourced.** "Data points and statistics" and "surprising statistics" are named by both
repurposing vendors (`research/distilled-content-mining-and-repurposing.md`, section 2).

**Search queries.**

- "we cut that from six weeks down to"
- "about forty percent of the time what happens is"
- "that saved them roughly"
- "we have done this now around a hundred times"
- "the number that surprised me was"

**Signature.** Any numeral in a spoken clause. Also spoken-out numbers ("forty percent",
"a couple hundred grand").

**Three mandatory checks before this becomes a seed.**

1. **Whose number is it?** A figure the user read off someone else's slide is not theirs.
   Attribution guardrail, `evidence-standards.md` rule 4.
2. **Is it approximate?** Spoken numbers are almost always hedged: "roughly", "like",
   "around". The hedge must survive into the draft. Publishing "we cut it 60%" when the
   user said "like, sixty percent, maybe" is a fabrication.
3. **Is it publishable?** Client-specific figures, deal terms, and revenue numbers usually
   are not. `confidentiality-screen.md` decides.

**Rebuild target.** Quick statement or short form. Never lead a long-form piece with a
number the user hedged.

---

## Bank composition

Target 10 to 15 seeds per weekly run. That number is a starting point, not a benchmark:
the only working volume figure in the archive is one practitioner's unsourced report of
ten to twelve usable pieces per batching hour after an input system existed
(`research/distilled-content-mining-and-repurposing.md`, section 5). Tell the user it is a
starting point.

**Spread across types.** A bank of fourteen hot takes is a failure even if every one is
good. Cap any single type at roughly a third of the bank. If a type comes back empty for
the window, report it as empty rather than backfilling from another type. The empty types
are information: they tell the user what kind of conversation they did not have this week.

**Deduplicate against past reports.** Read prior routine reports with
`LB_INTERNAL_GET_ROUTINE_REPORTS` before adding anything. The same strong opinion recurs
across many calls, and the platform's own stated position is that repetitive posts are
demoted (`research/distilled-content-mining-and-repurposing.md`, section 6). A recurrence
is not a new seed. It is either dropped, or promoted deliberately as "you have now said
this in four calls, it is clearly a core position, here is the definitive version",
which is a stronger piece than any of the four individual instances.
