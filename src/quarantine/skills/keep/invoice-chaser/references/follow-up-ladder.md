# The follow-up ladder

Phase 6. Draft the escalating sequence for each verified overdue invoice, and hold it.

Only invoices the user confirmed at the verification gate reach this file
[`aging-and-verification.md`, section 3]. If nothing was confirmed, nothing is drafted, and
the report says so.

Nothing in this file is legal advice.

---

## 1. The rungs

The published convention, from a credit control vendor
[`research/distilled-receivables-collection.md`, section 3]:

| Rung | Timing | Tone as published |
|---|---|---|
| 0. Pre-due | 7 days before due | Warm and helpful |
| 1. Due date | On the due date | Friendly and clear |
| 2. First overdue | 1 to 3 days late | Polite, no blame |
| 3. Second reminder | 7 days late | Firm but respectful |
| 4. Payment plan offer | 14 days late | Empathetic and clear |
| 5. First formal notice | 30 days late | Formal and direct |
| 6. Second formal notice | 60 days late | Serious and factual |
| 7. Final notice | 90 days late | Formal and final |

A second vendor puts the pre-due reminder at three days rather than seven
[`research/distilled-receivables-collection.md`, section 3]. Both are published; nothing in
the archive tests which is better.

**State the provenance when you present this ladder.** No source in the archive quantifies
reminder effectiveness at any rung, by any tone, on any channel
[`research/distilled-receivables-collection.md`, section 8, gap 2], and both cadence
sources sell software that automates the cadence they recommend
[`research/distilled-receivables-collection.md`, section 3]. This is industry convention
with commercial motive behind it, not a tested schedule. Say so once, in the report, and
let the user move the timings.

## 2. Two rungs the convention does not include, which this skill adds

**The channel switch.** "When email goes quiet, a friendly call often resolves things
faster than another message" [`research/distilled-receivables-collection.md`, section 3].
After rung 5 goes unanswered, the next action is a phone call, not a sixth email. The skill
drafts talking points for the call rather than another paragraph.

**The stop rung.** The ladder terminates. After rung 7, the skill's own escalation options
are exhausted and the next step is outside the skill: a formal demand letter drafted by a
lawyer, a collection agency placement, or a decision to write it off. The archive places
outside-agency action at 90 to 120 days past due and warns that "Waiting too long is to
invite a total write-off" [`research/distilled-receivables-collection.md`, section 1].

**There is no rung 8.** The skill does not generate a ninth reminder, a tenth, or an
indefinite loop. If the report is about to recommend "send another reminder" for the fourth
time to the same client, it recommends the stop rung instead and says why.

## 3. Maximum contact frequency

The federal call-frequency rule does not bind a business collecting its own accounts, and
the report should say so plainly rather than implying the user is under a regime they are
not under. Regulation F's presumptions are written as constraints on "a debt collector,"
and the statute excludes a creditor collecting its own debts and excludes commercial debt
entirely [`research/distilled-receivables-collection.md`, section 4].

That said, this skill adopts a ceiling far below the collector limit, for three reasons
drawn from the archive:

1. The collector limit of seven calls in seven consecutive days is a **rebuttable
   presumption, not a safe harbor**; staying under it "doesn't guarantee protection against
   harassment claims" [`research/distilled-receivables-collection.md`, section 4]. A limit
   that is not automatically safe for a professional collector is a bad ceiling for a
   business protecting a client relationship.
2. The underlying prohibition is on "any conduct the natural consequence of which is to
   harass, oppress, or abuse" [`research/distilled-receivables-collection.md`, section 4].
   That describes behavior, and the client experiencing it does not consult the statute
   before deciding never to hire the user again.
3. State law can be broader. California's Rosenthal Act "protects debtors from first-party
   creditors" and reaches original creditors, unlike the FDCPA
   [`research/distilled-receivables-collection.md`, section 4], and the CFPB notes that
   states also have unfair and deceptive acts and practices laws that may apply to debt
   collection [`research/distilled-receivables-collection.md`, section 4].

**The house ceiling:**

