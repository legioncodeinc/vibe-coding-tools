# Severity tiers and register

Two decisions that must be made before any flag is raised, because both of them change
what counts as a violation.

**Establish the register first. Then assign severity.** A flag that is correct in one
register is wrong in another, so severity cannot be assigned until the target is known.

---

## Part 1: Register

### Why this comes first

Instruction-tuned models show reduced stylistic variation relative to human writers and
**fail to adapt style across registers**
(`research/distilled-ai-detection-and-stylometry.md`, section 2). That is measured.

Two consequences run in opposite directions and both matter:

1. **Register flatness is one of the strongest tells available.** A person writes a long
   post, a quick comment, and a client email differently. A model tends not to.
2. **A QA pass that does not establish register will reproduce the same failure.** If the
   skill judges a two-line comment against a long-form profile, it will flag the comment
   for being short, informal and unstructured, all of which are correct behavior for a
   comment. The skill becomes the thing it was built to catch.

There is a third reason, from stylometry. Vocabulary richness depends heavily on text
length and is unreliable used alone (same distillation, section 5). Judging a short piece
on vocabulary breadth produces a length artifact, not a finding.

### Establishing the register

**Ask.** Do not infer it from the draft. The draft is the thing under suspicion.

Use `AskUserQuestion` and get: the surface, the audience, and the relationship. Those
three settle it.

### The register table

Adapt this to the registers the user's own voice skill defines. A personal voice skill
built by this marketplace lists the person's real registers
(`voice-skill-integration.md`), and that list outranks this table. Where no voice skill is
installed, this is the working default.

| Register | Typical length | Formality | Structure expected | What is NOT a tell here |
|---|---|---|---|---|
| **Long-form post** | 300 words and up | Medium | Paragraphs, deliberate rhythm, a real ending | Some structure. A considered opener. Length. |
| **Short post** | Under 150 words | Medium-low | Little to none, line breaks over paragraphs | Fragments. No conclusion. Abrupt ending. |
| **Comment or reply** | Under 50 words | Low | None | No opener, no closer, no context-setting, one clause only, lowercase start |
| **Direct message** | Under 40 words | Lowest | None | Missing punctuation. Dropped question marks. Typos. Multiple sends. |
| **Client email** | 80 to 250 words | Medium-high | Greeting, body, sign-off | Politeness. Structure. Explicit next step. A closing line. |
| **Internal or team message** | Under 100 words | Low-medium | Minimal | Shorthand. Jargon the team shares. Bluntness. |
| **Public writing under a byline** | Variable | Medium-high | Full | Careful construction. Hedges kept deliberately. |

### The register-specific inversions

These are the cases where the generic catalog is actively WRONG, and they are the main
reason this file exists.

| Tell | Register where it is NOT a violation | Why |
|---|---|---|
| A tidy conclusion | Client email | An email that does not close is rude and unclear. A closing line is register-correct. |
| Structure and headers | Long-form public writing | Readers of long pieces need signposts. Bullets in a whitepaper are normal. |
| Formal register | Client email, contract, proposal | Formality is the register, not a drift from it. |
| Hedging | Any writing where the user is genuinely uncertain | A hedge that reflects real uncertainty is accuracy. See `fact-check-pass.md`. |
| Short uniform sentences | Direct message, comment | Burstiness is a long-form property. A four-word reply cannot vary. |
| No specifics | Comment, reply | A one-line reply is not obliged to carry a number. |
| An opener that sets context | Cold email, first message to a stranger | The reader has no context. Supplying it is correct. |

### The inverse failure

Some tells get MORE severe in casual registers, not less:

- **Markdown bleed** in a comment or message. Bold lead-ins and bullets in a two-line
  reply mark the piece instantly.
- **Any structure at all** in a DM.
- **Formality** in a message to someone the user is close to. This is the one a reader
  notices fastest, because they know the relationship.

---

## Part 2: Severity

### The four tiers

Severity answers one question: **how much of the piece does this flag condemn?** It is
not a measure of how confident the flag is. Confidence is the evidence tier, and it lives
in `ai-tell-catalog.md`.

---

### Critical

**A rule the user's own voice profile states as an absolute, violated.**

The profile said never, and the draft did it. There is no judgment call, no register
exception, and no reason to leave it in.

Examples: an em dash where the profile says the user never uses them. A biography claim
the profile's guardrails explicitly forbid. An emoji where the profile says zero. A
hashtag stack where the profile says at most one.

- **Requires:** an installed voice skill. Without one, nothing can be Critical, because
  nothing has been stated as absolute. Say this rather than promoting a Structural flag to
  fill the tier.
- **Handling:** fixed in the clean rewrite, always. Zero permitted in the output.
- **Reported as:** a count that must be zero.

