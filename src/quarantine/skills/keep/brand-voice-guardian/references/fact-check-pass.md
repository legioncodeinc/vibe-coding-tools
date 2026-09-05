# The fact-check pass

**A draft that sounds perfect and states something untrue is the worse failure.** Tone is
recoverable. A false claim published under the user's name is not.

This pass runs SEPARATELY from the tone pass, produces a SEPARATE section of the output,
and never merges into the tell inventory. A reader must be able to see at a glance which
findings are about how the draft sounds and which are about whether it is true.

**No research on fact-checking or claim verification was swept for this skill**
(`research/README.md`, gap 10). This pass is built on the marketplace's own evidence
standards (`evidence-standards.md`), not on external literature. Stated so nobody mistakes
it for a researched method.

---

## What this pass is and is not

**It is:** a check of the draft's factual claims against the user's own record, meaning
what Littlebird captured. It says "I could not corroborate this in your own history."

**It is not:** a truth oracle. The absence of corroboration in capture is not evidence a
claim is false. Littlebird captures what was on screen. A true fact that never crossed a
screen produces nothing, and a great deal of what a person knows was never on their
screen.

The distinction is the whole design of this pass:

| What the skill can say | What the skill must never say |
|---|---|
| "I could not corroborate this against your capture" | "This is false" |
| "Your capture shows a different number" | "You got this wrong" |
| "This claim needs a source you supply" | "This claim is unsupported" |
| "No evidence of X in the window I searched" | "X did not happen" |

`evidence-standards.md` rule 2 states this directly: "no evidence of X in the last 90
days" and "X did not happen" are different claims, and only the first is supportable.

---

## Step 1: Extract the claims

Read the draft and list every factual assertion. A factual assertion is anything a reader
could check.

**Extract:**

| Claim type | Examples |
|---|---|
| **Numbers** | revenue, percentages, counts, durations, dates, prices, headcount, growth figures |
| **Outcomes** | "we shipped it", "the client renewed", "it worked", "we grew" |
| **Attributions** | "X said", "the team decided", "our client told us" |
| **Events** | "last Tuesday we...", "at the conference...", "during the call..." |
| **Named entities** | company names, product names, people's names, job titles |
| **Comparisons** | "faster than", "the first to", "more than any other" |
| **Superlatives** | "our best month", "the biggest", "our most successful" |
| **Temporal claims** | "for three years", "since 2023", "every week" |

**Do not extract:** opinions, predictions, framings, calls to action, or anything the user
is explicitly speculating about. Those are not checkable and flagging them wastes the
user's attention.

**Superlatives get special attention.** They are the highest-risk category because they
are almost never verifiable from capture and they are the easiest thing for a tone pass to
introduce or strengthen. "A good month" becoming "our best month" is a fabrication
performed by an editing pass, and it is the specific way this skill could cause harm.

---

## Step 2: Retrieve against the user's own record

For each extracted claim, run **narrow parallel queries** rather than one broad sweep.
Broad queries return oversized results that get written to a file and score worse
(`littlebird-mcp-reference.md`).

### Query construction