| Rule | Value |
|---|---|
| Maximum contacts about one invoice | 1 in any 5 consecutive days |
| Maximum contacts about one invoice | 2 in any 14 consecutive days |
| Minimum gap after a client responds with a date | Until that date passes, plus 2 days |
| Channel after an opt-out | Never that channel again |
| Total contacts before the stop rung | 7, counting rung 0 through rung 7 |

The opt-out rule mirrors 12 CFR 1006.14(h), which bars a collector from continuing to use a
medium the person asked them to stop using
[`research/distilled-receivables-collection.md`, section 4]. The user is not bound by it.
Adopt it anyway; it costs nothing and it is the difference between persistent and
unbearable.

**Prior contacts count.** Before proposing a rung, check what the user has already sent.
Search the client's message threads and the sent-mail surface for prior chases within the
window. A client on their fifth contact does not get a "just following up" email that reads
as though it were the first.

## 4. Calibrating to the relationship

The bucket sets the floor. The relationship sets the actual rung. A first reminder to a
good client three days late is a different message from a fifth contact with a client 75
days out, and treating them the same is how a skill loses a client for its user.

Score three inputs from what capture actually showed, each with a receipt.

| Input | Softens the rung | Hardens the rung |
|---|---|---|
| **Payment history** | This client has paid before, on time, more than once | No prior payment ever observed from this client |
| **Responsiveness** | Replies to messages, acknowledged the invoice, gave a date | Silent across the whole window despite prior contact |
| **Relationship value** | Ongoing work, a retainer, an active project, upcoming scheduled meetings | One-off engagement, work already complete, no future work observed |

**Adjustment rule.** Two or more softening signals move the draft down one rung from the
bucket default and lengthen the gap. Two or more hardening signals move it up one rung, but
never past rung 7 and never past the frequency ceiling in section 3.

**Signals that override everything:**

- **The client gave a specific date.** Do not contact before it. Draft a rung timed to
  fire two days after it, and say in the report that the ladder is paused until then.
- **The client stated a financial difficulty.** Rung 4, the payment plan, regardless of
  bucket. Escalating on a client who has told you they cannot pay this month produces no
  money and ends the relationship.
- **The client disputed the work.** Not a ladder at all
  [`aging-and-verification.md`, section 2].
- **A meeting with this client is on the calendar.** Check with
  `LB_INTERNAL_LIST_MEETINGS` using a future `end_date`. If one exists inside the next
  seven days, the recommendation is to raise it in person, and the drafted email is held as
  a fallback for after the meeting.

**Relationship signals are inferences, not observations.** Mark them as such
[`evidence-standards.md`, rule 2]. "No prior payment observed" is not "never paid," and a
client who is quiet in capture may be talking to the user on a channel Littlebird does not
see.

## 5. Drafting

Write the actual text at each rung the client is currently at, plus the next rung so the
user can see where this goes. Do not write all eight for every client; that produces a
document nobody reads.

**If a personal voice skill is installed in this session, draft through it.** Check the
session's available skills. If none is present, say so plainly in the report, write in
plain professional English, and point the user at this marketplace's voice creator skills.
Never invent a voice profile and never imitate a voice from nothing.

### What every draft contains

1. The invoice reference and the amount.
2. The issue date and the due date, stated as facts, not as accusations.
3. A payment link or payment instructions, or a placeholder marked for the user to fill.
4. One clear ask with one clear date.
5. An exit for the client: a way to say "there is a problem" that is not silence.

### What no draft ever contains

- **Another client's name, balance, or situation.** Client financial data stays internal.
  One client never learns anything about another from a draft this skill produced.
- **A quoted screenshot, OCR fragment, or captured private message.** Raw capture never
  ships [`evidence-standards.md`, rule 7].
- **A threat the user has not decided to carry out.** Do not write "we will refer this to
  collections" unless the user has said they will. An unbacked threat is both a bad
  negotiating position and, in a state with broader collection rules, a risk.
- **A computed late fee or interest figure**, unless the user confirmed the contract
  provides for one and stated the terms [`aging-and-verification.md`, section 5].
- **A characterization of the client's finances or motives.** State the invoice status,
  not a theory about why.
- **A legal conclusion.** The skill does not tell a client what they are legally obligated
  to do.

### Rung shapes

