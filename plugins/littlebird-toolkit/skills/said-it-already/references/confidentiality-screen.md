# The confidentiality screen

A distinct, named stage. It runs after attribution screening and **before any drafting**,
never after. Screening a finished draft invites the user to argue for keeping a good post,
and it wastes the drafting work on material that was never publishable.

The screen produces a **do-not-publish list**, which is a mandatory section of the output
artifact. Producing a content bank with no do-not-publish list means the screen did not
run.

This is not legal advice. It is a detection list built from a law firm publication on
meeting-transcript exposure, and it exists to route material to a human, not to clear it.

---

## The one sentence that explains the whole risk

AI notetakers "transform conversations that would otherwise fade from memory into
searchable, reusable records capable of circulating well beyond their original context"
(`research/distilled-content-mining-and-repurposing.md`, section 7).

A call has an audience of four people who share context, an understanding of what was
off the record, and the ability to ask a follow-up question. A post has an audience of
strangers with none of that. Publishing a line from a call is a context transfer, and the
context does not travel with the line.

The speaker also did not know they were writing. That is the thing this skill exploits and
the thing it has to protect against in the same pass.

---

## The hard list: never publishable

These come straight off the tiered meeting classification a law firm recommends for
organizations, adapted down to one operator
(`research/distilled-content-mining-and-repurposing.md`, section 7). Anything in these
categories goes to the do-not-publish list with no scrub option.

| Category | What it looks like on a call |
|---|---|
| **Legal advice or privileged discussion** | Anything said with or about counsel, anything framed as "our lawyer said". Privilege can be waived by disclosure, and a court has already declined to extend it to material run through a consumer AI platform. |
| **HR matters** | Investigations, complaints, hiring or firing deliberations, compensation discussion about an identifiable person. |
| **Trade secrets** | The user's own or a client's. Methods, pricing models, source material, anything the business treats as proprietary. |
| **Accommodation and medical** | Anything touching disability, accommodation, or health. Named in the source as protected information an employer must keep confidential. |
| **Performance and discipline** | Anything evaluating a named individual's work. |
| **A deal in progress** | Terms, pricing, timing, who else is bidding, whether it is going well. Not on the source's list, added here on operating grounds: publishing about a live negotiation moves the negotiation. |
| **A private complaint about a person** | Named or identifiable. Including complaints the user would defend as fair. |
| **Anything from a partner conversation with an implicit confidence** | The kind of call where both people speak freely because it is not going anywhere. |

---

## The scrub list: publishable after specific changes

Material that is valuable and fixable. Each item goes to the do-not-publish list marked
**Needs-scrub**, with the exact change required, and returns to the bank only after the
user approves the scrubbed version.

| Issue | The scrub |
|---|---|
| **Named client** | Replace with a role and a sector: "a services firm doing about $4M", not "Acme". Verify the role plus sector plus detail combination is not itself identifying. In a small industry, three generic details identify a company. |
| **Identifying detail cluster** | Even unnamed, a story with a city, a headcount, and a specific product is identifiable. Drop details until it is not, starting with the ones that carry the least narrative weight. |
| **Unreleased product or feature** | Cut entirely or defer to the seed's "hold until" date. |
| **A number that is theirs, not yours** | A client's revenue, margin, or headcount belongs to the client. The user's own result from the engagement may be publishable; the client's underlying figures are not. |
| **A third party's words** | If the moment only works with someone else's line in it, that person has to agree. Route it to the user as a permission question, not as a draft. |
| **A hedge that got dropped** | "Roughly forty percent" cannot become "40%". Restore the hedge and the seed is fine. |
| **An off-the-record framing** | "Between us", "do not repeat this", "off the record", "this does not leave the room". Any of these phrases anywhere near the seed moves it to the hard list, not the scrub list. |

---

## How to run the screen

For each seed that passed attribution:

1. **Read the meeting summary, not just the quoted line.** The `## Topics Discussed` and
   `## Risks / Open Questions` sections tell you what kind of conversation this was.
   A great line inside a sensitive call is still inside a sensitive call.
2. **Check the register field.** A partner call and a public webinar carry different
   default expectations. Client call and partner call default to Needs-scrub. Internal
   team defaults to Needs-scrub. Teaching, coaching, and anything already public default
   to Clear.
3. **Search the verbatim and its surrounding turns for confidence markers.** The literal
   phrases in the scrub table above, plus "I probably should not say this", "keep this
   quiet", "under NDA", "not announced yet".
4. **Identify every third party in the moment.** Named people, named companies, and
   identifiable-by-description entities. Each one is a scrub item or a hard block.
5. **Assign one of three values** to the seed's `confidentiality` field: Clear,
   Needs-scrub, or Do-not-publish. There is no fourth value and no "probably fine".
6. **Write the reason.** Every Needs-scrub and Do-not-publish entry carries a one-line
   reason in the artifact. The user has to be able to disagree with a specific judgment.

---

## Consent, briefly and honestly

US federal law is one-party consent for recording, but California, Florida, Illinois,
Pennsylvania, and Washington require all-party consent, and the practice counsel
recommends is applying the strictest applicable standard based on participant locations
(`research/distilled-content-mining-and-repurposing.md`, section 7).

This skill does not record anything and does not give legal advice. What follows from
that finding for this skill is narrower and worth saying to the user once: **other people
participated in these conversations.** Consent to being in a recorded meeting is not
consent to being quoted in public. That is a courtesy point more than a legal one, and it
is the reason the scrub list treats a third party's words as a permission question rather
than an editing problem.

---

## The do-not-publish list as an output

It ships in the artifact, always, even when it is short. Format:

```
### Do not publish

**[S-2026-08-14-03] Client story, Thursday 2026-08-14 client review**
Hard block: names a client and quotes their revenue figure.
Verbatim held in working notes, not reproduced here.

**[S-2026-08-14-07] Number, Wednesday 2026-08-13 partner call**
Needs-scrub: the figure is the partner's, not the user's. Publishable only with
their sign-off, or as the user's own outcome without the underlying number.
```

Note what the first entry does: it names the seed, the reason, and does NOT reproduce the
sensitive verbatim in the deliverable. Raw capture never ships (`evidence-standards.md`,
rule 7). A do-not-publish list that quotes everything it is protecting is a leak with a
warning label on it.

**Tell the user why the list exists.** It is not a compliance chore. It is the section that
makes the rest of the bank trustworthy, because it proves the screen ran on everything
else.
