# First-touch drafting

How to write the messages, and the rules about what happens to them afterwards.

## The hard boundary

**This skill drafts. It does not send. It never automates a platform action.**

Say that to the user in the deliverable, in those words. It is not a disclaimer, it is the
design. The evidence:

- X: "You may not send unsolicited Direct Messages in a bulk or automated manner", and
  unsolicited automated replies "based solely on keyword searches" are prohibited by name
  [research/raw/leadharvest--platform-rules--x-automation-rules-2026.md].
- LinkedIn User Agreement 8.2 prohibits "using bots or other automated methods to access
  the service, add or download contacts, or send and redirect messages"
  [research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md].
- LinkedIn now scores behavior rather than volume, so "accounts can be flagged even while
  operating inside the numeric caps"
  [research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md]. Pacing a
  bot politely does not protect the account.
- Instagram suspensions can arrive with no warning, from a mix of genuine automation abuse
  and context-blind moderation false positives
  [research/raw/leadharvest--platform-rules--instagram-dm-ban-wave-sumgenius-2026.md].

A human sending individually, from their own session, at human timing, is on the right
side of every rule in the archive. That is the workflow this skill produces. If the user
asks the skill to send, decline and explain the account risk. See
`references/platform-rules.md` for the full steering language.

## What the message data actually says

One source in the archive carries message-level performance data, across 70,130 campaigns
[research/raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md]. It
is a vendor with an interest, and it is a vendor named elsewhere in the archive as a
compliance risk
[research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md]. Treat the
relative ordering as more reliable than the absolute percentages.

| Finding | Number | Design consequence |
|---|---|---|
| Short and casual is the best-performing style | 16.86% reply rate | Write short. Write like a person. |
| Template-based campaigns are the worst named category | 8.62% reply rate | Roughly half. Never ship a pure template. |
| Warm inbound beats general outreach | 13.4% versus 10.3% overall | A hand-raiser is warmer than either. Lead with the warmth. |
| First follow-up performs slightly WORSE than the opener | minus 0.6% | The bump is not where people think. |
| Second follow-up produces more responses | plus 4.05% | This is the one that pays. |
| Third and beyond | roughly 1%, diminishing | Stop at two. |

All figures from
[research/raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md].

## The message shape

Four parts, in this order, short:

1. **The specific receipt.** Name the exact thing they did, with enough detail that it
   could not have been sent to anyone else. "You commented SYSTEM on my Tuesday post" beats
   "Thanks for engaging". This is the single highest-leverage sentence and it is the one
   the roster's `verbatim` field exists to supply.
2. **The thing they asked for.** Deliver it, or say precisely when it lands. They raised a
   hand to receive something. Not delivering it in the first message is the most common
   own goal in this category.
3. **One question, or none.** A single easy question invites a reply. Two questions read
   as a form. Zero questions is correct for the Light and Ambient segments.
4. **No pitch.** The first touch is delivery and acknowledgement. The offer belongs in the
   conversation that follows, once BANT-style facts are actually available
   [research/raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md].

Length target: under 60 words for Hot and Warm, under 35 for Light. Nothing about the
research supports longer.

## Drafting per segment

### Hot (score 12 and up, multi-signal, usually includes a DM)

Individually written. No template. Reference every signal by name, because referencing
three separate actions is proof of attention that no template can fake.

For the person who DM'd and got no answer, and this is the exact pain the skill was built
for, lead with the acknowledgement of the delay. Do not explain, do not make excuses, do
not blame the platform. One clause, then deliver.

Draft one message per person. Show the receipts beside each draft so the user can check
the claim before sending.

### Warm (6 to 11)

Segment template plus one mandatory personalization slot filled from that person's own
`verbatim` or signal list. The slot is required, not optional. A draft that reaches the
user with an unfilled slot is a bug, and the correct behavior is to flag the row as
needing manual input rather than shipping a generic line.

### Light (3 to 5)

Batch-drafted from one template. Still carries the specific post reference and the
delivery. Short.

### Ambient (1 to 2, reaction or follow only)

