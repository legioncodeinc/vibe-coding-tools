# Distilled: meeting follow-up, decision capture, and the shareable recap

Written from a fresh read of `raw/` on 2026-08-17. Every claim below ends in a bracketed
pointer to the raw file it came from. A claim with no pointer is not in this file.

The reader of this file is a skill author deciding what `meeting-scribe` should do. It is
organized by decision, not by source.

---

## 1. What a post-meeting recap contains

Two independent sources converge on the same minimum content, and neither is a study.

| Element | Source |
|---|---|
| Decisions reached | [raw/followup--client-recap-rules--sakas-2019.md] |
| Action items, each with a named owner and a deadline | [raw/followup--client-recap-rules--sakas-2019.md], [raw/followup--recap-contents--granola-2026.md] |
| A reference to something specifically said or decided, not just the topic | [raw/followup--recap-contents--granola-2026.md] |
| Any material the sender promised to send | [raw/followup--recap-contents--granola-2026.md] |
| Exactly one ask | [raw/followup--recap-contents--granola-2026.md] |

Sakas splits the action items into per-person subsections inside a single document so each
reader sees their own list [raw/followup--client-recap-rules--sakas-2019.md]. That is a
split by owner, not a split by audience, and the distinction matters for section 5.

The exclusion list is thin: generic openings, vague next steps, unfilled placeholders, and
"unnecessary information unrelated to the meeting's actual discussion"
[raw/followup--recap-contents--granola-2026.md]. No source in this archive tells a
practitioner what to strip from a client-facing recap for confidentiality reasons; asked
directly, the client-recap source is silent [raw/followup--client-recap-rules--sakas-2019.md].
That rule has to come from section 4.

### Length: a soft number with a genre problem

The notetaker vendor says "Keep it under 150 words," short paragraphs, bullets for action
items, and cites nothing for the figure [raw/followup--recap-contents--granola-2026.md].

The only large-sample number available is Boomerang's analysis of 40 million emails, which
found an optimal band of 50 to 125 words, with response rates flat at 50 to 51 percent
between 50 and 125 words and falling to 44 percent at 25 words and 36 percent at 10 words
[raw/followup--email-length--boomerang-hubspot-2016.md].

**The conflict, stated rather than smoothed.** The two numbers agree to within one band
width, which is mild corroboration. But the Boomerang data is from 2016, the article does
not state whether the emails were cold outreach or existing-relationship messages, and the
publication context makes sales outreach the likely majority
[raw/followup--email-length--boomerang-hubspot-2016.md]. A recap to someone who spent the
last half hour on a call with the sender is a different genre, and response rate is not the
right success metric for it anyway
[raw/followup--email-length--boomerang-hubspot-2016.md].

**Preferred reading:** treat 150 words as a soft ceiling on the prose, exclude the action
item block from the count, and never quote either number to the user as an established fact
about meeting recaps, because neither source measured meeting recaps.

Corroborating detail worth carrying: emails written at a third grade reading level had 36
percent higher open rates than college-level ones and 17 percent higher response rates than
high-school-level ones [raw/followup--email-length--boomerang-hubspot-2016.md].

### Timing

Within 24 hours [raw/followup--recap-contents--granola-2026.md]. Immediately, or within one
business day [raw/followup--client-recap-rules--sakas-2019.md]. The two agree.

The stated reason in the vendor source is the Ebbinghaus forgetting curve, invoked without
citing the original and never measured on business conversations
[raw/followup--recap-contents--granola-2026.md]. The practitioner source gives the simpler
and more defensible reason: "The longer you wait, the less relevant it becomes"
[raw/followup--client-recap-rules--sakas-2019.md]. Use the second one.

### Named gap: nobody measured whether recaps improve follow-through

The sweep found no study testing whether sending a post-meeting recap changes whether
commitments get kept. Every result for that query was cold-outreach persistence content
marketing or notetaker vendor blogging. The 24 hour norm and the recap-contents list in
this archive are practice conventions from two practitioners, one of them a vendor selling
notetaking software. Say so. Do not dress either as evidence.

---

## 2. Why a decision needs its rationale, its quote, and a status

The foundational statement of the problem: organizations routinely "forget" what they have
done in the past and why they have done it, and the part that goes missing is the rationale
rather than the outcome [raw/decisions--organizational-memory--conklin-cognexus-1997.md].
The prescription is to capture "the decision, the rationale behind it, the open questions
related to it, the assumptions behind it, and any related supporting information"
[raw/decisions--organizational-memory--conklin-cognexus-1997.md].

