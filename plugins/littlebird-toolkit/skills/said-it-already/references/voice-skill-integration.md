# Voice skill integration

This is the strategic point of the skill, so handle it explicitly rather than as a nicety.

This marketplace already ships three skills that build a user's personal writing-voice
skill from their own data: `littlebird-voice-creator`, `facebook-voice-creator`, and
`combined-voice-creator`. **Those build the VOICE. This skill feeds it MATERIAL, and the
material is real rather than invented.**

A voice skill with nothing to say produces perfectly-calibrated posts about nothing. A
content bank with no voice produces true material in generic prose. The two halves are
built to fit.

---

## Step 1: detect

Before drafting anything, LIST the skills available in this session. Do not assume, and do
not ask the user whether they have one before you have looked: they may not know what it
is called.

A personal voice skill in this ecosystem looks like one of these:

- A name ending in `-voice` or `-voice-skill`, usually built from the user's name, for
  example `firstname-lastname-voice`.
- A description that says it writes posts, comments, replies, or messages "in the
  authentic voice of" a named person.
- A folder containing `references/fingerprint.md`, `references/anti-ai-rules.md`,
  `references/corpus.md`, and `references/samples/`.

The voice-creator skills produce exactly that structure, so any of the three signals is
sufficient. If several are installed, ask which one governs the platform the user is
drafting for.

---

## Step 2a: a voice skill IS installed

**Draft through it.** Every seed's `draft` field is written by invoking the voice skill,
not by this skill writing in a house style and hoping it sounds close.

Handoff protocol, in order:

1. Invoke the voice skill and read its SKILL.md and its references before drafting. Its
   `anti-ai-rules.md` and `fingerprint.md` govern, and they override anything in
   `spoken-to-written.md` where the two disagree. The voice skill is calibrated against the
   user's actual corpus; this skill is not.
2. Pass it the seed's **verbatim**, not a paraphrase. The verbatim is the user's own
   speech, which is the closest possible input to their voice, and handing over a
   pre-smoothed summary throws away exactly the signal the voice skill was built to
   preserve.
3. Pass the seed `type`, the `register`, and the target format so the voice skill can pick
   its register. Those skills instruct one register per piece.
4. Ask it for the piece. Let it choose punctuation, dash habits, emoji rate, exclamation
   rate, sentence rhythm, and sign-off behavior.

**Where the two skills disagree, the voice skill wins on style and this skill wins on
facts.** Concretely:

| Question | Who decides |
|---|---|
| Punctuation, rhythm, vocabulary, emoji, length, sign-off | The voice skill |
| Which register the piece is in | The voice skill, informed by this skill's `register` field |
| Whether a number keeps its hedge | This skill. Non-negotiable. |
| Whether a client is named | This skill's confidentiality screen. Non-negotiable. |
| Whether the seed can be published at all | This skill's attribution and confidentiality screens. Non-negotiable. |
| Whether a quoted verbatim is altered | Neither. The verbatim field is never edited. |

The voice skill is allowed to make the piece sound like the user. It is not allowed to
make the piece say something the user did not say.

**One caution that matters here.** The voice-creator skills are calibrated on the user's
WRITTEN corpus, mostly social posts and messages. This skill supplies SPOKEN material. The
register conversion in `spoken-to-written.md` still has to happen before or during the
handoff, because a voice skill asked to polish a transcript line will produce a
transcript line in the user's voice.

---

## Step 2b: no voice skill is installed

**Say so, plainly, and offer the fix.** Do not silently write in a generic style and hand
back posts that do not sound like the user. That is the failure this repo exists to
prevent.

Tell the user, in the artifact and in conversation:

- The drafts below carry their real material and their real words where the words
  mattered, but the prose around those words is not calibrated to their voice.
- This marketplace ships three skills that build a personal voice skill from their own
  data: `littlebird-voice-creator` (from Littlebird capture), `facebook-voice-creator`
  (from a Facebook data export), and `combined-voice-creator` (both sources together).
- Building one is a one-time job that makes every future run of this skill substantially
  better, because the bank stops needing manual rewriting.
- Offer to run one now, or to continue without it.

If they continue without it, follow the drafting rules in `spoken-to-written.md` and lean
harder than usual on the verbatim: use the user's own words wherever the sentence allows,
because their actual speech is the only voice signal available.

**Never fabricate a voice model from screen capture in this skill.** Capture shows what the
user was VIEWING, not what they wrote (`evidence-standards.md`, rule 4), and building a
style model from it is precisely the mistake the voice creators were designed to avoid.
That job belongs to those skills, which do it properly with a confirmation pass.

---

## Format targets, matched to the voice skills

The voice-creator skills store approved samples in three classes. Match them so a piece
drafted here drops straight into that structure:

| Class | Shape | Seed types that fit best |
|---|---|---|
| **Long form** | 500 words or more, by register | Client story, teaching explanation |
| **Short form** | Under three sentences | Hot take, contrarian observation, objection handled |
| **Quick statement** | Eight words or fewer | Analogy, number stated out loud |

These are the voice skills' own class definitions, not this skill's invention. Aim for a
mix in every bank: a bank of fifteen long-form pieces is unusable because nobody publishes
fifteen essays in a week.

**One seed can yield more than one class.** A client story that also contained a number
gives a long form and a quick statement. Note the shared `id` on both so the user does not
publish two versions of the same moment in the same week. Repetition is explicitly named
as demoted by the one first-party platform source in the archive
(`research/distilled-content-mining-and-repurposing.md`, section 6).

---

## Feeding the voice skill back

Approved drafts from this skill are new approved samples. Once the user approves a piece,
offer to add it to the voice skill's `references/samples/` in the right class file. Only
approved and, where the user tuned it, tuned versions go in. That is the voice-creator
skills' own rule, and it means the voice skill gets sharper every week this one runs.

That loop is the reason these two skills belong in the same marketplace: the voice skill
teaches this one how to sound, and this one gives the voice skill new ground truth to
learn from.