| Claim type | Tool | Approach |
|---|---|---|
| A number, an outcome, a named entity | `search_user_context` | Two to four `search_queries` built from the claim's distinctive terms, bounded by `date_range` to the claim's window plus a margin |
| Something said in a conversation | `LB_INTERNAL_SEARCH_MEETINGS` with `query` | Look up by TOPIC |
| Something from a named meeting | `LB_INTERNAL_LIST_MEETINGS` with `name` | Look up by NAME |
| A decision, an owner, or an action item | `LB_INTERNAL_GET_MEETING` | The structured summary carries owner attribution. Prefer it over transcript. |
| Exact wording only | `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Wording only, never attribution |
| A message or a thread claim | `search_user_context` with `search_queries_messages` | Note that collection time and send time differ |

Using the wrong meeting tool is the most common retrieval mistake against this server. By
NAME uses `LIST_MEETINGS`. By TOPIC uses `SEARCH_MEETINGS`
(`littlebird-mcp-reference.md`).

### Reading the results

- **Read the relevance scores.** Items scoring below 3 are omitted by the server entirely.
  An item scored 3 is a maybe and does not corroborate a claim on its own
  (`littlebird-mcp-reference.md`).
- **Sort by timestamp before building any sequence.** Results come back
  relevance-ordered, not chronological (`evidence-standards.md` rule 8).
- **Deduplicate.** OCR of dense UI produces repeated identical lines. Treat them as one
  observation (`littlebird-mcp-reference.md`).
- **Apply the attribution guardrail.** Capture shows what the user was VIEWING, not
  necessarily what they WROTE. A number on screen may be someone else's number
  (`evidence-standards.md` rule 4). This bites hardest on financial and performance
  figures, which frequently appear in capture as another company's dashboard.

---

## Step 3: Assign a status

Every extracted claim gets exactly one of five statuses.

### Corroborated

Found in capture, with a receipt, and the capture agrees with the draft.

- **Receipt format:** `[Tuesday, August 11, 2026 23:40 EDT | chrome]`. For messages, both
  collection time and send time. For meetings, the meeting name, date, and the section the
  claim came from (`evidence-standards.md` rule 1).
- **Confidence:** rate it. High means multiple independent observations agree, or one
  unambiguous primary observation such as an invoice amount or a transcript quote. Medium
  means one clear observation with no corroboration. Low means a single item scored 3, an
  OCR fragment, or an ambiguous UI reading (`evidence-standards.md` rule 3).

### Contradicted

Found in capture, and the capture says something different.

**The highest-priority finding in the entire run.** It goes first in the fact-check
section, ahead of everything else including Critical tone flags.

Report both values, both receipts, and make no attempt to decide which is right. The user
knows things the capture does not. Where internal and external evidence disagree, present
both readings and say they disagree rather than resolving it by picking the more
interesting one (`evidence-standards.md` rule 10).

### Uncorroborated

Searched, found nothing.

State exactly what was searched: which queries, which date window, which filters, which
tools. "I could not find this" is only useful if the user can see where you looked and
tell you that you looked in the wrong place.

**This is not an accusation.** Say so in the output, every time, in the section header.
The most common cause is that the fact was never on a screen.

### Unverifiable

Not the kind of claim capture can settle.

Superlatives are the main population here. "Our best month" cannot be corroborated by
capture even in principle, because it requires a complete comparison set that capture does
not hold. Social platforms collapse lists and counts, so an engagement number in capture is
a partial snapshot rather than a total (`evidence-standards.md` rule 5).

Mark it, say why it is structurally unverifiable, and hand the check to the user.

### Not checked

Retrieval was unavailable, out of window, or the claim was outside the scope agreed at the
start of the run.

Being explicit here matters more than it looks. A claim silently skipped reads to the user
as a claim that passed.

---

## Step 4: The interaction with the tone pass

This is where the skill can do real damage, and the rules are absolute.

### Rule 1: Tone correction never touches a claim

The clean rewrite may change **how** a claim is stated. It may never change **what** is
claimed.

| Permitted | Forbidden |
|---|---|
| "We saw a 12% increase" becomes "12% up" | 12% becoming 15%, or "roughly 12%", or "over 10%" |
| "The client was pleased" becomes "client was happy with it" | "pleased" becoming "thrilled" |
| Reordering two sentences | Merging two claims into one stronger claim |
| Cutting a filler word | Cutting a hedge |

### Rule 2: A dropped hedge is a fabrication

If the source draft says "roughly" or "about" or "I think" or "in my experience", and the
rewrite drops it, the rewrite has made a stronger claim than the user made.

**A hedge is part of the claim, not part of the tone.**

This is the single most likely way a voice-matching pass introduces a falsehood, because
hedges read as weak writing and every instinct in a tightening pass is to cut them. It is
also the reason `ai-tell-catalog.md` entry 5.1 sends dropped hedges here rather than
treating them as a hedging-density question.

Where a hedge genuinely conflicts with the user's voice, do not resolve it. Flag it and
ask.

### Rule 3: Never strengthen a superlative or a comparison

"A good month" does not become "a great month". "One of our best" does not become "our
best". "Faster" does not become "the fastest".

### Rule 4: Never add a specific to fix a vague sentence

`ai-tell-catalog.md` entry 5.3 flags evaluative adjectives with no referent, such as
"incredible results". The correction is to **cut the adjective**, not to supply a number.

If the draft has no number, the rewrite has no number. Where a specific would genuinely
improve the piece, say so in the "why each change" section and ask the user for it. Do not
fill it in.

### Rule 5: Attribution survives the rewrite

If the draft says a client said something, the rewrite says the client said it. Do not
convert reported speech into the user's own assertion, and do not upgrade "someone on the
team mentioned" into "we found".

A raw transcript chunk tagged `[Others]` proves someone said it, not who
(`evidence-standards.md` rule 4). If the draft's attribution came from a transcript and the
capture cannot support who said it, that is a Contradicted or Uncorroborated finding, not a
wording problem.

---

## Step 5: Output

The fact-check section is separate, labeled, and placed **before** the tone findings in
the report, because a factual problem outranks a tonal one.

```
## Fact check