That same source is the sharpest available indictment of the artifact most teams rely on:
"meeting minutes are sketchy, represent only one person's point of view, and usually lack
the energy and context of the conversations they were meant to capture"
[raw/decisions--organizational-memory--conklin-cognexus-1997.md]. The complaint is that
minutes carry a single reading. A verbatim quote with a timestamp does not.

The one quantified return in this archive: a software team reviewing IBIS-structured
meeting records "found 11 errors in the software and its specification" and calculated they
"saved between three and six times the cost of documenting their design thinking in IBIS"
[raw/decisions--organizational-memory--conklin-cognexus-1997.md]. Caveats travel with it:
single team, single project, self-calculated, reported by the method's own author, 1997
[raw/decisions--organizational-memory--conklin-cognexus-1997.md]. Existence proof, not
effect size.

### The field set

From ADR practice, the five sections are title, context in value-neutral language, decision
in active voice starting "We will", status, and consequences positive and negative
[raw/decisions--adr-original--nygard-cognitect-2011.md]. Status is an explicit field with
values proposed, accepted, deprecated, superseded
[raw/decisions--adr-original--nygard-cognitect-2011.md].

From project decision-log practice, the conventional field list adds two things the ADR
template and the Littlebird summary both lack: **Alternatives** (what was considered and
rejected) and **Contributors** (who was in the room)
[raw/decisions--decision-log-fields--projectmanager-2025.md].

### Supersession is the whole point of keeping the old entry

When a decision changes, "we will keep the old one around, but mark it as superseded"
[raw/decisions--adr-original--nygard-cognitect-2011.md]. Deleting the prior entry destroys
the fact that a different decision was once current, which is exactly the fact a later
dispute turns on.

### Why anyone keeps a log at all

The stated purposes are communicating to stakeholders, defending a choice when questioned,
reminding a team of the agreed course so it is not re-litigated, and supplying history for
future planning [raw/decisions--decision-log-fields--projectmanager-2025.md]. The
defensibility framing is honest about what these logs are for
[raw/decisions--decision-log-fields--projectmanager-2025.md]. None of it is measured; that
source offers no study [raw/decisions--decision-log-fields--projectmanager-2025.md].

### Keep entries short

"Nobody ever reads large documents, either. Those documents are too large to open, read, or
update. Bite sized pieces are easier for all stakeholders to consume"
[raw/decisions--adr-original--nygard-cognitect-2011.md].

### Domain caveat

ADR practice covers software architecture decisions recorded by the team that made them,
not business decisions reached verbally with an external party
[raw/decisions--adr-original--nygard-cognitect-2011.md]. The format transfers by analogy.
The setting does not.

---

## 3. Deferred items are live obligations

A parking lot is "a place to capture comments, topics, or questions that are not related to
the meeting agenda" [raw/unresolved--parking-lots--nngroup-2019.md].

The failure mode is named directly: "Parking lots should offer outlines for future
discussion, research, or meetings. If they do not inform future action, they become only a
way to kindly tell someone that their contribution is worthless"
[raw/unresolved--parking-lots--nngroup-2019.md].

Prescribed handling: carry parked items into the follow-up, assign owner and timeline using
the who-does-what-when frame, group related items before assigning, and either reserve the
last 20 to 30 minutes of the session or schedule a dedicated follow-up one to two days
later [raw/unresolved--parking-lots--nngroup-2019.md].

Independently, the organizational memory source lists "the open questions related to it"
among the things that must be captured alongside a decision, rather than filed separately
[raw/decisions--organizational-memory--conklin-cognexus-1997.md]. Two sources from
different fields and different decades both treat the unresolved item as first-class.

### Named gap: the talked-over question

The NN/g guidance covers items a facilitator EXPLICITLY parked
[raw/unresolved--parking-lots--nngroup-2019.md]. The sweep found no source on the harder
case, a question that was asked, not acknowledged, and talked over, which nobody parked
because nobody registered it. The skill's detection heuristics for that case are
engineering judgment applied to a transcript, not a documented method, and must be
presented as such.

---

## 4. The confidentiality filter, and why the default is the defect

The category's default behavior is to push the internal artifact outward. Summaries and
transcripts are "circulated to attendees by the AI note-taking app," which can share
privileged material with every participant
[raw/confidentiality--notetaker-risks--mltaikins-2025.md].

