# Recipient-aware recaps

How to get from an internal meeting summary to a message the user can actually send, to the
right people, without shipping something they will regret.

The order is fixed and each step gates the next: audience, then filter, then split, then
voice, then draft, then approve.

## Why the outbound artifact is a separate document

The default behavior of the whole notetaker category is to push the internal artifact
outward. Summaries and transcripts are "circulated to attendees by the AI note-taking app,"
which can share material with every participant
(`research/distilled-meeting-followup.md`, section 4). Zoom AI Companion ships a host-set
option to auto-share the generated summary with "All meeting invitees, including external
participants," and the documentation describes changing who receives it while describing no
step for reviewing or editing what it says before delivery
(`research/distilled-meeting-followup.md`, section 4).

That is the default, and the default is the defect. The Littlebird summary contains the
user's private `## For You` section and whatever internal observation the model made
(`littlebird-mcp-reference.md`). Forwarding it is a mistake with no undo.

So: the outbound message is composed for a named audience. It is never the internal summary
with sections deleted, because deleting sections from a document written for someone else
leaves the tone and the framing of the original, and the framing is half the problem.

## Step 1: establish the audience

From `LB_INTERNAL_GET_MEETING`, take the linked calendar event and its attendee list
(`littlebird-mcp-reference.md`). That list is the only verified source of who was in the
room.

For each attendee, record name, email domain, and whether the domain matches the user's.
Domain is the cheapest reliable signal of which side someone is on.

Then classify the meeting:

| Shape | Test | Consequence |
|---|---|---|
| Internal only | every attendee shares the user's domain | One recap. No external filter needed, but the private `## For You` content still comes out. |
| Single external party | two domains | One recap to the external party, optionally one internal note. Filter runs. |
| Multi-party | three or more domains, or a known partner plus a known client | Recipient-aware split. See step 3. |

If there is no linked calendar event there is no attendee list, and recipient-aware drafting
cannot proceed. That case is handled in `beyond-the-builtin-summary.md`. Do not infer
attendees from the transcript.

## Step 2: the confidentiality filter, run before drafting

**Run this before writing a word.** Filtering a finished draft means the excluded material
has already shaped the sentences around it.

Take every candidate line and strip it if it matches any category below.

### The strip list

| Category | What it looks like | Why |
|---|---|---|
| **Third-party commentary** | Anything said about a person or company not receiving this message. Assessments of a competitor, a mutual contact, another vendor, another client. | The recipient has no need for it and the subject did not consent to being characterized to them. |
| **Pricing the recipient should not see** | Internal margin, floor price, what another customer pays, discount authority, cost basis. | Obvious commercial harm, and irreversible. |
| **Side conversation** | Anything said before the main discussion started, after it ended, or in a breakout with a subset of attendees. | Participants speak differently when they believe the meeting is over. |
| **The private For You block** | The `## For You` section verbatim. | It is the summary's statement of the user's own obligations, written to the user. |
| **Internal observations** | The summarizer's characterizations of tone, engagement, or intent. "The client seemed hesitant." | This is the model's read on a person, being sent to that person. |
| **Internal-only risks** | Entries in `## Risks / Open Questions` that describe risk to the user's side. | An internal risk register is not a recap. |
| **Unverified attributions** | Any commitment whose owner tag is `Unassigned`, and any claim whose evidence is a raw transcript chunk. | See the attribution rule below. |
| **Low-confidence anything** | Any claim rated Low under `evidence-standards.md`, rule 3. | A Low claim never drives an irreversible action, and sending is irreversible. |

**These categories are judgment, and the skill says so.** No source in the research archive
supplies a rule for what to strip from a client-facing recap; the client-recap source is
silent on exclusions and the legal sources address vendor access and consent rather than
message composition (`research/distilled-meeting-followup.md`, sections 1, 4 and 7). The
categories are reasoned from the risk pattern the archive establishes. Present them to the
user as the filter that was applied, not as industry practice.

### Report the filter, do not hide it

After filtering, tell the user what came out and why, one line per stripped item with its
category. Two reasons. The user is the only person who knows whether a stripped line was
actually fine to send. And a filter that runs invisibly is a filter nobody can correct.

### The attribution rule, in its expensive form

Everything the recap says about who owns what comes from the summary's `## Action Items`
and `## Decisions` blocks. Never from a raw transcript chunk, which is weakly diarized and
frequently tagged `[Others]` (`littlebird-mcp-reference.md`).

Attributing a commitment to the wrong person in a message sent to four people tells a named
person, in writing, that they promised something they did not promise. The user cannot
recall it and the recipient will remember it. Be strict:

- Owner tag present: use it, exactly as tagged.
- Owner tag `Unassigned`: the item appears as an open item with no name attached, phrased
  as "still needs an owner." It never gets assigned to a guess.
- Summary and transcript disagree: it does not go in the outbound draft at all. Report the
  conflict to the user and let them decide (`evidence-standards.md`, rule 10).

## Step 3: the recipient-aware split

Where the meeting had multiple parties with different interests, one recap serves nobody.
The partner call where one recap goes to the partner and another to the internal team is the
standard case.

Produce one draft per audience. For each:

1. Name the audience explicitly at the top of the draft, listing the recipients.
2. Run the filter again with THAT audience as the recipient. A line that is fine for the
   internal team is often a strip for the partner, and the reverse happens too.
