# Brief formats by meeting type

Five shapes. Pick one per meeting using the classifier in
`upcoming-meeting-discovery.md`. Do not blend them.

## The rule that governs every shape

**Every line must carry a fact the user did not already have in their head.**

That is not a style preference. The strongest study in the research archive is a
preregistered field experiment across 7,196 meetings that found a contentless
pre-meeting prompt produced no significant effect on meeting effectiveness
[research/distilled-call-preparation.md section 1]. Restating the agenda, telling the
user to set an objective, and reminding them to listen actively are all that prompt. Cut
them.

## The length contract

| Constraint | Value | Source |
|---|---|---|
| Per meeting, on screen | One screen. Target 90 seconds of reading. | [research/distilled-call-preparation.md section 2] |
| Whole day | Fits one scroll on a phone | Derived from the same |
| Depth | Goes in an appendix below the last meeting, never inline | [research/distilled-call-preparation.md section 2] |

The reader is scanning on a phone in a three minute gap between calls
[research/distilled-call-preparation.md section 2]. The brief's job is to compress a 15
to 20 minute research task into that gap
[research/distilled-call-preparation.md section 2].

Enforcement: if a meeting section exceeds roughly 200 words, cut it. Move the overflow to
the appendix under a heading naming the meeting. Never cut the open loops table to make
room; cut background.

## Shape 1: sales call

Used when the counterparty is a prospect or an active deal. MEDDIC gives the slot list
[research/distilled-call-preparation.md section 7], and **which slots the record cannot
fill is the most useful thing this brief says**. Mapping MEDDIC elements to brief slots is
an authored design decision over the published definitions, not a claim the source makes
[research/distilled-call-preparation.md section 7].

```
### 10:00 AM  Northgate, technical follow-up  (45 min)
**With:** Priya Raman, VP Engineering, Northgate  [High confidence]
**Stage:** third call. Prior: 2026-06-18 intro, 2026-07-29 integration review.

**Last time (2026-07-29):**
> "we would need the SSO piece done before we could put it in front of our security team"

**Open loops**
| Owner | What | Status |
|---|---|---|
| You | Send SOC 2 report | No evidence in the record since 2026-07-29 |
| Priya | Introduce the security lead | Done, calendar invite 2026-08-14 |

**Still unknown:** economic buyer, decision process, budget timing.
**Raised before:** seat-based pricing, called a problem for a seasonal team. No response
in the record. Expect it again.
**Changed on their side:** raised a Series B, 2026-08-05. [url]

**Three points:** SSO shipped 8/12. SOC 2 attached. Seasonal pricing tier exists.
**Do not forget:** you owe her the SOC 2 report. Lead with it.
```

Why the "still unknown" line exists: the buyer arrives already informed, having defined
requirements before speaking with sales in most cases, and generic outreach is actively
penalized [research/distilled-call-preparation.md section 4]. Naming the gaps in what the
user knows is more actionable than restating what they know.

## Shape 2: partner sync

Reciprocal rather than one directional. Neither side is selling. The failure mode is a
forgotten commitment, so the open loops table is the centerpiece and it is symmetrical.

```
### 11:30 AM  Bellweather partner sync  (30 min)
**With:** Sam Torres, Head of Partnerships  [High confidence]
**Prior:** 4 calls since 2026-03. Most recent 2026-07-31.

**Open loops, both directions**
| Owner | What | Status |
|---|---|---|
| You | Draft the co-marketing one pager | No evidence since 2026-07-31 |
| You | Confirm the Q4 webinar date | Done, thread 2026-08-08 |
| Sam | Send their partner tier pricing | No evidence since 2026-07-31 |
| Unassigned | Decide who owns the joint landing page | Never assigned |

**Since last time:** they announced a competing integration on 2026-08-11. [url]
**Three points:** webinar date confirmed. Landing page owner needs deciding today. Ask
what the new integration means for scope.
**Do not forget:** the one pager is yours and it is late.
```

Drop the external section to one line unless something genuinely changed. Partner syncs
recur; the delta is the content.

## Shape 3: recurring standup or internal recurring meeting

The shortest shape. The named failure mode of a recurring meeting is collapsing into a
repeated status readout [research/distilled-call-preparation.md section 5], and a brief
that reprints the same relationship summary every week is the document version of that
failure [research/distilled-call-preparation.md section 5].

**This shape leads with the delta and nothing else.** No attendee profiles. No company
background. No external research.

```
### 9:15 AM  Eng standup  (15 min)
**Since Friday:** the migration ticket you raised is still open. Two of your three
action items from 2026-08-14 show no completion evidence.
**Your open items:** review the schema PR, reply to Dana about the staging window.
**Carried over:** the staging window question has now appeared in three consecutive
standups without resolution. Escalate or drop it.
**Do not forget:** you said you would have the PR reviewed by today.
```

The "carried over" line is the escalation rule made visible. When the routine's own past
reports show the same item three runs running, the brief says so and tells the user to
escalate. See the routine wiring section in SKILL.md.