The concrete shape of that default: Zoom AI Companion emails the summary link to the host
by default, and offers a host-set option to auto-share with "All meeting invitees,
including external participants"
[raw/distribution--summary-sharing-defaults--stonybrook-zoom-2025.md]. The documentation
describes changing who receives the summary and describes no step for reviewing or editing
what it says before automatic delivery
[raw/distribution--summary-sharing-defaults--stonybrook-zoom-2025.md].

### Generated summaries contain silent inventions

Three inaccuracy categories are named. Apps record immaterial detail with the same weight
as material detail. Apps "fill in the blank" with an incorrect guess rather than marking a
passage inaudible, so the failure is invisible in the output. And apps fabricate outright,
the example given being an app inventing a meeting with the Prime Minister out of unrelated
small talk [raw/confidentiality--notetaker-risks--mltaikins-2025.md].

The regulator's rule follows: "An AI summary of a client meeting should not be relied upon
until the participating lawyer has reviewed and verified it"
[raw/confidentiality--client-meeting-ethics--2civility-palmer-2026.md]. That is the
strongest statement in the archive that the summary is a draft input rather than a finding,
and it comes from a professionalism commission rather than a vendor
[raw/confidentiality--client-meeting-ethics--2civility-palmer-2026.md].

### What a written recap creates

A recap that quotes a call converts the conversation into a durable artifact held by
everyone who receives it. AI notetakers "could expose sensitive conversations to legal
discovery and dramatically expand the scope of discoverable material"
[raw/confidentiality--privilege-and-review--aba-gpsolo-2025.md], and AI-generated meeting
transcripts are described as discoverable evidence
[raw/consent--state-law-map--recordinglaw-2026.md]. A privileged conversation can become "a
permanent, searchable record" held by a cloud vendor
[raw/confidentiality--client-meeting-ethics--2civility-palmer-2026.md].

Durability is the feature. It is also the risk, and it is the same property in both cases.

### Vendor-side risks, for completeness

Cloud processing gives a third party access to otherwise confidential communications
[raw/confidentiality--privilege-and-review--aba-gpsolo-2025.md]. Most commercial AI systems
train on user inputs, raising the possibility that content is reproduced or leaked
[raw/confidentiality--privilege-and-review--aba-gpsolo-2025.md]. Data can be "inadvertently
sent to certain parties" through technical error or misconfiguration
[raw/confidentiality--notetaker-risks--mltaikins-2025.md]. Whether transcribing a
privileged conversation is itself a disclosure to a third party is explicitly unsettled
[raw/confidentiality--notetaker-risks--mltaikins-2025.md].

Recommended diligence: know "where the data goes, how long it is retained, whether the
vendor can use the content to train its models"
[raw/confidentiality--client-meeting-ethics--2civility-palmer-2026.md].

These are the user's tooling decisions, not the skill's. They are recorded here so the skill
does not pretend the question does not exist.

### Named gap: nothing here tells you what to strip

No source in this archive gives a rule for which meeting content is internal and which is
shareable. The client-recap source is silent on exclusions
[raw/followup--client-recap-rules--sakas-2019.md]. The legal sources address vendor access
and consent, not the composition of an outbound message
[raw/confidentiality--privilege-and-review--aba-gpsolo-2025.md],
[raw/consent--state-law-map--recordinglaw-2026.md]. The skill's filter categories are
reasoned from the risk pattern the archive establishes, not lifted from a source. Say so
where the skill states them.

---

## 5. Recipient-aware splitting is unsupported by this archive

The only splitting practice documented is by owner within a single shared document:
subsections so each person sees their own actionables
[raw/followup--client-recap-rules--sakas-2019.md].

Nothing in the archive documents producing DIFFERENT recaps for different parties from one
meeting. **Named gap.** The nearest supporting facts are indirect: the product option to
auto-share with all invitees including external participants
[raw/distribution--summary-sharing-defaults--stonybrook-zoom-2025.md], which is the
undifferentiated alternative, and the observation that where the other party ran its own
notetaker the user "may never see the recordings, transcripts, or summaries, and has no
ability to verify their accuracy"
[raw/confidentiality--client-meeting-ethics--2civility-palmer-2026.md], which means the
user's recap may be one of two competing written records of the same call.

The skill may still do recipient-aware splitting. It must present it as a design choice,
not as documented practice.

