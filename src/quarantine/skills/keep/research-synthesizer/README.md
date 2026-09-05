# research-synthesizer

Give it a topic and get back what you already knew, what is new since then and where the sources disagree, all with working links.

## What it does

An ordinary research tool starts from zero. It hands you a pile you have partly read, the one thing that changed buried inside. You pay for it twice.

This skill knows what crossed your screen and when, because Littlebird captured it. So it leads with the delta: what you already met, what is new since, where sources conflict, what you appear to believe from what you said.

That last part is what no external tool can do. Discovering a working assumption is three months stale is the best output here, and it comes from comparing your words against a fresh sweep.

## When to use it

- You are deciding on a topic you last read about in spring.
- You need to brief yourself before a call without more reading.
- You suspect what you believe about a tool has quietly expired.

Just ask for it. Trigger phrases include "research this topic", "catch me up on", "what do I already know about", "is what I think about this still true" and "what did I miss on".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand | Any topic, 180 days of exposure | The synthesis file, seven sections |
| Routine | Weekly, Wednesday 08:00 local | Only what is new since the last report, five items max |

On demand is the primary mode: this answers a question rather than covering a beat. Add a standing watch only for a topic you need tracked, weekly not daily, since a topic with daily news is one you live inside already. After three quiet reports it recommends monthly, or retirement. The skill creates it, showing you the prompt and schedule.

## What you get

One file per run, `research-synthesis/YYYY-MM-DD-topic-slug.md`, in seven sections: already in your context, new since then, where sources disagree, what you appear to believe, open questions, sources and a method record. Section two carries the delta:

```
2026-07-14  Pricing moved to per-seat. Vendor changelog, https://...
            Postdates your exposure. Last capture on this: 2026-03-02
```

The method record lets you check the work: what was searched, what was kept, what was skipped.

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without the internal half there is no delta, just a web search, and it says so.
- Web search and fetch tools. Without them the internal half still ships, with everything downstream marked unrun.
- Five minutes of scoping. The alias list is your highest-value answer, since capture is indexed by the words on screen, not your name for the topic.

## Limits worth knowing

Reading is not believing. What you said in a message or on a call is evidence of a position. What merely appeared on screen is exposure, compatible with agreeing, disagreeing or closing the tab. So the belief section is built from utterances alone, and ships empty when you have none.

It runs a criticism query on every topic without being asked, because a topic-term-only sweep returns the half of the material with the strongest commercial incentive behind it. Where sources are dominated by parties selling into the category, that heads the list.

Every URL is opened before it is cited. A link that will not resolve gets the claim dropped, not hedged.

The internal half is never everything you know, only what was captured, and the statement saying so is mandatory. Nothing is sent or published without you approving the text.

## Related skills

[competitor-watch](../competitor-watch/README.md), for the same fusion on a recurring beat against named rivals. [said-it-already](../said-it-already/README.md), before making a synthesis public. [knowledge-base-builder](../knowledge-base-builder/README.md), when the unit is your own project. [daily-brief](../daily-brief/README.md), operational and daily rather than deep.

## Under the hood

`SKILL.md` carries the five internal passes, the sweep order and the routine prompt verbatim. Guides under `references/`: `topic-scoping.md`, `internal-exposure-retrieval.md`, `external-sweep-and-source-grading.md`, `synthesis-and-delta.md`.

`references/research/` holds 15 archived primary sources on synthesis method, source credibility, commercial interest and AI citation failures. Every claim traces to one.
