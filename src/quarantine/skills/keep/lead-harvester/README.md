# lead-harvester

Rebuilds the full list of people who raised a hand at your "comment KEYWORD to get it" campaign, ranks them, and drafts the first message to each one.

## What it does

You ran a campaign. Dozens commented, some skipped the comment and just sent a DM, a few sent friend requests, more only reacted. The platform showed each of them to you once, then it was gone. A week later you remember nine names and your inbox has a message saying "I DMd you and you haven't responded yet".

This skill reconstructs the roster from what Littlebird captured across comments, DMs, requests and reactions, merges duplicates into people, scores each one, sorts them into Hot, Warm, Light, Ambient and Carry-forward, and drafts a first touch per segment.

The power move is the capture protocol, and it runs before the harvest. Platforms collapse rosters into "X, Y and 4 others commented", so a list built from ambient capture is partial by construction. Sixty seconds of you scrolling the expanded thread during the campaign turns that into a near-complete roster, because Littlebird records what is on screen. No comment-to-DM tool does this. They work against a rationed API. This works on pixels you can already see.

## When to use it

- The launch is over and you need the actual list of everyone who asked for the thing.
- You have a folder of unanswered DMs and no idea who is in it.

Just ask for it. Trigger phrases include "who commented my keyword", "harvest my campaign leads", "who DMd me about the launch", "build my outreach list", "who raised their hand".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand | When a campaign closes | Harvest, dedupe, scoring, segments, drafted first touches, coverage report |
| Campaign watcher | Daily, 17:00 local, during an open window | Names new hand-raisers, counts the unnamed gap, flags second signals, tells you to scroll the thread |

On demand is primary. This is a post-mortem and most runs are one-off. Take the watcher only if a window is open now. The skill sets it up: it shows you the prompt and schedule, you approve, it creates it.

## What you get

One file, `campaign-harvest-YYYY-MM-DD.md`. The coverage report is section two so nobody misses it: named count, estimated total, the unnamed gap by surface with receipts, and the action that closes it.

Then the ranked roster. A row carries rank, name, segment, score, every signal with its timestamp and receipt, the verbatim that matters, and a confidence rating. Someone who commented Tuesday and DMd Thursday shows both lines and earns the combination bonus. After that: unresolved merges, exclusions with reasons, carry-forward names, every draft in full, and the scoring weights.

## What it needs

- The Littlebird MCP on a Power or Pro plan. Without it the skill stops rather than guessing.
- Sixty seconds scrolling the comment thread during the campaign. Optional, and the difference between a thin roster and a full one.
- A personal voice skill, optional. If installed, drafts go through it. If not, the skill writes plainly and says so.
- Your keyword, window, platform, post and offer. It asks. It never infers.

## Limits worth knowing

The roster is a floor, never a total. The coverage report always states the named set and the size of the unnamed gap, and says overlap between reaction and comment counts makes the estimate a ceiling rather than a headcount.

The score ranks priority. It does not qualify buyers. The weights come from published recency and frequency practice, not a validated instrument.

It drafts and holds. It never sends and never automates a platform action: no bulk friend requests, no scripted invites, no DM blast, not even where a connector allows it.

## Related skills

[comment-to-crm-piper](../comment-to-crm-piper/README.md), the daily sibling, for "anyone new since yesterday".
[deal-pipeline-reconstructor](../deal-pipeline-reconstructor/README.md), once a hand-raiser is a live deal.
[testimonial-miner](../testimonial-miner/README.md), for customers who already said something good.
[routine-architect](../routine-architect/README.md), to tune the campaign watcher.
[littlebird-voice-creator](../littlebird-voice-creator/README.md), to build the voice the drafts use.

## Under the hood

`SKILL.md` has the full instruction set. `references/` holds the guides, including `capture-protocol.md`, `signal-extraction-and-dedupe.md`, `scoring-and-segmentation.md` and `platform-rules.md`.

`references/research/` archives 15 primary sources, including Meta's spam and messaging policies and the FTC CAN-SPAM guide. Every domain claim traces to one.