**Default to not drafting an individual DM.** A reaction is the weakest signal on the
board, and unsolicited DM to someone who only reacted is where the outreach most resembles
what X and Meta call unsolicited bulk contact
[research/raw/leadharvest--platform-rules--x-automation-rules-2026.md]
[research/raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md].

Offer the user two better options instead:

- A public comment on the post thanking everyone, with the link, which reaches the whole
  ambient segment at once and costs nothing.
- Nothing at all.

If the user explicitly asks for Ambient drafts, write them, keep them to one line with no
question, and note the risk in the deliverable.

### Carry-forward (prior campaign, never replied to)

Different message, different tone. These people were ignored, and pretending otherwise
reads badly. Acknowledge it in a clause, deliver what was originally promised, and give
them an obvious exit. This segment carries the highest goodwill upside and the highest
annoyance risk, and it is the one the user should personally read every line of before
sending.

## Follow-up sequencing

The published shape is specific and counterintuitive
[research/raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md]:

| Touch | When | Note |
|---|---|---|
| First touch | as soon as the roster exists | The opener. |
| Follow-up 1 | 2 to 3 days later | Performs marginally worse than the opener. Keep it very short. |
| Follow-up 2 | 5 to 7 days after the opener | This is where the lift concentrates, at plus 4.05%. |
| Follow-up 3 and beyond | do not draft | Roughly 1% and diminishing. |

Draft at most the opener plus two follow-ups. Where the campaign runs on Meta, note that
the human agent tag window is 7 days
[research/raw/leadharvest--platform-rules--meta-messenger-policy-2026.md], so follow-up 2
should land inside it.

## Voice

If a personal voice skill is installed in this workspace, use it. This marketplace builds
them, so check first: list the available skills, look for a voice skill scoped to this
user, and if one is present, draft through it so the messages sound like the operator
rather than like an assistant.

If no voice skill is present, do not simulate one from the capture. Screen capture shows
what the user was VIEWING, not what they WROTE
(`references/evidence-standards.md`, rule 4), so building a voice model from a feed is
exactly the mistake the attribution guardrail exists to prevent. Instead, write plainly and
tell the user in the deliverable that the drafts are in a neutral voice and why, and offer
to install or run a voice skill.

Where a message thread contains messages tagged as being from the user, those ARE the
user's words (`references/evidence-standards.md`, rule 4) and are legitimate input for
matching phrasing. Use them lightly and say you did.

## The approval gate

Nothing generated from capture goes to another human without explicit approval of the
ACTUAL TEXT, not a summary of it (`references/evidence-standards.md`, rule 6).

Concretely:

1. Write every draft into the deliverable file.
2. Present the Hot segment drafts in full, in the session, using `AskUserQuestion` to get
   approval, revision, or a skip per batch.
3. Never mark a draft as approved on the basis of the user approving the plan, the
   roster, or the segment. Approval attaches to text.
4. Where a draft rests on a Low-confidence row, say so at the point of approval. A
   Low-rated claim never drives an irreversible action, and sending a message to a
   misidentified person is irreversible
   (`references/evidence-standards.md`, rule 3).

## If the outreach moves to email

The channel change changes the law. Platform DM rules are contractual, enforced by the
platform through account restriction. Email is statutory: CAN-SPAM requires accurate
header information, non-deceptive subject lines, identification of the message as an ad, a
physical address, a working opt-out, and prompt honoring of opt-outs, at up to $53,088 per
violating message, counted per message rather than per campaign
[research/raw/leadharvest--legal--ftc-can-spam-compliance-guide.md].

Also, and operators get this wrong constantly: a person who commented a keyword has not
given an email address and has not consented to email
[research/raw/leadharvest--legal--ftc-can-spam-compliance-guide.md]. Consent does not
travel across channels. Collect the address and the permission separately.

The line between the two regimes is not perfectly clean either. In Facebook, Inc. v.
MAXBOUNTY, Inc. (N.D. Cal., 2011) a court held that commercial messages delivered through
a social platform can fall under CAN-SPAM, reading "electronic mail address" broadly. That
is a district court decision on a motion to dismiss, not appellate law
[research/raw/leadharvest--legal--dmlp-facebook-v-maxbounty.md]. Do not tell a user that
social DMs are categorically outside CAN-SPAM.