---

### Structural

**A tell that marks the whole piece, and that cannot be fixed by replacing a span.**

The distinguishing test: **could you fix this with a find-and-replace?** If no, it is
Structural.

Examples: register flatness across the piece. Symmetrical paragraph architecture. Uniform
sentence length. A tidy summary conclusion. Participial-clause construction running
through the draft, three or more instances. The whole piece organized as a bulleted
argument when the user writes prose.

- **Why it is its own tier:** a reader who notices a Structural tell has formed a judgment
  about the whole piece before reaching the second paragraph. Fixing six words does not
  reach it.
- **Handling:** requires a re-draft of the affected structure, not a substitution. Say so
  in the markup rather than offering a span-level replacement that cannot work.
- **The honest note:** several Structural tells are CRAFT tier, meaning no measurement in
  the archive supports them (`ai-tell-catalog.md`). A flag can be Structural in severity
  and CRAFT in evidence at the same time. Report both.

---

### Moderate

**A span-level departure from the user's voice that a reader who knows them would notice.**

Examples: a word the user does not use, where the profile has a corpus to check against.
A contraction rate visibly off. A sentence opener outside their inventory. A hedge where
they would be direct, or directness where they would hedge. Politeness at the wrong
temperature for the relationship.

- **Handling:** flagged with a suggested replacement drawn from the user's own corpus.
- **Requires:** a voice profile for most of this tier. Without one, most Moderate flags
  become Low, because there is nothing to depart FROM.

---

### Low

**A generic AI-associated marker with no voice-profile basis, or a judgment call.**

Examples: one instance of a common style word such as `crucial` or `potential`, both of
which are ordinary English. Slight formality with no profile to measure it against. A
triad that may just be three things. A CRAFT-tier flag on a short piece where the sample
is too small to mean anything.

- **Handling:** listed, not necessarily changed. Marked as optional in the markup.
- **This tier is where restraint lives.** See the restraint rule below.

---

## Part 3: The restraint rule

The single most useful line found in the whole research sweep, from professional
copyediting practice:

> "If the only reason I can muster for revising text is 'I would never write it like
> that,' I leave the sentence alone."
> (`research/distilled-ai-detection-and-stylometry.md`, section 6)

Revision of grammatically sound prose is licensed on three named conditions only:
**repetitive, awkward, or unnecessarily wordy** (same section).

An automated pass has this failure mode in amplified form, because the model running it
has a stronger house style than any human copyeditor and no hesitation about applying it.

**The operative test for every flag: can you state a reason that is not preference?**

| Reason | Valid? |
|---|---|
| The voice profile says never | Yes. Critical. |
| The profile shows a different habit, with a rate | Yes. Moderate. |
| A measured study reports this feature at N times human rate | Yes, and cite the ratio. |
| It is repetitive, awkward, or unnecessarily wordy | Yes. The three licensed conditions. |
| It reads as AI to me | **No.** Not a reason. Find the countable feature underneath it or drop the flag. |
| I would have written it differently | **No.** The restraint rule. |
| It could be tighter | **No**, unless it is unnecessarily wordy, which is a stated condition with a threshold you can name. |

### The flag budget

An over-flagged draft is a failed run, because the user stops reading and stops trusting
the tool. Working guidance, authored craft, no measurement behind it:

- **Under 50 words:** at most 3 flags. A comment cannot support more.
- **50 to 200 words:** at most 8.
- **Over 200 words:** at most 15, plus whole-piece Structural flags.

Over budget means the Low tier gets cut first, then the CRAFT-tier flags on short samples.
If Critical and Structural flags alone exceed the budget, that is the real finding: report
it plainly and say the draft needs re-writing rather than correcting.

### The span-level error rate, and why it justifies restraint

The one detector vendor that publishes both figures reports a sentence-level false
positive rate of around 4% against a document-level rate of under 1%, roughly a four-fold
difference (`research/distilled-ai-detection-and-stylometry.md`, section 4).

Span-level judgment is the error-prone level. This skill works at span level. Every flag
inherits that. Flag fewer spans and be right about more of them.

---

## Part 4: The severity summary block

Every run reports this, at the top of the marked-up draft:

```
Register: client email (established with the user, not inferred)
Voice profile: mario-aldayuz-voice, installed
Draft length: 187 words, 12 sentences
Flag budget: 8. Used: 6.

Critical:    1   (must be zero after correction)
Structural:  2   (require re-draft, not substitution)
Moderate:    2
Low:         1

Evidence tiers: MEASURED 3, STRUCTURAL 1, CRAFT 2
Fact-check: 2 claims uncorroborated, listed separately
```

The evidence tier line is not optional. A user looking at six flags deserves to know that
two of them rest on authored craft rather than on a study.