**Rung 2, first overdue, 1 to 3 days late.** Assume an oversight, because at this age it
usually is. Short. No apology, no accusation. Restate the invoice, restate the amount,
attach or link, ask if it was received.

**Rung 3, second reminder, 7 days late.** Reference the previous message by date. Ask a
direct question that requires an answer: is there a date you can commit to. Firm, still
warm.

**Rung 4, payment plan, 14 days late.** Acknowledge that circumstances happen. Offer a
concrete structure: half now and half in fourteen days, or three equal payments. A partial
payment on a schedule collects more than a full payment that never comes, and the
collectability curve is steepest early
[`research/distilled-receivables-collection.md`, section 1].

**Rung 5, first formal notice, 30 days late.** Change register. Full invoice details, the
history of contact with dates, the amount, the specific action required, a specific
deadline. State what happens next if the deadline passes, and state only what the user has
actually decided to do. This is the last rung before the channel switch.

**Channel switch, after rung 5 goes unanswered.** Draft call talking points, not an email:
the opening line, the three facts to state, the one question to ask, and what to do with
each of the three likely answers (a date, a dispute, silence). Note that anything agreed on
the call needs a written confirmation afterward, and draft that too.

**Rung 6, second formal notice, 60 days late.** Factual and serious. Full history. State
the account status. State the deadline and the consequence, again only what the user has
decided.

**Rung 7, final notice, 90 days late.** Formal, final, short. This is the last message the
skill drafts. It states the balance, the total time outstanding, the final deadline, and
the fact that the user will decide on next steps after that date. It does not name a
specific agency or threaten specific litigation unless the user has instructed that and has
taken legal advice.

**Stop rung, past 90 days with no response.** Not a draft. A recommendation to the user
with three options and their tradeoffs: a lawyer-drafted demand letter, a collection agency
placement, or a write-off. Note that the archive puts the outside-action window at 90 to
120 days past due and warns against waiting
[`research/distilled-receivables-collection.md`, section 1]. Note also that placing an
account with a third-party agency changes the legal picture, because the FDCPA does apply
to third-party collectors even where it did not apply to the user
[`research/distilled-receivables-collection.md`, section 4], and that this is a decision to
take with a lawyer, not with this skill.

## 6. The draft-never-send law

The skill drafts. The user sends. Every draft ships into the drafts file headed:

```
STATUS: HELD FOR APPROVAL. Not sent.
```

Do not call an email tool. Do not open a compose surface and populate it. Do not offer
sending as a convenience. Do not send even when a connector is available and even when the
user approved the plan, because approving a plan is not approving the words
[`evidence-standards.md`, rule 6].

If the user asks for the drafts in a sendable form, produce a copy-paste block or an
import-ready file. The transmission is theirs.

## 7. Preventing the next one

Where the report shows a pattern, add a short prevention note. Everything here comes from a
single vendor product guide and is stated as recommendation, not measured result
[`research/distilled-receivables-collection.md`, section 6].

| Pattern in the data | Suggestion | Provenance |
|---|---|---|
| Most invoices land in the 1-30 bucket and clear | Move to Net 15 or Net 21; shorter windows are associated with faster payment | [`research/distilled-receivables-collection.md`, section 6] |
| Clients pay only after a reminder | Automate a pre-due reminder and a due-date reminder | [`research/distilled-receivables-collection.md`, section 6] |
| Payment friction shows in the threads ("how do I pay this") | Embedded payment link, cards plus ACH | [`research/distilled-receivables-collection.md`, section 6] |
| A new client is the one 60-plus days out | Deposit upfront, as a percentage or a fixed amount, before work starts | [`research/distilled-receivables-collection.md`, section 6] |
| Large single invoices at the end of long projects | Milestone or progress billing | Practitioner convention. The archive does not cover milestone billing, retainers, or auto-charge on file [`research/distilled-receivables-collection.md`, section 8, gap 5]. Label it as unsourced. |

**Do not promise a number.** The 7.8-day US figure that appears alongside these
recommendations is a market-wide trend, not the measured effect of any one practice, and
the platform source presents its four practices as correlations with no causal test
[`research/distilled-receivables-collection.md`, section 6].
