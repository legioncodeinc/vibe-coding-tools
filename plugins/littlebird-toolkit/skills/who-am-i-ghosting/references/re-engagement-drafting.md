# Drafting the re-engagement line

Every surfaced item ships with a drafted message. Nothing is sent. The draft exists so the user can act in one keystroke instead of composing under guilt, and composing under guilt is what produces the apology-first message this page argues against.

## The draft-never-send law

Drafts are held. Nothing is sent, posted, or written into any third-party system without the user approving the actual final text through `AskUserQuestion`. Approving the plan is not approving the words. This holds even when a mail connector is present in the session and even when the user said "yes, send them all" before seeing the text.

The skill hands approved text back. It does not send.

## Voice

Check whether a personal voice skill is installed in this session. If one is, draft through it. If none is, say so plainly in the output and point at this marketplace's voice creator skills. Never imitate a voice from nothing and never invent a voice profile (`authoring-contract.md`, voice skill composition).

Absent a voice skill, draft in plain professional register: short sentences, no throat-clearing, contractions allowed, no exclamation marks, no "just wanted to", no "I hope this finds you well".

## The apology question

**Do not open with an apology for the delay.** This is a default with a stated basis, not a proven optimum, and the skill states it that way.

What the archive actually supports:

- Edited practitioner guidance says do not apologize extensively. Acknowledge the lapse briefly and early in the body, then move to substance, and normalize the silence rather than express regret about it. It names both extremes as errors: apologizing at length, and failing to acknowledge the gap at all (`research/distilled-responsiveness-and-reengagement.md`, section 8).
- Receivers systematically overestimate how quickly senders expected a response to non-urgent mail, across eight pre-registered studies with 4,004 participants (`research/distilled-responsiveness-and-reengagement.md`, section 6). The delay being apologized for may not have been experienced as a delay. An elaborate apology then introduces a problem the recipient did not have and asks them to absolve it.
- Executives were reluctant before reconnecting after long silences and overwhelmingly positive afterward, and reported the reconnection feeling "as if we had been talking regularly for the past seven years" (`research/distilled-responsiveness-and-reengagement.md`, section 7). The dread is miscalibrated in a measurable direction, and an apology-heavy opener performs the dread.

**The named gap, stated honestly.** No located study tests whether apologizing for a delay increases or decreases the chance of a reply between two individuals. The nearest research is about organizations apologizing to consumers after service failures and does not transfer cleanly in either direction (`research/distilled-responsiveness-and-reengagement.md`, section 9). Do not tell the user this rule is proven. Tell them it is the house default and why.

### The ban list

Never open a draft with any of these:

- "Sorry for the delay"
- "Apologies for the slow reply"
- "Sorry this took so long"
- "I dropped the ball"
- "This completely slipped through the cracks"
- "I've been meaning to reply"
- "Apologies for the radio silence"
- "So sorry, things have been crazy"

### The one permitted apology

Where the delay caused the other person a **concrete, nameable cost**, apologize for the cost, in one clause, and then move on. Not for the silence, for the consequence.

```
That answer was needed before your Thursday deadline and I did not get it to
you. Here it is now, and here is what I would do about Thursday.
```

The test: can the cost be named as a specific thing that happened to them. If it can, one clause. If it cannot, no apology.

## The three-part shape

Every draft, in this order.

**1. Anchor.** Name the last thing they said, close to their words, with a date. This does the work an apology pretends to do: it proves the user read it, remembers it, and is not starting over. It is also the cheapest possible signal of respect for their time.

```
You asked on 27 July whether the migration piece is in or out of the Q4 scope.
```

**2. Substance.** The answer, or the honest current state of the answer. This is the payload and it comes before anything else the user wants.

If the user cannot answer yet, say what is true and give a date. "I do not have this yet" plus a date beats another week of silence, and it converts the item from a lapse into a scheduled forward that `natural-close-detection.md` will handle correctly next run.

**3. One question, with an exit.** Exactly one specific answerable question, plus an explicit out.

An explicit information request was the single largest positive predictor of a reply in the measured model, at plus 22 percent (`research/distilled-responsiveness-and-reengagement.md`, section 3). One question, not three. Three questions is a form, and a form is a cost.

The exit comes from the practitioner guidance: give them a way out and reduce the cost of replying, "I completely understand if this isn't a good time" and "let me know how I can make it easier for you" (`research/distilled-responsiveness-and-reengagement.md`, section 8).

## Length

Median reply length is 43 words. The most likely reply length is 5 words. Only 30 percent of emails run past 100 words (`research/distilled-responsiveness-and-reengagement.md`, section 2).

| Form | Cap |
|---|---|
| Chat or DM reply | 40 words |
| In-thread email reply | 80 words |
| Fresh reconnection email | 120 words including the subject line |

A long message asks the recipient to spend more, which is the opposite of the practitioner guidance to reduce the cost of replying. If a draft cannot fit, the ask is too big for a message and the correct recommendation is a call.

## One to one, always

Never draft a re-engagement into a group thread. More recipients cut reply probability by 18 percent and rated importance by 10 percent (`research/distilled-responsiveness-and-reengagement.md`, section 3). If the item came from a group thread where the user was named, the draft goes to that person directly.

## Form by staleness band

The band from `importance-ranking.md` picks the form.

### Live, 4 to 21 days: reply in thread

No gap acknowledgment. At this range the gap is not remarkable enough to be worth words, and mentioning it makes it a topic.