3. Include only decisions and commitments that audience is party to or affected by.
4. Never mention the existence of the other draft in either draft.

Present the drafts side by side to the user, with the recipient list on each, so they can
see at a glance that nothing crossed over. Crossing is the failure mode, and it is caught by
looking, not by trusting.

**Honesty requirement.** Nothing in the research archive documents the practice of producing
different recaps for different parties from one meeting. The only documented splitting is by
owner within a single shared document, subsections so each person sees their own actionables
(`research/distilled-meeting-followup.md`, sections 1 and 5). The recipient-aware split is
this skill's design choice, and the skill presents it as one.

Offer the per-owner split inside a single document as the alternative, because that one IS
documented practice.

## Step 4: voice

The recap goes out under the user's name, so it should read like the user.

1. **Check what is installed.** List the skills available in this session and look for a
   personal voice skill for this user.
2. **If one is present, draft through it.** The recap prose runs through the voice skill.
   The decisions block and the action list stay structured, because a bulleted action list
   does not have a voice and forcing one on it makes it harder to read.
3. **If none is present, say so plainly.** Tell the user: "No personal voice skill is
   installed in this session, so this draft is written in a neutral professional register
   rather than in your voice. The littlebird-skills marketplace includes voice creator
   skills that build one from your own writing."
4. **Never invent a voice profile.** Do not imitate a style guessed from transcript
   fragments. Screen and transcript capture shows what the user was viewing and saying in
   conversation, which is not the same as how they write
   (`evidence-standards.md`, rule 4). A fabricated voice reads as the user and is not, which
   is worse than a neutral one.

## Step 5: draft

Content, from two converging practitioner sources
(`research/distilled-meeting-followup.md`, section 1):

1. Reference something specifically said or decided, not just the meeting topic.
2. Decisions reached.
3. Action items, each with a named owner and a deadline.
4. Anything the user promised to send.
5. Exactly one ask. Multiple asks create friction.

Shape:

- **Prose under 150 words.** The action item block does not count against it.
- Short paragraphs, two to three sentences.
- Bullets for action items.
- A specific subject line naming the substance, not "Following up from our call."
- Plain language. Emails at a third grade reading level had 36 percent higher open rates
  than college-level ones and 17 percent higher response rates than high-school-level ones
  (`research/distilled-meeting-followup.md`, section 1).

**The numbers are soft and the skill treats them as soft.** The under-150-words figure is an
uncited vendor claim. The corroborating 50 to 125 word band comes from a 2016 analysis of 40
million emails that were probably sales outreach, a different genre from a recap sent to
someone who just spent half an hour on a call with the sender
(`research/distilled-meeting-followup.md`, section 1). The two roughly agree, neither
measured meeting recaps, and neither number is quoted to the user as fact.

Timing: within 24 hours, immediately where possible. The two sources agree, and the
defensible reason is the plain one: "The longer you wait, the less relevant it becomes"
(`research/distilled-meeting-followup.md`, section 1).

What to leave out beyond the filter: generic openings, vague next steps such as "let me know
if you have any questions," unfilled placeholders, and anything unrelated to what was
actually discussed (`research/distilled-meeting-followup.md`, section 1).

**Do not tell the user that sending a recap improves follow-through.** No study in the
archive tests it. The sweep for one returned cold-outreach content marketing
(`research/distilled-meeting-followup.md`, sections 1 and 7). The recap is worth sending for
the reasons in `beyond-the-builtin-summary.md`, not because of a statistic.

## Step 6: approval, which is the hard gate

**The follow-up is a draft. Always.** Per the draft-never-send law, nothing reaches
attendees without the user approving the actual final text. Not a summary of the text, not
the plan to send it. The words.

This holds even where an email connector is present in the session. Approving a plan is not
approving the words.

### Tool discovery before assuming delivery

Before mentioning any send path, list the tools actually available in this session. Do not
assume Gmail, Outlook, Resend, or any other connector exists because it existed somewhere
else. Connectors are separate MCP servers that may or may not be connected.

| Situation | Behavior |
|---|---|
| An email connector IS present | Present the full final text. Get explicit approval through `AskUserQuestion`. Only then send, and only exactly what was approved. |
| No email connector is present | Say so. Produce the draft as a copy-paste block with the recipient list and the subject line, ready to paste into the user's own client. |

The degraded path is not a failure. It is the normal path.

### The approval prompt

Present, in this order:

1. The recipient list, by name and address.
2. The subject line.
3. The full body, verbatim, exactly as it would go out.
4. The filter report: what was stripped and under which category.
5. Any verbatim transcript quote included, flagged separately, because including one makes
   the recording explicit to every reader
   (`research/distilled-meeting-followup.md`, section 6).

Then `AskUserQuestion` with four options: send as written, edit first, hold, or do not send.

### Why the human review is not optional

A professional regulator states the rule directly: an AI summary of a client meeting "should
not be relied upon until the participating lawyer has reviewed and verified it"
(`research/distilled-meeting-followup.md`, section 4). The same logic covers sending one,
and more so, because the recipient cannot verify it either.

The failure mode being guarded against is specific. Generated summaries "fill in the blank"
with an incorrect guess rather than marking a passage inaudible, and they fabricate outright
(`research/distilled-meeting-followup.md`, section 4). Both failures read as fluent,
confident prose. The user is the only reader who was in the room and can catch them.