Searched: 7 claims. Window: 2026-06-01 to 2026-08-17.
Tools: search_user_context (4 queries), LB_INTERNAL_SEARCH_MEETINGS (2 queries).

CONTRADICTED (1)
- Claim: "we closed 14 deals in July"
  Capture shows: 11, in a CRM view
  Receipt: [Thursday, August 7, 2026 09:12 EDT | chrome]
  Confidence: Medium. One clear observation, no corroboration. The view may have
  been filtered, and the capture may post-date a correction.
  This is not a correction. You know things the capture does not. Please check.

UNCORROBORATED (2)
Not found in your capture. This is NOT evidence the claim is wrong. The most common
cause is that the fact was never on a screen.
- "the client renewed for another year"
  Searched: "client renewal", "contract renewed", "renewal confirmation",
  2026-05-01 to 2026-08-17, data_source snapshots and messages. Nothing scored above 3.
- "we have been doing this for six years"
  Searched: no capture exists before the Littlebird install date. Out of window
  by construction.

UNVERIFIABLE (1)
- "our best quarter yet"
  A superlative requires a complete comparison set. Capture does not hold one, and
  social and app UIs collapse counts, so nothing in capture can settle this even in
  principle. Your call.

CORROBORATED (3)
- "the workshop ran on August 3" [Kickoff workshop, 2026-08-03, Executive Summary]
  Confidence: High.
- ... 

NOT CHECKED (0)
```

Raw retrieved capture does not appear in this section or anywhere in the deliverable.
Process it in temp space and let it go (`evidence-standards.md` rule 7). The fact-check
section names what it found, it does not reproduce another person's messages or another
company's dashboard.

---

## When retrieval is unavailable

If the Littlebird MCP is not connected, or the user declines retrieval, or the draft is
about something outside the capture window entirely:

**Run the pass anyway, in list-only mode.**

Extract the claims, list them, mark every one **Not checked**, and say plainly that no
corroboration was attempted and why. Then hand the list to the user as a manual checklist.

An extracted claim list with no verification is still worth more than no fact-check pass,
because most of the value is in noticing that the draft made seven checkable assertions in
the first place. Users routinely do not notice.

What is NOT permitted in this mode: guessing at plausibility, reasoning from training data
about whether a claim sounds right, or quietly skipping the section. Empty retrieval is
reported, not filled (`evidence-standards.md` rule 9).