```
Priya, on the Q4 scope: migration is in, and I would keep it in phase one
rather than splitting it out.

The one thing I need from you to confirm that is whether the December freeze
still applies to the data layer. If it does, this changes. Anything to hand
this week is plenty.
```

### Cooling, 22 to 45 days: reply in thread, one line on the gap

One clause, no self-flagellation, no explanation of how busy the user has been. The recipient does not want a status report on the user's month.

```
Marcus, coming back to this later than I meant to.

On the contractor intro: I can put you in front of Dana Reyes, who did the
rebrand for Fieldnote. She takes on outside work in Q4.

Want me to make the introduction, or would you rather I send you her details
and leave it with you? No rush either way if the project has moved on.
```

### Cold, 46 to 90 days: fresh email, new subject

Do not resurrect the old thread. Reference it, start a new one. A reply arriving under a three month old subject line reads as an accident.

Subject line: "Reconnecting" for a formal relationship, or a plain statement of the new purpose. The practitioner source also offers "Blast from the past" for informal relationships and claims a response rate over 90 percent for the approach, with no study behind that figure, so use the subject-line advice and do not quote the number (`research/distilled-responsiveness-and-reengagement.md`, section 8).

### Dormant, 91 and over: reconnection, not reply

Different message entirely. This is the case with the strongest evidence behind it and the drafting should reflect that confidence rather than apologizing its way in.

Trust and shared perspective survive dormancy: dormant strong ties scored 5.47 on trust against 5.86 for current strong ties and far above weak ties at 4.17, and 5.51 on shared perspective, "just about as much as current strong ties" (`research/distilled-responsiveness-and-reengagement.md`, section 7). The draft should not perform a relationship rebuild that is not needed.

Reconnected dormant ties also delivered more novelty than current ties, 5.72 against 5.07, at significantly lower time cost, and were rated highest of the four cells on usefulness of knowledge received at 5.70 (same section). Reaching out is a good bet, and the user can be told so.

Structure for this form:

1. Name the shared history in one specific line. Not "we worked together", but the actual thing.
2. One line on what the user is doing now. This is the update the practitioner guidance says to give in place of the apology (`research/distilled-responsiveness-and-reengagement.md`, section 8).
3. The purpose, stated plainly. Relevance to a live purpose is what separated useful reconnections from pleasant ones in the study, and the documented dark-side case was a reconnection that felt good and was "ultimately unhelpful" because the benefit was personal rather than relevant to the work (same section).
4. Reciprocity. What the user could do for them. The practitioner guidance says research this before asking.
5. The exit.

```
Subject: Reconnecting

Jen, it has been a while since the Halberd migration. I still quote your line
about not shipping on a Friday.

I am running the platform team at Corran now, and we are about to make the same
call you made in 2024 about splitting the read path.

Would you be up for 20 minutes some time in the next few weeks? I would like
to hear what you would do differently. Happy to return the favour on anything
you have going on, and completely understand if the timing is bad.
```

## Do not manufacture urgency

The skill does not write copy that inflates the stake, and it does not tell the user their silence has damaged a relationship unless there is evidence in the capture that it has.

Silence does have a measured cost, but the measured effect appeared only where the waiting party had a live stake in the answer, and produced no expectancy violation at all where they did not (`research/distilled-responsiveness-and-reengagement.md`, section 5). Combined with the urgency-bias finding (section 6), the honest position is that the user is a poor judge of which case they are in, and so is this skill. Draft the message, state the evidence, let the user decide.

Never write "they are probably annoyed" or "this may have damaged the relationship" as an inference from silence alone. If there is an observed signal, a terse reply, a chase with an edge to it, a cancelled meeting, cite it with a receipt and say what it is. Otherwise say nothing about how they feel.

## Ball-in-their-court drafts

Different job. The user is owed here, so the draft is not a re-engagement and must not read like one.

Rules:

- No apology of any kind. There is nothing to apologize for.
- Restate the open question in one line, and attach a date. Asking for a date rather than for the deliverable gives the other party something cheap to say yes to.
- One nudge maximum per item per run. A second nudge in a later run changes channel or changes framing, never repeats.
- Where the user has already nudged twice with no reply, do not draft a third. Recommend a decision instead: escalate to a call, route around them, or drop it.

```
Sam, still need the vendor list to close the Q4 plan. Is Friday realistic for
you, or should I work around it?
```

The urgency bias applies in the mirror: the user's unanswered outbound message is probably registering as less urgent to its recipient than it feels to the user (`research/distilled-responsiveness-and-reengagement.md`, section 6). Draft accordingly. No edge, no passive aggression, no "just following up again".

## The approval gate

For every draft, present, in this order:

1. The person, the channel, and the days cold.
2. Their last message, quoted, with its receipt in the canonical format including both collection and send times (`evidence-standards.md`, rule 1).
3. The score breakdown from `importance-ranking.md`, with axis B's confidence rating visible.
4. The full draft text, verbatim. Not a description of it.
5. Which voice skill produced it, or a plain statement that none was available.

Then `AskUserQuestion` with four options: send as written, edit first, hold for now, or close this loop and write it off.

"Close this loop and write it off" is a real option and it is often the right one. Record every write-off so no future run resurfaces it. An item the user consciously dropped and then saw again next week is the exact failure that trains a person to stop reading (`owed-response-detection.md`).

A Low-confidence claim never drives an irreversible action (`evidence-standards.md`, rule 3). If axis B rests on a single weakly scored capture fragment, say so above the draft and let the user weigh it before anything goes out.
