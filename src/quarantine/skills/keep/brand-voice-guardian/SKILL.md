---
name: brand-voice-guardian
description: "Quality assurance pass for anything shipping under the user's name. Trigger on
  'does this sound like me', 'check this draft', 'run this past my voice', 'does this read as
  AI', 'fix the tone on this', 'my teammate wrote this, make it sound like me', 'de-AI this',
  or when the user pastes a draft and asks whether it is publishable. Runs a supplied draft,
  theirs or a teammate's or one an AI produced, against their installed personal voice skill.
  Returns a marked-up draft with every flagged span, a counted tell inventory, a clean rewrite
  in their voice, a separate fact-check pass on claims it could not corroborate against their
  own record, and a short why-each-change section. Tone-corrects only and never invents facts.
  Does not promise to defeat AI detectors, because nobody honestly can."
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan) for the fact-check pass. A personal voice skill for tone matching."
---

# Brand Voice Guardian

## Purpose

The QA pass for everything that ships under the user's name.

Give it a draft. Any draft. Theirs, a teammate's, or one an AI produced. It runs the draft
against their personal voice skill and returns five things:

1. **A marked-up draft.** Every flagged span, with the rule it violates, the severity, and a
   suggested replacement.
2. **A tell inventory.** The specific AI markers found, counted, with rates. Concrete and
   checkable, never vibes.
3. **A clean rewritten version** in the user's voice.
4. **A fact-check pass.** Claims in the draft the skill could not corroborate against the
   user's own record, reported separately from tone issues.
5. **A why each change section**, so the user gets better at this instead of depending on the
   skill forever.

### This skill is different from the rest of this marketplace

**Every other skill here MINES the user's capture and produces something new. This one takes
a draft the user hands it and checks that draft.** It is primarily interactive and
input-driven. There is no scheduled sweep, no accumulation, no routine.

Littlebird is still used, in a narrower role than elsewhere:

- **Grounding factual claims** in the draft against what actually happened.
- **Pulling the user's real corpus** for comparison when no voice skill is installed.

Neither of those is the main event. The main event is the draft the user pasted.

### The two hard rules

**Tone-correct only. Never invent substance.** The skill does not add facts, examples,
results, numbers, or claims the user did not supply. This is the most likely way it causes
harm and it has no exceptions. See `references/fact-check-pass.md`, step 4.

**It never promises to defeat a detector.** It makes text sound like the user. Detector
behavior is a side effect nobody controls. See `references/detection-reality.md`.

---

## Littlebird MCP calls used

Real tool names, verified against the live server
(`references/littlebird-mcp-reference.md`). LIST the tools available in this session before
calling anything, and use the names you actually find.

| Tool | Used for |
|---|---|
| `search_user_context` | The fact-check pass: corroborating claims, numbers, outcomes and named entities against capture. Also Mode C corpus pull when no voice skill exists. |
| `LB_INTERNAL_SEARCH_MEETINGS` | Corroborating a claim about a conversation, looked up by TOPIC |
| `LB_INTERNAL_LIST_MEETINGS` | Corroborating a claim about a specific meeting, looked up by NAME or date |
| `LB_INTERNAL_GET_MEETING` | The structured summary, which carries owner attribution for Decisions and Action Items |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Exact wording only. Never attribution. |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Explaining a plan gate when Littlebird tools return plan errors |

**Not used, deliberately:** `LB_INTERNAL_CREATE_ROUTINE`, `LB_INTERNAL_UPDATE_ROUTINE`,
`LB_INTERNAL_LIST_ROUTINES`, `LB_INTERNAL_GET_ROUTINE_CONFIG`,
`LB_INTERNAL_GET_ROUTINE_REPORTS`. This skill has no routine. See Routine cadence below.

There is no Littlebird tool that searches past Littlebird chat conversations. Where a claim
would live in one, use `search_user_context` and say so.

---

## Trigger

**On demand, per draft. Always.**

Trigger when the user says any of: does this sound like me, check this draft, run this past my
voice, does this read as AI, fix the tone on this, de-AI this, my teammate wrote this and it
needs to sound like me, is this publishable, would anyone know I did not write this.

Also trigger when the user pastes a block of text and asks any question about whether it is
ready to send.

**Do not trigger** to write something new. That is the voice skill's job directly, or
`content-repurposer` for derivatives. This skill checks existing text.

