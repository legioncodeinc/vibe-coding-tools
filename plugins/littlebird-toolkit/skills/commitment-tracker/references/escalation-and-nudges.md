# Escalation and nudges

What to do with the owed-to-me column once it has ages on it.

Two rules govern everything in this file:

1. **Nudges are drafted, never sent.** Nothing generated from capture reaches another
   human without the user approving the actual text, not a summary of it
   (`evidence-standards.md`, rule 6).
2. **Escalation changes the channel and the framing. It does not increase the frequency.**
   Frequency is the one variable with no evidence behind it
   (`research/distilled-commitment-tracking.md`, section 7).

---

## The failure this exists to prevent

A production observation from the account this skill was validated against: a general
daily routine flagged the same blocked contact for **16 consecutive days** without ever
changing its approach, because its prompt contained no memory instruction and no
escalation rule.

The follow-up literature names the same failure in one line: "Avoid sending the exact same
email again" (`research/distilled-commitment-tracking.md`, section 6). A fifth
identical bullet is not persistence. It is noise the reader has already learned to skip.

Every escalation tier below therefore differs from the one before it in **channel**,
**framing**, or **ask**. Repetition alone is never an escalation.

## Is nudging safe

The only peer-reviewed evidence located points in the reassuring direction. Across 235
participants in global virtual teams, digital reminder nudges were associated with higher
psychological safety, not lower
(`research/distilled-commitment-tracking.md`, section 7).

Read the caveat with it. The authors state that the causal mechanism behind the reminder
effect is unknown, and no source in the archive answers how often is too often
(`research/distilled-commitment-tracking.md`, section 7, named gap). That
unknown is exactly why the human stays in the loop and why escalation moves sideways
rather than upward in volume.

## The escalation ladder

| Tier | Age | Channel | Framing | Ask |
|---|---|---|---|---|
| 0 | 0 to 7 days | none | none | Ledger entry only. Do not draft anything. |
| 1 | 8 to 14 days | same channel the commitment was made in, or email | Assume good faith and no answer needed. Offer a way out. | One item. One sentence of context. |
| 2 | 15 to 30 days | different channel from tier 1, or the next scheduled meeting with that person | Name the dependency, not the delay. Say what it is blocking on the user's side. | Ask for a date, not for the deliverable. |
| 3 | over 30 days | live, meaning a call or a meeting agenda item, not a written ping | Renegotiate rather than remind. The commitment may no longer be real. | Confirm, re-scope, or close it out. |

Tier 0 exists on purpose. Below roughly 3 to 5 business days a first follow-up is early by
the observed cadence guidance (`research/distilled-commitment-tracking.md`,
section 6), and a ledger that prompts a nudge on day two trains the user to ignore it.

### Why the ladder does not end in "stop"

The cadence source prescribes a maximum of two or three follow-ups and then stopping
(`research/distilled-commitment-tracking.md`, section 6). That rule comes from
cold prospecting, where dropping the lead is a valid outcome. It does not transfer here. A
partner who owes a deliverable cannot be dropped, so tier 3 replaces stopping with
renegotiation: confirm it is still happening, re-scope it, or agree out loud to close it.

An item closed by explicit agreement is a genuinely good outcome and the ledger should
record it as `closed by agreement` with the date, not as a failure.

## Drafting a nudge

Every drafted nudge satisfies all six of these. They come straight from the
relationship-preserving guidance (`research/distilled-commitment-tracking.md`,
section 6).

1. **One item.** Name the single commitment. Never bundle the aging bucket into one
   message. "Make a clear ask, so the recipient knows exactly what you want."
2. **Brief and scannable.** Three sentences is generous. Most are read on a phone.
3. **A clear ask.** Say what would resolve it: the file, a date, a yes or no.
4. **An out.** "Give the recipient an out. It will demonstrate humility and ease any
   potential discomfort." A nudge with no graceful exit reads as a demand.
