# osint-investigator

Point it at a name and it builds one evidence-graded brief from two halves, your record of that person and their public footprint, with every disagreement left standing.

## What it does

The centerpiece is the relationship timeline. External tools find public footprints. Nothing else produces the dated record of every interaction between that person and you, receipt on each line: every thread, meeting, invite and screen sighting. It is why the skill exists and it gets the most space.

Around it sits the reconciliation, pairing what they told you against what they tell the world fact by fact. Conflicts stay conflicts: it will not settle one by picking the more recent, official or convenient reading unless the reason is on the line. It also tests agreements for false corroboration: a bio, a company page and a spoken self-introduction all originate with the subject, so five agreeing artifacts are one source.

First it binds the purpose. Four are allowed: partner diligence, prospect prep, negotiation prep, claim verification. There is no "just find everything" mode, because scope creep turns diligence into surveillance.

## When to use it

- You are about to sign with a partner you met three months ago.
- A negotiation next week, and you need what was said, with dates.

Just ask. Trigger phrases include "research this person", "build me a dossier on", "what do we know about", "vet this partner", "diligence on", "verify what they told me".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand | Only | Purpose gate, identity check, four internal passes, timeline, external research, reconciliation |
| Routine | None, by design | Not offered |

**There is no routine, by design.** A standing job that periodically re-researches a named individual is surveillance, not due diligence. A person is looked into once, for a stated reason, and the file carries a date. Littlebird would let this skill schedule itself, so the absence is a refusal, not a limitation. Ask for a standing watch and it offers a fresh run instead.

## What you get

One file, `dossier-jordan-webb-2026-08-17.md`. It opens with identity confirmation: what linked the record to one person, what was ruled out, what risk remains. Then reachability, the timeline, what they told you, what they tell the world, reconciliation, open questions with confidence per claim, and a prep pack.

A timeline entry:

`2026-05-12, meeting, Partner intro call. "We closed our Series A in 2019." Confirmed attendee via calendar event.`

The reconciliation entry beside it: their site says 2021. Both ship.

## What it needs

- The Littlebird MCP on a Power or Pro plan. No degraded mode: without the internal half this is a web search with ceremony, and it says so.
- Whatever web tools your session carries. Without them you get the internal half only.
- Every identifier you have: name, emails, company, role, profile URLs. That keeps a second person of the same name out of the file.

## Limits worth knowing

**Not for employment screening, and that is a refusal rather than a warning.** Hiring, promotion, retention, or any output destined for an employer stops the run, as does a request with no business relationship behind it.

**Sensitive categories are excluded by construction:** health, financial detail, criminal history, family circumstances, protected characteristics, home location, breach data, sanctions screening. Standard OSINT workflows include several of these and this one deliberately does not. Sanctions work needs licensed data, so you get a referral.

**External claims are reported as claims.** "Their site says X", never "X". That phrasing is what makes reconciliation readable.

**Claims get rated, never the person.** There is no confidence score for a human being. Absence is not a finding: "no evidence in the sources searched" is not "it did not happen".

**Not legal advice.** The research covers US and EU frameworks and holds no case law on the business-vetting boundary.

## Related skills

- [pre-call-prep](../pre-call-prep/README.md), lighter and per-meeting, when a call needs a brief not a dossier.
- [client-health-radar](../client-health-radar/README.md), which watches an account over time, not one person once.
- [deal-pipeline-reconstructor](../deal-pipeline-reconstructor/README.md), for the deal history a negotiation dossier sits in.

## Under the hood

`SKILL.md` holds the instruction set. Domain guides in `references/`: `purpose-binding-and-scope.md`, `internal-retrieval-brief.md`, `external-research-and-verification.md`, `reconciliation-and-confidence.md`, `dossier-template.md`. `references/research/` archives 13 primary sources, and every method claim traces to one.