---

## Routine cadence

**None. This skill has no routine and should not be given one.**

Say so if the user asks. Three reasons:

1. **There is nothing to observe.** A routine watches for a condition on a schedule. This
   skill's input is a draft a human hands over. No schedule can produce one.
2. **The work requires approval gates that a routine cannot run.** Register confirmation,
   byline confirmation, conflict resolution, and approval of the actual final text all need
   an interactive session (`references/littlebird-mcp-reference.md`, the Routines-observe
   Cowork-acts pattern).
3. **A routine that checked drafts on a timer would be checking stale drafts**, which is
   worse than not checking them.

If the user wants a recurring writing-related routine, point them at `content-repurposer` or
`said-it-already`, both of which have real nomination routines. If they want to tune an
existing routine, point at `routine-architect`.

---

## Capability gate

Two gates, and they fail differently. Neither one stops the run on its own.

### Gate 1: The personal voice skill (governs tone matching)

**LIST the skills available in this session.** Look for a name ending in `-voice` or
`-voice-skill`, or a description saying it writes in the authentic voice of a named person.

- **Found:** Mode A, full function.
- **Not found, Littlebird connected:** offer Mode C, a corpus fallback for this run only.
- **Not found, no Littlebird:** Mode B, generic pass.

Full detail on all three modes, including the exact words to say in Mode B, is in
`references/voice-skill-integration.md`, part 4.

**Never fabricate a voice profile.** Not from the draft, not from one sample, not from what
the user says about how they write.

### Gate 2: The Littlebird MCP (governs the fact-check pass)

This skill requires the **Littlebird MCP on a Power or Pro plan** for corroboration.

1. LIST the tools actually available in this session. Do not assume tool names.
2. If no Littlebird tools are present, **do not stop.** Run the tone pass, and run the
   fact-check pass in list-only mode: extract the claims, list them, mark every one Not
   checked, and hand the user a manual checklist
   (`references/fact-check-pass.md`, final section). Say plainly that no corroboration was
   attempted and why, with a link to https://support.littlebird.ai/docs/mcp/.
3. If the tools are present but return plan errors, call
   `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` and report the plan gate.

**This is the one skill in the marketplace that degrades to something genuinely useful with
no Littlebird at all**, because its primary input is the user's draft rather than their
capture. Say so rather than blocking.

---

## Process

### Step 1: Frame the run

Ask with `AskUserQuestion`, in one batch, before reading the draft closely. All five
questions change what counts as a violation.

1. **Whose name does this go out under?** The single most important question in the run.
   The user's, a teammate's, or a shared byline. See
   `references/voice-skill-integration.md`, part 6. **If the answer is a teammate's name,
   voice matching is disabled for this run** and the skill runs the generic pass plus fact
   check.
2. **What register?** The surface, the audience, and the relationship. Do not infer it from
   the draft. The draft is the thing under suspicion. See
   `references/severity-and-registers.md`, part 1.
3. **Who wrote the first draft?** The user, a teammate, or an AI. This changes nothing about
   the tone pass and everything about what the user should know regarding disclosure
   (`references/detection-reality.md`, part 5).
4. **How much correction do they want?** Flag-only, flag plus rewrite, or a full rewrite.
   Default is flag plus rewrite.
5. **Is anything in the draft deliberate?** A construction they chose on purpose. Take this
   before flagging it, not after arguing about it.

Then run gate 1 and gate 2 and **state the mode out loud before doing any work.**

### Step 2: Load the reference profile

Progressive disclosure. Do not read a whole voice skill for a two-line comment.

Follow `references/voice-skill-integration.md`, part 3. Always the voice skill's SKILL.md.
Then `anti-ai-rules.md` for anything longer than a one-liner. Then `fingerprint.md` for a
substantive rewrite. Then `corpus.md` before finalizing, to calibrate RHYTHM and not just
vocabulary. Then `samples/` filtered to the target register.

Extract the register list, the hard NEVER rules, the punctuation fingerprint, the emoji and
hashtag and exclamation rates with their numbers, and the biography guardrails. The
biography guardrails feed the FACT-CHECK pass, not the tone pass.

### Step 3: Establish the register, formally

Take the answer from step 1 and map it onto the user's own register list from their voice
skill. **That list outranks the default table** in
`references/severity-and-registers.md`.

