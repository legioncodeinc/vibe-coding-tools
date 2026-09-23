# Attribution screening

The highest risk in this skill. Publishing someone else's line as your own is a
reputational hazard that does not degrade gracefully: it is either fine or it is a public
problem, and the person whose line it was is the one most likely to see it.

This screen runs on every candidate seed, before the confidentiality screen and long
before drafting.

---

## Why the risk is structural, not occasional

Three facts stack.

1. **A meeting has multiple speakers.** Everything mined here came out of a conversation.
   The default assumption for any given line is that somebody else said it.
2. **Raw transcript chunks are weakly diarized and frequently tagged `[Others]` rather
   than by name** (`littlebird-mcp-reference.md`, known limitations). The transcript proves
   a line was said. It does not prove who said it.
3. **Transcript accuracy is uneven across speakers.** Counsel warns that systematically
   less accurate transcripts for some speakers create real exposure when relied upon for
   consequential decisions (`research/distilled-content-mining-and-repurposing.md`,
   section 7). Publishing is a consequential decision.

Add the repo's founding rule: captured content shows what the user was VIEWING, not
necessarily what they WROTE (`evidence-standards.md`, rule 4). For screen capture the
same logic applies to speech: capture proves presence, not authorship.

**Attribution is guilty until proven innocent.** When in doubt, it goes to the confirm
bucket. It never goes into a draft.

---

## The surface ladder

Rank every candidate by which surface it came from. This is the whole screen in one table.

| Tier | Surface | Speaker confidence | What you may do with it |
|---|---|---|---|
| 1 | The meeting summary's `## For You` section | **High** | Draft it, subject to user confirmation at the gate. |
| 2 | `## Decisions` or `## Action Items` tagged with the user's name as owner or decider | **High** | Draft it. Owner tagging is explicit in these blocks. |
| 3 | A transcript passage where the surrounding turns make the user unmistakably the speaker (they are answering a question addressed to them by name, or continuing a turn attributed to them) | **Medium** | Draft it, and flag the seed as Medium at the confirmation gate. |
| 4 | A transcript passage in a one-on-one meeting where the other speaker is identified and this turn is clearly not theirs | **Medium** | Same as tier 3. Only valid when the meeting has exactly two participants. |
| 5 | A transcript chunk tagged `[Others]`, or any passage in a meeting with three or more participants where the speaker is not independently established | **Low** | **Confirm bucket. Never drafted.** |
| 6 | `search_user_context` snapshot content: text visible on screen | **Low** | Confirm bucket unless it is in a compose surface. See below. |

**Tier 1 is the default hunting ground.** The `## For You` section is the highest
attribution surface in the whole MCP surface and it is chronically underused
(`littlebird-mcp-reference.md`). Start every mining pass there and work down the ladder
only when a type is coming back thin.

---

## The messages sweep and its guardrail

`search_user_context` with `filters.data_source: messages` finds the user's own WRITTEN
lines, which are often already in near-publishable shape. That makes it valuable and
makes the attribution risk worse, because a message thread is full of other people's text.

Rules, from `evidence-standards.md` rule 4:

- A message tagged `(From:[user])` is theirs. **Everything else in the thread is not.**
- Text in a compose box is probably theirs. Text in a feed is probably not.
- Anything a bot, an assistant, or a template produced on the user's behalf is not the
  user's words, even when it went out under their name.
- Collection time and send time are different values. Both go in the receipt.

Queries for this sweep, run narrow and in parallel:

- "message where I explained how something works to someone"
- "message where I disagreed with something and said why"
- "message where I told someone about a client situation"
- "message where I answered a question about pricing or process"

Everything that comes back and is not clearly `(From:[user])` goes to the confirm bucket.
No exceptions and no reasoning from tone. A user's own writing style is not proof of
authorship, especially in a thread with a close collaborator.

---

## The confirm bucket

A named, visible section of the output artifact titled **"Confirm this was you"**. It is
not a footnote and it is not silently dropped material.

Every entry carries:

- The verbatim line
- The receipt (meeting name, date, section, per `evidence-standards.md` rule 1)
- Which tier it came from and why the tier is Low
- What the seed would become if confirmed, in one line
- The other people who were in the meeting, so the user can reason about who else might
  have said it

The user resolves these with a yes or a no. **A yes promotes the seed to High and it can
be drafted next run. A no deletes the seed permanently and it is recorded in the
de-duplication list so it is never re-surfaced.** Silence leaves it in the bucket.

Do not draft a confirm-bucket item speculatively "so it is ready if they confirm". A draft
is a thing that can be copied and posted. Producing one for material of unknown authorship
defeats the entire screen.

---

## The confirmation gate for everything else

Even a tier 1 seed gets user confirmation before it becomes a published draft
(`evidence-standards.md`, rule 6: confirm before you encode, confirm before you send).

Use `AskUserQuestion`. Batch the seeds. For each, present:

1. The verbatim, exactly as captured, disfluency intact.
2. The receipt.
3. The tier and the speaker confidence.
4. The drafted piece.

The user approves the TEXT, not a plan and not a summary. Approval attaches to the words
that would be published.

**Where a seed rests on Medium confidence, say so at the point of approval.** A Low-rated
claim never drives an irreversible action (`evidence-standards.md`, rule 3), and posting
is irreversible.

---

## Failure modes worth naming explicitly

| Failure | How it happens | Guard |
|---|---|---|
| The guest's line | A sharp guest or client says the memorable thing. The user says "yes, exactly". The transcript shows both near each other. | The agreement is not authorship. Tier 5 unless the summary attributes it. |
| The read-aloud | The user reads a statistic off a shared slide or an article. | Tier 5. Check for surrounding screen-share context in the meeting summary. |
| The quoted third party | The user relays what someone else told them: "our CFO always says". | The line belongs to the CFO. If it ships at all, it ships attributed to them and only with their permission. |
| The collaborator drift | In a long partnership, both people use the same phrases. Style is not proof. | Tier 5 in any meeting with three or more people, and Medium at best in a two-person meeting. |
| The composite | Merging two similar lines from two calls into one cleaner quote. | Never. One seed, one verbatim, one receipt. A composite has no receipt and is a fabrication. |
| The AI summary line | A phrasing that came from the meeting summary's own generated prose rather than from something a human said. | The verbatim field must trace to transcript or to a quoted line in the summary. Summary narration is not a quote. |

The composite one deserves emphasis. It is the most tempting failure because the merged
version is genuinely better writing. It is also the one that cannot be defended if
challenged, because there is no single moment it points back to.

---

## Empty result

If the attribution screen empties the bank, that is a real finding, not a failure. Report
it: the window contained material but none of it could be attributed to the user with
enough confidence to publish. Name how many candidates went to the confirm bucket and
from which meetings. Then stop (`evidence-standards.md`, rule 9).