---

## 6. Recording disclosure, and why quoting a call is a disclosure event

**The single most load-bearing line in this archive:** "No jurisdiction currently treats
the visible presence of a recording bot in a meeting's participant list as legally
sufficient notice or consent" [raw/consent--all-party-states--circleback-2026.md].

Practice norms: disclose before recording and tell participants AI will process the audio;
in all-party consent states and under GDPR where consent is the lawful basis, affirmative
agreement rather than absence of objection is generally expected; maintain a policy
covering what is recorded, retention, access, and deletion requests
[raw/consent--all-party-states--circleback-2026.md]. On multi-state calls, "the prevailing
legal guidance is to follow the most restrictive state's requirements"
[raw/consent--all-party-states--circleback-2026.md]. If any participant objects, stop or do
not begin [raw/consent--all-party-states--circleback-2026.md].

Undisclosed recording is framed as a trust failure independent of legality: "An attorney
should not secretly activate an AI notetaker during a client conversation," because
undisclosed recording "is inconsistent with the candor and honesty lawyers owe clients"
[raw/confidentiality--client-meeting-ethics--2civility-palmer-2026.md].

### The jurisdiction conflict, unresolved

| | All-party consent list |
|---|---|
| Vendor source, 11 states [raw/consent--all-party-states--circleback-2026.md] | CA, CT, FL, IL, MD, MA, **MI**, MT, NH, PA, WA |
| Legal reference, 13 jurisdictions [raw/consent--state-law-map--recordinglaw-2026.md] | CA, CT, **DE**, FL, IL, MD, MA, MT, **NV**, NH, **OR**, PA, WA |

Ten states appear in both. Michigan appears only in the vendor list. Delaware, Nevada and
Oregon appear only in the legal reference, and Oregon's requirement is limited to in-person
conversations while phone and video use one-party consent
[raw/consent--state-law-map--recordinglaw-2026.md].

**Preferred reading:** the specialized legal reference outranks the notetaker vendor on a
question about the legality of notetakers, on ordinary source-hierarchy grounds. But
neither list was checked against statute here, four states are genuinely disputed, and the
skill gives no legal advice. It surfaces the conflict and stops.

Baseline: the federal ECPA, 18 U.S.C. Section 2511, "prohibits intentionally intercepting
wire, oral, or electronic communications," with stated exposure up to 5 years imprisonment,
$250,000 fines, and civil damages of $10,000 per violation
[raw/consent--state-law-map--recordinglaw-2026.md]. Courts are reported to be applying a
capability test from *Ambriz v. Google*, under which a vendor able to use intercepted data
for its own purposes such as model training may be treated as an unauthorized third-party
interceptor regardless of one-party consent rules
[raw/consent--state-law-map--recordinglaw-2026.md].

### Named gap: nothing addresses quoting a recording back to attendees

Asked directly, the legal reference gives no guidance on sharing transcripts or quoting a
recorded meeting [raw/consent--state-law-map--recordinglaw-2026.md]. No other source in the
archive addresses it either. The skill's rule that verbatim quoting is a disclosure event
is an inference from the bot-visibility finding
[raw/consent--all-party-states--circleback-2026.md] plus the undisclosed-recording trust
framing [raw/confidentiality--client-meeting-ethics--2civility-palmer-2026.md]. It is
reasoned, not sourced, and is presented to the user as a prompt to decide rather than as a
rule.

---

## 7. What this archive does not support

Collected so no guide accidentally overstates:

1. **No evidence that sending a recap improves follow-through.** Section 1, named gap.
2. **No evidence that keeping a decision log improves outcomes.** The defensibility claim
   is asserted [raw/decisions--decision-log-fields--projectmanager-2025.md] and untested.
3. **No documented method for detecting a talked-over question.** Section 3, named gap.
4. **No source rule for what to strip from a client-facing recap.** Section 4, named gap.
5. **No documented practice of producing different recaps for different parties.**
   Section 5, named gap.
6. **No accepted benchmark for AI meeting-summary accuracy.** The sweep for one returned
   ranked listicles of notetaker products. The only accuracy claims in the archive are
   qualitative categories from a law firm advisory
   [raw/confidentiality--notetaker-risks--mltaikins-2025.md]. No numbers.
7. **No verified state list.** Section 6, unresolved conflict.

Where a guide in this skill states something from this list, it says it is judgment.