Then look up the register-specific inversions in that file. These are the cases where the
generic catalog is actively WRONG: a tidy conclusion is correct in a client email, structure
is correct in long-form public writing, formality is correct in a proposal, and uniform short
sentences are correct in a message because a four-word reply cannot vary.

**Set the flag budget now, before flagging anything.** Under 50 words: at most 3 flags. 50 to
200 words: at most 8. Over 200 words: at most 15 plus whole-piece structural flags.

### Step 4: Run the tell inventory

Follow `references/ai-tell-catalog.md`. **Count. Do not vibe.**

Work through the six categories: punctuation, lexical, grammar and sentence construction,
structure, rhetorical habits, and the user-specific layer.

Two entries carry the largest measured multiples in the research and deserve attention
first:

- **Present participial clauses.** Instruction-tuned LLMs use them at **2 to 5 times the
  human rate**, the largest single multiple in the archive
  (`references/research/distilled-ai-detection-and-stylometry.md`, section 2). The trailing
  comma plus `-ing` verb plus consequence is the signature form. Search for it directly.
- **Register flatness.** LLMs show reduced stylistic variation and instruction-tuned
  variants fail to adapt across registers (same section). This is the tell that survives
  word substitution, and it is why step 3 comes first.

**Every flag carries its evidence tier.** MEASURED means a study in the archive reports a
rate. STRUCTURAL means observed without a human baseline. CRAFT means authored reasoning with
no measurement. Several of the most famous tells, including sentence-length uniformity,
triadic lists, symmetrical paragraphs and the tidy conclusion, are CRAFT tier
(`references/research/distilled-ai-detection-and-stylometry.md`, section 9). Flag them
anyway. Label them honestly.

**Apply the restraint rule to every single flag** before it goes in the inventory
(`references/severity-and-registers.md`, part 3):

> If the only reason for revising is "I would never write it like that", leave it alone.

The operative test: can you state a reason that is not preference? "It reads as AI to me" is
not a reason. Find the countable feature underneath it or drop the flag.

### Step 5: Assign severity

Four tiers, defined in `references/severity-and-registers.md`, part 2.

| Tier | Definition |
|---|---|
| **Critical** | A rule the user's own voice profile states as an absolute, violated. Requires an installed voice skill. Must be zero in the output. |
| **Structural** | Marks the whole piece and cannot be fixed by find-and-replace. Requires a re-draft, not a substitution. |
| **Moderate** | A span-level departure from the user's voice a reader who knows them would notice. |
| **Low** | A generic marker with no voice-profile basis, or a judgment call. Listed, not necessarily changed. |

**The Critical tier is empty in Mode B and Mode C.** Nothing has been stated as an absolute.
Do not promote a Structural flag to fill it.

If over the flag budget, cut Low first, then CRAFT-tier flags on short samples. **If Critical
and Structural flags alone exceed the budget, that is the real finding.** Say so and tell the
user the draft needs re-writing rather than correcting.

### Step 6: Run the fact-check pass

**Separate from the tone pass. Separate section. Runs regardless of mode.** Follow
`references/fact-check-pass.md`.

Extract every checkable assertion: numbers, outcomes, attributions, events, named entities,
comparisons, superlatives, temporal claims. Do not extract opinions or predictions.

**Superlatives get special attention.** "A good month" becoming "our best month" is a
fabrication performed by an editing pass, and it is the specific way this skill causes harm.

Retrieve with narrow parallel queries, never one broad one. By NAME uses `LIST_MEETINGS`. By
TOPIC uses `SEARCH_MEETINGS`. Read the relevance scores: an item scored 3 is a maybe and does
not corroborate a claim alone.

Assign each claim one of five statuses: **Corroborated** with a receipt and a confidence
rating, **Contradicted**, **Uncorroborated**, **Unverifiable**, or **Not checked**.

**Contradicted goes first in the report, ahead of every tone flag including Critical.**

**Absence of corroboration is not evidence a claim is false.** Littlebird captures what was
on screen. A true fact that never crossed a screen produces nothing. Say this in the section
header every time.

### Step 7: Write the clean version

Rewrite in the user's voice, at the target register, with zero Critical flags remaining.

**The five rules from `references/fact-check-pass.md`, step 4, are absolute:**

