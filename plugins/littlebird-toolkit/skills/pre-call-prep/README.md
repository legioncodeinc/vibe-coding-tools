# pre-call-prep

A one screen brief for every call on your calendar, delivered before the call, where every line carries a fact you did not already have in your head.

## What it does

Brevity is the product. One screen per meeting, roughly a 90 second read, because you are scanning on a phone in a three minute gap between calls. Depth goes in an appendix. A brief nobody reads is worth nothing.

Each one covers who is on the call, what was said last time with the date, what each side committed to and whether there is evidence it happened, prior objections, what changed on their side, three talking points, and one line headed "do not forget". It runs straight off your calendar, so the routine is never told which calls exist.

Six shapes, one per meeting, never blended: sales call, partner sync, recurring standup, client review, multi-attendee logistics, first meeting. A standup gets the delta only. A client review puts any unresolved complaint at the top, above whatever you wanted to talk about.

## When to use it

- Back-to-back calls tomorrow and no time to read old notes.
- A quarterly review with a client you last spoke to in May.
- A first call with someone you know nothing about.

Just ask. Trigger phrases include "prep me for my calls", "what do I need to know before this meeting", "who am I talking to", "meeting prep", "call prep", "pre-call brief".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Daily routine | 18:30 the evening before, or 06:45 that morning | Every call on the target day, one screen each, plus an appendix |
| On demand | When you ask | One meeting in the next 48 hours, deeper appendix, and it can ask questions |

Take the evening slot: it leaves time to act on a commitment you forgot, where the morning version is fresher but leaves no room to fix anything. The skill asks which you want, shows you the prompt and schedule, then creates it.

## What you get

The routine writes `Pre-call brief for Thursday, August 20, 2026`: a header with call count, hours and first call time, one section per meeting in time order, then an appendix. On demand you get a file, `pre-call-prep-2026-08-20-acme-qbr.md`. An open loops row reads:

`They send the SOC 2 report | Acme, owner Priya | No evidence in the record since 2026-07-29`

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without it, it stops.
- Recorded prior meetings. With none you get the honest first-meeting brief: attendees, the booking description verbatim, and a line saying nothing is in the record.
- A web search tool, optional. Without one the brief says "internal record only" and continues rather than inventing company news.

## Limits worth knowing

**A contentless nudge does nothing, so the skill refuses to produce one.** The strongest study behind it is a preregistered field experiment across 7,196 meetings: a pre-meeting prompt with no content had no significant effect. Restated agendas and advice about how to run a meeting are exactly that prompt, and they are cut.

**An ambiguous attendee gets flagged, not guessed.** Where two people share a name, or the name matches but the email domain does not, the brief writes "Ambiguous" with both readings and attaches no history. A line read three minutes before a call gets believed and said out loud.

**No evidence is not a negative finding.** The open loops table writes "no evidence in the record since 2026-07-29", never "they did not send it". That decides whether you open a call apologizing for something you did.

**Health, financial detail, legal history, family circumstances, protected characteristics and home location stay out,** even where the capture holds them. Above seven attendees it briefs your slice rather than profiling the room.

## Related skills

- [daily-brief](../daily-brief/README.md), for the shape of the day rather than per-meeting depth.
- [meeting-scribe](../meeting-scribe/README.md), the other half of the cycle, after the call.
- [osint-investigator](../osint-investigator/README.md), when one person warrants a real dossier.
- [commitment-tracker](../commitment-tracker/README.md), for every open commitment rather than one call's.

## Under the hood

`SKILL.md` holds the instruction set and the routine prompt. Domain guides in `references/`: `upcoming-meeting-discovery.md`, `attendee-resolution.md`, `history-retrieval.md`, `brief-formats-by-meeting-type.md`. `references/research/` archives 12 primary sources, and every domain claim traces to one.