5. **Friendly tone.** Assertive is fine at tier 2 and 3. Aggressive is never fine.
6. **No accusation.** The user does not know the thing was not done. The ledger says there
   is no evidence it was done, which is a different claim
   (`completion-verification.md`).

### Ground it in the record, carefully

Quote the commitment from the meeting summary and cite the meeting and date. That is what
makes a nudge feel like a shared record rather than a personal complaint.

- Quote the wording from the summary's `## Action Items` block, which carries the owner
  tag.
- Never open a nudge by telling someone what they said in a transcript. Diarization runs
  at 11 to 13 percent error and a misattributed quote in an outbound message is an
  unrecoverable mistake (`research/distilled-commitment-tracking.md`,
  section 4).
- Where the owner tag is `Unassigned`, do not nudge anyone. Ask the user who owns it
  first.

### Voice

If a personal voice skill is installed in this environment, draft the nudge in the user's
voice using that skill. Check for one before drafting: list the available skills and look
for a voice or writing-style skill built for this user. Do not assume one exists and do
not fabricate a house style.

If no voice skill is available, draft in plain, unadorned professional English and say in
the handoff that no voice profile was applied, so the user knows to adjust the wording.

### Draft skeletons

Tier 1, same channel, low pressure:

```
Subject: <deliverable>, no rush

Hi <name>, following up on <deliverable> from our <meeting name> on <date>. Any
sense of timing, or has something else taken priority? Happy either way, just want
to know whether to keep a slot for it.
```

Tier 2, different channel, dependency named:

```
Subject: <deliverable> and the <thing it blocks>

Hi <name>, circling back on <deliverable> from <date>. I am holding <specific thing
on the user's side> until it lands, so a rough date would help more than the file
itself right now. If it has moved down the list, tell me and I will plan around it.
```

Tier 3, live conversation, agenda item rather than message:

```
Agenda item for <next meeting with name>: <deliverable>, committed <date>,
<N> days open, no evidence of delivery, restated <N> times.
Goal of the conversation: confirm it is still happening, re-scope it, or close it out.
```

Note what tier 3 is. It is not a message. It is a line the user carries into a
conversation. A commitment that has survived two written nudges has stopped being a
reminder problem.

## The approval gate

Before any drafted text reaches another person, present the user with:

- The item, its age, its restatement count, and its status
- The evidence sweep that produced the status, including the queries run
- The full draft text, verbatim
- The tier and why that tier

Then use `AskUserQuestion` to offer: send as written, edit first, hold, or close the item
without contacting anyone.

Nothing sends without an explicit yes on the actual text
(`evidence-standards.md`, rule 6). The skill itself does not send. It hands the
approved text back for the user or another tool to deliver.

## Escalation for the owed-by-me column

The owed-by-me column does not get nudges. It gets a different treatment, and the same
anti-repetition rule.

| Age | Treatment |
|---|---|
| 0 to 7 days | List it. |
| 8 to 14 days | List it and name the next physical action, in the GTD sense: the concrete thing that starts it (`research/distilled-commitment-tracking.md`, section 3). |
| 15 days and older | Force a three-way choice: do it, renegotiate the date with the person who is owed, or drop it and tell them. |

That third row is the point. An item the user has carried for a month is not waiting for a
reminder, it is waiting for a decision. Present it as a decision. Bare goal intentions
explain roughly 28 percent of variance in behavior, while binding an intention to a
specific cue and a specific response is the thing with the evidence behind it
(`research/distilled-commitment-tracking.md`, section 2). Restating the
commitment a fourth time supplies no new cue. Naming the next action does.

## What never gets nudged

- Anything with a `Low` confidence status in either direction.
- Anything tagged `Unassigned`, until the user assigns it.
- Anything where the only evidence of the commitment is a raw transcript chunk rather than
  a summary Action Items entry.
- Anything involving a third party who appeared incidentally in the capture and is not
  material to the stated purpose (`evidence-standards.md`, rule 10).
- Anything the user has already marked as held or closed in a previous run.