1. Tone correction never touches a claim. Change how a claim is stated, never what is
   claimed.
2. **A dropped hedge is a fabrication.** "Roughly", "about", "I think", "in my experience"
   are part of the claim, not part of the tone. Every instinct in a tightening pass says cut
   them. Do not.
3. Never strengthen a superlative or a comparison.
4. **Never add a specific to fix a vague sentence.** If the draft says "incredible results"
   with no number, cut the adjective. Do not supply a number.
5. Attribution survives the rewrite. Reported speech stays reported speech.

Then calibrate against `corpus.md`. **Match the rhythm, not just the vocabulary.** A draft
using the user's words with someone else's cadence sounds nothing like them.

Run the voice skill's own calibration test: read it out loud. Press release means fail. The
actual person means pass.

**Fix em dashes and en dashes by deterministic substitution, not by asking a model to avoid
them.** GPT-4.1 continued producing them at 9.10 per 1,000 words while explicitly instructed
not to use markdown (`references/research/distilled-ai-detection-and-stylometry.md`, section
3). Do the replacement yourself and verify the count is zero.

### Step 8: Write the why each change section

**The section that makes the skill obsolete over time, which is the point.**

For every Critical and Structural flag, and for a representative sample of Moderate flags,
give one or two sentences covering: what the pattern is, why it reads wrong for this user in
this register, and the general rule to carry forward.

In Mode A, cite the person's own rule for each one. That is what makes this section teach
rather than assert.

**Group by pattern, not by span.** Four instances of the same participial construction is one
lesson, not four. A user who learns one pattern fixes it forever. A user handed forty
individual corrections learns nothing and stops reading.

### Step 9: Approval

**The user approves the actual final text, not a plan and not a summary**
(`references/evidence-standards.md`, rule 6).

Use `AskUserQuestion`. Present the clean rewrite in full, the Critical and Contradicted
findings, and any conflict the resolution order could not settle.

**Where the profile and the catalog genuinely conflict, hand it back rather than deciding.**
Professional editing resolves voice-versus-house-style through conversation between two named
parties (`references/research/distilled-ai-detection-and-stylometry.md`, section 6), and that
conversation is unavailable to an automated pass. Surface the conflict instead of claiming
authority the skill does not have.

Then hand the report back. **The skill does not send, post, publish, or write the corrected
draft into any third-party system.**

---

## Output

One file: **`voice-check-YYYY-MM-DD-HHMM.md`**, in the user's working directory unless they
name another location. Timestamped to the minute because a user may run several drafts in one
session.

Sections, in this order:

1. **Run frame.** The mode (A, B or C) and what that mode can and cannot do. The byline
   answer. The register, and that it was established with the user rather than inferred. The
   voice skill used, by name, or the plain statement that none was found. Draft length in
   words and sentences. The flag budget and how much of it was used.
2. **The severity summary block.** Counts by tier, counts by evidence tier, and the
   fact-check headline. Exact shape in `references/severity-and-registers.md`, part 4.
3. **Fact check.** Before the tone findings, because a factual problem outranks a tonal one.
   Contradicted first, then Uncorroborated with the queries and window that were run, then
   Unverifiable, then Corroborated with receipts and confidence, then Not checked. Full
   format in `references/fact-check-pass.md`, step 5.
4. **The marked-up draft.** The full original text with every flagged span marked inline.
   Each mark carries: flag number, the rule violated, severity, evidence tier, and the
   suggested replacement. Structural flags appear as whole-piece annotations rather than
   span marks, because a span replacement cannot fix them.
5. **The tell inventory.** The table. Columns: number, tell, category, evidence tier, count,
   rate, severity, evidence note. Totals by severity and by tier. Exact shape in
   `references/ai-tell-catalog.md`, final section.
6. **The clean version.** The full rewrite, ready to use. Zero Critical flags. Zero em
   dashes and zero en dashes.
7. **Why each change.** Grouped by pattern. One or two sentences each, with the general rule
   to carry forward.
8. **Unresolved conflicts**, if any. Where the profile, the register and the catalog
   disagreed and the resolution order did not settle it. The user decides these.
9. **What this pass does not claim.** The standing paragraph from
   `references/detection-reality.md`, part 4. Once per run, in full.
