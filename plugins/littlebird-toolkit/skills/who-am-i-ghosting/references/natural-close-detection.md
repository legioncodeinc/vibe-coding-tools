# Natural close detection

A named function, run on every candidate before it is scored. It answers one question: did this conversation stop because it was finished.

A conversation that ended well is not ghosting. Presenting one as ghosting is the most damaging false positive this skill produces, worse than a newsletter slipping through, because the user remembers that conversation ending fine and now distrusts the whole list. One of these does more reputational damage to the skill than ten obvious misfires.

## The function

```
natural_close_check(thread) -> CLOSED | OPEN | AMBIGUOUS
```

Inputs: the full visible message sequence, each message's sender and send timestamp, and any downstream evidence retrieved about the same subject.

Outputs and what each does:

| Result | Effect |
|---|---|
| `CLOSED` | Excluded. Counted in the suppression tally as "naturally closed". Never scored, never drafted, never shown. |
| `OPEN` | Proceeds to `importance-ranking.md`. |
| `AMBIGUOUS` | Goes to the ambiguous bucket in the output, capped at 3 items, presented as "worth a look, I could not tell". Never drafted for. |

Default when the evidence is thin is `AMBIGUOUS`, not `OPEN`. An uncertain item costs the user five seconds of judgment. A wrong confident item costs the skill its credibility.

## The six close patterns

### 1. Terminal gratitude

The last message from the other party is an acknowledgment with no new ask.

Signals: "thanks!", "perfect, thank you", "great, appreciate it", "got it", "that works", "sounds good", "ok great", a lone thumbs up or checkmark reaction, "will do".

Test: the acknowledgment follows something the user delivered, and it contains no question mark and no request construction.

Verdict `CLOSED`.

The trap: "Thanks! And one more thing, could you also..." is not terminal. Read the whole message, not the first clause. Gratitude followed by a new ask is a new ask.

The reverse trap: a bare "thanks" that arrived **before** the user delivered anything is not a close. "Thanks in advance" and "thanks for looking into it" are pre-emptive and the thing is still owed.

### 2. Explicit resolution

Someone states that the matter is settled.

Signals: "got it working", "no longer needed", "we went another way", "we found someone", "it's handled", "disregard my last", "never mind", "we've decided to", "we're all set", "sorted".

Verdict `CLOSED`. Where the resolution is negative for the user, such as losing a deal, it is still closed. Do not resurrect a lost thread as a ghosting item. If the user wants to reopen a lost opportunity that is a different action with a different skill.

### 3. Answered elsewhere

The ask was satisfied outside this thread.

This is the pattern that requires actual retrieval work rather than pattern matching, and it is the most common false positive source in the whole skill. People answer in the channel that is convenient, not the channel the question arrived in.

Check for:

- A meeting between the same parties after the question date. Use `LB_INTERNAL_SEARCH_MEETINGS` with the subject of the question as the query and a `start_date` after the message. Do not use the `attendees` filter to establish this: it is an OR filter and best-effort, and can miss a matching meeting entirely (`littlebird-mcp-reference.md`). Reword the query instead, then confirm with `LB_INTERNAL_GET_MEETING`.
- The same topic in a different app. A question asked by email and answered in Slack, or asked in a DM and answered in a call.
- The artifact the answer would have produced. If they asked for a file, search for evidence the file moved. Search for the artifact, not for the question text again.
- A calendar event that resolved it. A meeting that got booked answers "when are you free".

Verdict `CLOSED` where downstream evidence is clear, `AMBIGUOUS` where a single weakly scored item hints at it. Items the retrieval scored 3 are maybes and never close anything alone (`littlebird-mcp-reference.md`).

Absence of evidence is not evidence of absence, and the inverse holds here too: weak evidence that something was answered elsewhere is not proof that it was. That is precisely what `AMBIGUOUS` is for.

### 4. Broadcast with no ask

The other party's last message was informational and expected nothing back.

Signals: a status update, a shared link with no question, a document shared for awareness, a "just so you know", a forwarded item with no covering note, a congratulation, an announcement.

Verdict `CLOSED`. Silence is the correct response to an FYI and the user has done nothing wrong.

The trap: "Sharing the deck, let me know what you think" is an ask wearing an FYI coat. The invitation to respond makes it an ask.

### 5. Scheduled forward

Both parties agreed to pick it up later and the later has not arrived.

Signals: "let's revisit in September", "after the launch", "once Q3 closes", "when you're back", "circle back after the board meeting", "talk next quarter".

Verdict `CLOSED` while the named time is still in the future. When the named time passes, the item becomes `OPEN` again with days cold counted from the agreed date rather than from the last message. A scheduled forward whose date has passed by more than a week is a strong candidate, not a weak one, because both parties expected it to resume.

Record the resume date so the next run can act on it. This is one of the highest-value items the skill produces and it is invisible to any model that only looks at elapsed silence.

### 6. Deferred by agreement

The user said when they would respond, and that time has not arrived.

Signals from the user's own last message: "I'll get back to you next week", "let me check and revert by Friday", "give me a few days", "I'll have an answer after the board meeting".

Verdict `CLOSED` until the promised time passes. Once it passes, the item is `OPEN` and it gets a specific treatment: this is a broken explicit promise rather than a lapse, it is the one case where the draft acknowledges the missed commitment directly, and it scores axis C at 3 because a stated date is a stated dependency.

Overlap note. A commitment made in a meeting and captured in a meeting summary's Action Items block is `commitment-tracker`'s subject, not this skill's. This skill handles a promise made **inside a message thread** to reply by a date. Where both skills would surface the same item, `commitment-tracker` owns it and this skill defers, because the meeting summary carries better attribution than a message thread does.

## Signals that are NOT natural closes

Do not close on any of these:

| Pattern | Why it is not a close |
|---|---|
| The user reacted with an emoji | A reaction is acknowledgment of receipt, not an answer. If the message asked a question, the question is still open. |
| The user opened it | Reading is not replying. Read state is not response state. |
| The thread is old | Age is not resolution. That is the naive model this skill exists to replace. |
| The other party went quiet too | Mutual silence after an unanswered ask is not agreement. It is usually the other person concluding they will not get an answer. |
| The user drafted a reply and did not send it | Drafting is not sending. An unsent draft visible in capture makes the item stronger, not weaker, because it proves the user intended to answer. |
| The topic stopped appearing | Disappearance from the agenda is not completion. Report it as "no evidence it was resolved", never as resolved. |
| Someone else in a group thread said thanks | Their close is theirs. If the user was directly addressed, the user's part is still open. |

That last row on unsent drafts is worth acting on: where capture shows the user composing a reply that never appears as sent, surface it near the top and say so. It is a high-confidence item and it usually only needs the user to finish a sentence.

## Reporting closes

The suppression tally reports naturally closed items as a count and a reason, with no names and no content, exactly like every other suppression category (`owed-response-detection.md`).

One exception, and only on a deep run, only for the six-pattern breakdown, and only where the count is high enough to be surprising:

```
Naturally closed: 9. Six ended in thanks, two were resolved elsewhere, one was
an FYI. Two scheduled forwards resume in the next 14 days and are listed under
Upcoming rather than suppressed.
```

The scheduled forwards get their own short Upcoming section with their resume dates. They are the one class of suppressed item the user actively wants to see, because they are calendar items in disguise.