If nothing changed since the last instance, say that in one line and stop:

```
### 9:15 AM  Eng standup  (15 min)
Nothing changed since Friday's brief. Your two open items are still open.
```

## Shape 4: client review

The counterparty is already a customer. The risk is not losing a deal, it is being
surprised by a complaint. Lead with commitments and concerns, not with opportunity.

```
### 2:00 PM  Acme quarterly review  (60 min)
**With:** Dana Osei, Ops Director; Marcus Feld, Analyst  [Dana High, Marcus Medium]
**Prior:** 6 calls since 2025-11. Most recent 2026-05-20.

**What they raised last time:**
> "the export still times out on anything over about fifty thousand rows"
[Acme quarterly review, 2026-05-20, Risks / Open Questions]
**How it was handled:** engineering ticket promised. No evidence in the record that it
shipped.

**Open loops**
| Owner | What | Status |
|---|---|---|
| You | Export timeout fix | No evidence since 2026-05-20 |
| Dana | Nominate a second admin | Done, 2026-06-09 |

**Since last time:** Marcus is new to the record. Resolved by domain only; the person is
new. Treat as an unknown in the room.
**Three points:** confirm the export status honestly. Second admin is live. Ask about
their fiscal planning cycle.
**Do not forget:** the export complaint is unresolved and it will come up first.
```

The rule specific to this shape: an unresolved complaint goes at the top of the brief,
above anything the user wants to talk about.

## Shape 5: large multi-attendee logistics call

Decision effectiveness declines with each attendee past seven, and a group of seventeen
or more rarely makes decisions at all
[research/distilled-call-preparation.md section 6]. A twenty six person logistics call is
not a decision forum, so a per-person dossier is aimed at the wrong job and would not fit
on one screen regardless.

**This shape briefs the user's slice, not the room.**

```
### 4:00 PM  Summit run-of-show  (26 attendees, 60 min)
**Your slice:** you own the sponsor demo block, 2:00 to 2:30 on day two.
**Who matters to your slice:** Elena Vasquez (organizer, sets the run of show),
Tom Brady-Lin (AV, owns the demo laptop handoff).
**Your open items:** demo script not sent. Elena asked for it on 2026-08-11.
**Likely to come up:** the day two schedule shifted by 30 minutes on 2026-08-13; your
block may move.
**Do not forget:** send the demo script before this call, not after.

*Roster: 26 invited, 3 resolved to the record, 23 unresolved. Full list in appendix.*
```

The roster line is mandatory and states resolved, unresolved, and total. Presenting a
partial roster as complete is the fastest way to lose the user's trust
[evidence-standards.md]. Full unresolved roster goes in the appendix as plain
names and domains, labelled unresolved.

## Shape 6: first meeting

Not on the original list of five but it is the most common shape for a growing calendar
and it is structurally different: mostly external research and booking context, almost no
internal record.

```
### 3:00 PM  Intro call  (30 min)
**With:** jordan.reyes@northgate.io. No internal record for this address.
Company known: 2 prior calls with other Northgate people since 2026-06.
**Calendar says:** "Want to talk through whether your API can handle our EU data
residency requirement." [verbatim from the invite description, 2026-08-15]
**External:** Northgate raised a Series B on 2026-08-05. [url] Jordan lists Head of
Platform on their public profile. [url]
**Three points:** EU residency is live. Two other Northgate conversations are already
open. Ask who else internally is evaluating.
**Do not forget:** you are already talking to Priya at the same company. Do not let this
look uncoordinated.
```

The booking description is the highest value line in a first meeting brief because it is
a first person statement of intent from the other side. Quote it verbatim, never
paraphrase, and never extrapolate from it
[upcoming-meeting-discovery.md].

When there is genuinely nothing, the brief says there is nothing. See the honest empty
brief template in `upcoming-meeting-discovery.md`.

## Selecting between shapes when a meeting fits two

Precedence, highest first:

1. Attendee count above 7 wins. Use shape 5 regardless of what else is true.
2. A confirmed prior instance by title wins over relationship type. Use shape 3 for
   internal recurring, or fold the delta lead into shape 1, 2 or 4 for external recurring.
3. Existing customer wins over prospect. Use shape 4.
4. Prospect or active deal wins over generic partner. Use shape 1.
5. No internal record for any attendee. Use shape 6.

## What never appears in any shape

- The meeting's own agenda restated back to the user.
- Advice about how to conduct a meeting.
- A talking point that is not grounded in a retrieved observation or a cited external
  source.
- A statistic from the research archive. Those numbers are mostly unverified vendor
  attributions [research/distilled-call-preparation.md section 10] and they belong in the
  design rationale, not in a brief the user reads before a call.
- Health, financial detail, legal history, family circumstances, protected
  characteristics, or precise home location about any attendee
  [evidence-standards.md].
- An inference presented without its hedge [evidence-standards.md].