10. **Method and gaps.** Which reference files were read, which Littlebird queries ran over
    which window, what came back empty, which claims were not checked and why, and which
    flags rest on CRAFT-tier reasoning rather than a measured study.

Raw retrieved capture does not go in this file. Process it in temp space and let it go
(`references/evidence-standards.md`, rule 7). The corpus is never quoted into the
deliverable; it is the user's own private writing.

---

## Empty retrieval

Two kinds, and they end differently. Neither one ends the run, which is unusual for this
marketplace and is a direct consequence of the input being a draft rather than capture.

**The fact-check retrieval comes back empty.** Report the gap and continue. Say exactly which
queries ran, over which window, with which filters, and that they came back empty. Then give
the likely causes: the fact was never on a screen, the window is wrong, or the claim predates
the Littlebird install. Mark every claim Uncorroborated or Not checked and hand the user a
manual checklist. **Never pad from training data, never reason from what would probably be
there, never substitute a plausible example** (`references/evidence-standards.md`, rule 9).

**The Mode C corpus pull comes back empty.** Drop to Mode B and say so. Run the generic pass.
Do not construct a voice profile from whatever thin material did come back.

**The one thing that DOES end the run:** the user supplies no draft. This skill has no other
input. Ask for one and stop.

---

## Guardrail

**The specific risk this skill carries: it rewrites text that ships under a real person's
name, and the rewrite is the most persuasive-looking output in the entire marketplace.** A
clean, confident, voice-matched draft invites the user to publish without reading it closely.

Five failure modes, in the order they bite.

1. **Invented substance.** The skill adds a number, an example, a result, or a specific that
   the user never supplied, because the vague sentence read badly and a concrete one reads
   well. **This is the worst thing the skill can do and it has no exceptions.** A draft that
   sounds perfect and states something untrue is a worse failure than one that reads as
   machine-written. The five rules in step 7 exist for this and they are absolute.
2. **The dropped hedge.** The quietest version of failure mode 1, and the most likely to
   actually happen. Hedges read as weak writing and every instinct in a tightening pass says
   cut them. A hedge is part of the claim. Cutting it makes a stronger claim than the user
   made, in the user's own voice, with the user's name on it.
3. **Overcorrection into the model's house style.** The skill flags forty things, rewrites
   the draft into competent generic prose, and the user ships something that sounds like
   neither them nor the original. The restraint rule and the flag budget exist for this.
   Professional practice is explicit: if the only reason to revise is that you would have
   written it differently, leave it alone
   (`references/research/distilled-ai-detection-and-stylometry.md`, section 6).
4. **Register error.** Flagging a comment for being short and unstructured, or an email for
   having a closing line. A flag correct in one register is wrong in another. Establishing
   register FIRST is not optional, and the inversion table in
   `references/severity-and-registers.md` exists because this failure is easy and invisible.
5. **The undetectability promise.** Telling a user their draft will now pass a detector.
   Nobody can honestly say that. Detectors measure predictability, not authorship: seven
   mainstream detectors falsely flagged **61.22%** of genuine essays by non-native English
   writers, all seven agreed on **19.78%** of them, and a prompt asking for more
   native-sounding vocabulary cut the rate to **11.77%** without changing who wrote them
   (`references/research/distilled-ai-detection-and-stylometry.md`, section 4). A detector's
   verdict is not information about who wrote something, in either direction.

**The teammate case.** Correcting a colleague's draft into the user's voice is legitimate
only when the content ships under the USER's name. Where it ships under the colleague's name,
voice matching is disabled and the skill runs the generic pass plus fact check. Rewriting
someone's byline into another person's cadence erases their voice from their own work,
usually invisibly to them (`references/voice-skill-integration.md`, part 6).

**Disclosure is a separate question and this skill does not settle it.** On the one platform
with a clear rule, AI-generated content stays AI-generated "even if you applied substantial
edits afterwards", and the line is drawn by who wrote the first draft rather than by how the
finished text reads. Under the one legal regime located, formal-only passes such as
spell-checking are explicitly excluded from the human-review exemption
(`references/research/distilled-ai-detection-and-stylometry.md`, section 7). **The skill
states this once, gives no legal advice, and never presents its own output as satisfying any
disclosure obligation.**

