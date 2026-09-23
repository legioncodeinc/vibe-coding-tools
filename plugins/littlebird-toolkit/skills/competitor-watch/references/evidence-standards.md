# Evidence standards for Littlebird skills

The house style that makes every skill in this marketplace trustworthy enough to act on.
Every skill built on Littlebird data follows these rules. They are not optional polish.

The reason they exist: Littlebird's capture is broad but lossy. Screen OCR reads
whatever pixels were present, including other people's words, half-loaded UI, stale
tabs, and text the user was reading rather than writing. A skill that presents all of
that with equal confidence produces confident garbage. These standards keep the output
honest without making it useless.

## 1. The receipt format

Every factual claim derived from Littlebird capture carries a receipt. The canonical
form, taken directly from what the MCP returns:

```
[Tuesday, August 11, 2026 23:40 EDT | chrome]
```

For messages, the collection time and the send time are different values and both matter:

```
[collected Sunday, June 14, 2026 13:57 EDT | whatsapp | Dani Thompson] (sent Jun 8, 6:30 PM)
```

For meetings, cite the meeting name and its date, and the section the claim came from:

```
[Sarah Montana and Ofer Avnery, 2026-08-03, Action Items]
```

A claim with no receipt is an inference. Label it as one. See rule 2.

## 2. Observed, inferred, external, unknown

Every line in a deliverable is exactly one of four kinds, and the kind is visible to the
reader:

| Kind | Definition | How it is marked |
|---|---|---|
| **Observed** | Directly present in the capture. The words or numbers were on the screen or in the transcript. | Carries a receipt. |
| **Inferred** | A conclusion the skill drew by combining observations. | Marked as inference, with the observations it rests on. |
| **External** | Retrieved from outside Littlebird (web search, a public profile, an API). | Cited to its URL or source. |
| **Unknown** | The skill looked and did not find it. | Named explicitly as a gap. |

Never promote an inference to an observation by dropping the hedge. Never silently
convert an absence into a negative finding: "no evidence of X in the last 90 days" and
"X did not happen" are different claims, and only the first one is supportable.

## 3. Confidence ratings

Where a skill makes a claim that a human will act on, rate it:

| Rating | Meaning |
|---|---|
| **High** | Multiple independent observations agree, or one unambiguous primary observation (an invoice amount, a calendar invite, a transcript quote). |
| **Medium** | One clear observation with no corroboration, or several weak ones pointing the same way. |
| **Low** | A single item the retrieval scored 3, an OCR fragment, or a reading that depends on interpreting ambiguous UI. |

A Low-rated claim never drives an irreversible action. If a skill is about to send an
email, spend money, or tell a third party something, the claim behind it is High or the
skill asks the user first.

## 4. The attribution guardrail

Captured content shows what the user was **viewing**, not necessarily what they
**wrote**. This is the repo's founding rule and it generalizes past the voice skills:

- Text in a compose box is probably theirs. Text in a feed is probably not.
- A message in a thread tagged `(From:[user])` is theirs. Everything else is not.
- A raw transcript chunk tagged `[Others]` proves someone said it, not who.
- Anything a bot, an assistant, or a template produced on the user's behalf is not the
  user's words.

Attribution is guilty until proven innocent. When in doubt, drop it or ask.

## 5. Partial rosters are reported as partial

Social platforms and app UIs collapse lists: "and 4 others", "12 people reacted",
"3 more". Any list built from that capture is incomplete by construction. The rule:

- Report the named set with receipts.
- Report the count of unnamed entries and where they came from.
- Say what the user could do to close the gap.

Presenting a partial roster as if it were complete is the single fastest way to make a
Littlebird skill untrustworthy, because the user will notice the missing names first.

## 6. Confirm before you encode, and confirm before you send

Two confirmation gates, both using `AskUserQuestion`:

- **Before encoding.** Anything that will be written down as durable fact about a
  person, a company, a commitment, or a number gets confirmed with the user first.
  Littlebird misreads ambiguous captures, and a skill that permanently records a wrong
  fact is worse than one that asks.
- **Before sending.** Nothing generated from capture goes to another human without
  explicit approval of the actual text. Not a summary of it, the text.

## 7. Raw capture never ships

Retrieved material is working data. Process it in temp space, produce the distilled
deliverable, delete the raw. Nothing derived from another person's private messages,
another company's dashboard, or a screen share ends up in a committed file, a shipped
skill, or a shared artifact.

## 8. Timeline discipline

Retrieval returns items ordered by relevance, not by time. Any deliverable presenting a
sequence sorts by timestamp first. Where the collection time and the event time differ
(messages, forwarded content, a screenshot of an older thread), the event time governs
the timeline and the collection time appears in the receipt.

## 9. Empty retrieval ends the run

If the searches come back empty, say so and stop. Do not pad from training data, do not
reason from what "would probably" be there, do not substitute plausible examples. A
skill that reports "I found nothing for this window" is doing its job correctly.

## 10. Reporting on people

Several skills in this marketplace assemble information about identifiable people:
business contacts, prospects, partners. That is legitimate work, and these rules are
what keep it defensible:

- **Purpose-bound.** Assemble what the stated business purpose needs. Not everything
  findable.
- **Provenance on every line.** Internal claims carry a receipt. External claims carry a
  URL. A reader can check any line.
- **Conflicts stay conflicts.** Where internal and external evidence disagree, present
  both readings and say they disagree. Do not resolve it by picking the more interesting
  one.
- **Third parties in the capture are incidental.** Other people appear in the user's
  screenshots and threads. Include them only where they are material to the stated
  purpose, and apply the same evidence standards to them.
- **Sensitive categories stay out.** Health, financial detail, legal history, family
  circumstances, protected characteristics, and precise home location do not belong in a
  business dossier and are omitted even when the capture contains them.
- **No unverified claim gets restated as fact.** An external claim is reported as "their
  site says X", not as "X".