**The draft-never-send law.** Nothing is sent, posted, published, scheduled, or written into
a third-party system without the user approving the actual final text through
`AskUserQuestion`. This holds even when a connector is present in the session and even when
the user approved the plan, because approving a plan is not approving the words. Where a
connector exists and the user wants it used, produce the payload and stop for approval on the
exact text first.

**Zero em dashes and zero en dashes in every artifact this skill produces.** This is the
skill that enforces the rule. A violation here is fatal to its credibility. Verify the count
before handing anything back.

---

## Evidence standards

Every claim in the deliverable follows `references/evidence-standards.md`. The rules that
bite hardest here:

- **Rule 2, observed and inferred.** A tell COUNT is observed. "This reads as AI" is an
  inference. Every flag shows which it is via its evidence tier, and CRAFT-tier flags are
  labeled as authored reasoning rather than measurement.
- **Rule 1, receipts.** Every corroborated claim in the fact-check pass carries one. For
  messages, collection time and send time are different values and both appear.
- **Rule 3, confidence.** Every fact-check finding is rated. A Low-confidence Contradicted
  finding never gets presented as a correction, because publishing under a wrong correction
  is as bad as publishing the original error.
- **Rule 4, attribution.** Governs Mode C absolutely. Capture shows what the user was
  viewing, not what they wrote. Text in a compose box is probably theirs; text in a feed is
  probably not.
- **Rule 5, partial rosters.** Any engagement or count claim in the draft is unverifiable
  from capture in principle, because social and app UIs collapse lists. Say so rather than
  half-corroborating it.
- **Rule 6, confirmation.** Two gates. Confirm the Mode C sample is representative before
  comparing anything against it. Confirm the actual final text before it counts as approved.
- **Rule 7, raw capture never ships.** The fact-check section names what it found without
  reproducing another person's messages or another company's dashboard. The corpus is never
  quoted into the deliverable.
- **Rule 8, timeline discipline.** Retrieval returns relevance-ordered results. Sort by
  timestamp before assessing any temporal claim in the draft.
- **Rule 9, empty retrieval.** Reported, never padded. No plausible examples, ever.
- **Rule 10, reporting on people.** Drafts routinely name clients, colleagues and third
  parties. The fact-check pass applies the same standards to them, and sensitive categories
  stay out of the report even where the capture contains them.

---

## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.

---

## Related skills

| Skill | Relationship |
|---|---|
| `combined-voice-creator` | Builds the reference profile from both Littlebird data and a Facebook export. The strongest option, and the one to recommend first when no voice skill is installed. This skill enforces what that one builds. |
| `littlebird-voice-creator` | Builds the profile from Littlebird capture alone. |
| `facebook-voice-creator` | Builds the profile from a Facebook data export alone. |
| `content-repurposer` | Produces derivative drafts through the user's voice skill. Its output is a natural input to this one, and running this skill over a content pack before publishing is the intended pairing. |
| `said-it-already` | Mines many sources for content seeds. Its confidentiality screen is the right tool where the question is whether something should be published at all, which is a different question from whether it sounds right. |
| `routine-architect` | For any recurring writing workflow. This skill has no routine by design. |

---

## References

| File | What it covers |
|---|---|
| `references/ai-tell-catalog.md` | The six categories, every tell with a counting rule and an evidence tier, the measured ratios, the user-specific layer, the inventory table format |
| `references/severity-and-registers.md` | Establishing register first, the register table and its inversions, the four severity tiers, the restraint rule, the flag budget, the summary block |
| `references/fact-check-pass.md` | Claim extraction, the retrieval brief, the five statuses, the five absolute rules governing the tone pass, output format, list-only mode |
| `references/detection-reality.md` | What detection can and cannot do, the numbers, what the skill says verbatim, what it must never say, the disclosure question |
| `references/voice-skill-integration.md` | Finding and reading a voice skill, the three modes, the conflict resolution order, the teammate case |
| `references/littlebird-mcp-reference.md` | Tool inventory, parameters, return shapes, known limitations |
| `references/evidence-standards.md` | Receipts, confidence, attribution, partial rosters, confirmation gates, empty retrieval |
| `references/research/distilled-ai-detection-and-stylometry.md` | Cited distillation of the domain research, every claim traced to a raw file |
| `references/research/README.md` | Archive contents, source mix and weighting, research window, evidence quality, ten named gaps, retrieval failures, recorded conflicts |
